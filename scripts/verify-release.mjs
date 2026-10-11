#!/usr/bin/env node
// Read-only release authenticity checks. Do not download multi-GB ISOs, mutate
// releases, assert secure boot, or reclassify previews as production-stable.
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const owner='kingaiwork';
const name='KINGAI-OS-Releases';
const isoMinBytes=100*1024*1024;
const digestRE=/^sha256:[a-f0-9]{64}$/i;

export function auditReleaseMeta(release){
  const errors=[];
  if(!release||typeof release!=='object')return {ok:false,errors:['release payload unavailable'],isos:[]};
  if(release.draft)errors.push('draft release is not a published release');
  if(!/^v\d+\.\d+\.\d+(?:[-+][a-z0-9.-]+)?$/i.test(String(release.tag_name||'')))errors.push('unexpected version tag');
  if(/(?:^|[-.])(dev|alpha|beta|rc)(?:[-.]|$)/i.test(String(release.tag_name||'')) && !release.prerelease){
    errors.push('preview/development release must be flagged prerelease');
  }
  const assets=Array.isArray(release.assets)?release.assets:[];
  const byName=new Map();
  for(const a of assets){
    if(!a?.name || byName.has(a.name))errors.push('empty or duplicate asset filename');
    else byName.set(a.name,a);
    if(a?.state!=='uploaded')errors.push('asset not fully uploaded: '+(a?.name||'?'));
    if(!digestRE.test(String(a?.digest||'')))errors.push('missing GitHub SHA-256 digest: '+(a?.name||'?'));
    const expected='https://github.com/'+owner+'/'+name+'/releases/download/'+release.tag_name+'/';
    if(!String(a?.browser_download_url||'').startsWith(expected))errors.push('asset URL outside canonical release: '+(a?.name||'?'));
  }
  const isos=assets.filter(a=>/\.iso$/i.test(a.name||''));
  if(!isos.some(a=>/Desktop/i.test(a.name)))errors.push('Desktop ISO absent');
  if(!isos.some(a=>/Server/i.test(a.name)))errors.push('Server ISO absent');
  for(const iso of isos){
    if(!(Number.isSafeInteger(iso.size)&&iso.size>=isoMinBytes))errors.push('ISO suspicious size: '+iso.name);
    const companion=byName.get(iso.name+'.sha256');
    if(!companion)errors.push('SHA-256 sidecar missing: '+iso.name);
    else if(!(Number.isSafeInteger(companion.size)&&companion.size>50&&companion.size<=4096)){
      errors.push('invalid SHA-256 sidecar byte size: '+companion.name);
    }
  }
  return {ok:errors.length===0,errors,isos:isos.map(a=>a.name)};
}

function sidecarDigest(text,isoName){
  const lines=text.trim().split(/\r?\n/);
  if(lines.length!==1)return null;
  const m=lines[0].match(/^([a-f0-9]{64})\s+\*?(.+)$/i);
  return m && m[2]===isoName ? m[1].toLowerCase() : null;
}

export async function verifySidecars(release,fetcher=fetch){
  const errors=[];
  const assets=new Map(release.assets.map(a=>[a.name,a]));
  for(const iso of release.assets.filter(a=>/\.iso$/i.test(a.name))){
    const sidecar=assets.get(iso.name+'.sha256');
    if(!sidecar)continue;
    try{
      const response=await fetcher(sidecar.browser_download_url);
      if(!response.ok)throw new Error('HTTP '+response.status);
      const text=await response.text();
      if(text.length>4096)throw new Error('sidecar exceeds bounded length');
      const actualHash=createHash('sha256').update(text).digest('hex');
      const publishedHash=String(sidecar.digest||'').replace(/^sha256:/i,'').toLowerCase();
      if(actualHash!==publishedHash)errors.push('sidecar asset differs from GitHub SHA-256 digest: '+sidecar.name);
      const checksum=sidecarDigest(text,iso.name);
      if(!checksum)errors.push('checksum line does not identify exact ISO: '+iso.name);
      else if(checksum!==String(iso.digest||'').replace(/^sha256:/i,'').toLowerCase()){
        errors.push('ISO checksum disagrees with GitHub release digest: '+iso.name);
      }
    }catch(error){errors.push('sidecar read failed: '+sidecar.name+': '+String(error.message||error));}
  }
  return errors;
}

async function main(){
  const headers={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'KINGAI-OS-release-readonly-validator'};
  if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
  const requested=(process.env.KINGAI_RELEASE_TAG||'').trim();
  const endpoint=requested
    ? 'https://api.github.com/repos/'+owner+'/'+name+'/releases/tags/'+encodeURIComponent(requested)
    : 'https://api.github.com/repos/'+owner+'/'+name+'/releases?per_page=20';
  const response=await fetch(endpoint,{headers});
  if(!response.ok)throw new Error('GitHub release read failed: HTTP '+response.status);
  const value=await response.json();
  const release=requested?value:(Array.isArray(value)?value.find(x=>!x.draft):null);
  const audit=auditReleaseMeta(release);
  if(audit.ok)audit.errors.push(...await verifySidecars(release));
  audit.ok=audit.errors.length===0;
  const result={status:audit.ok?'PASS':'FAIL',tag:release?.tag_name||null,prerelease:release?.prerelease??null,checks:'release metadata SHA-256 + bounded sidecar checksums',isos:audit.isos,errors:audit.errors};
  console.log(JSON.stringify(result,null,2));
  if(!audit.ok)process.exitCode=1;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(error=>{console.error('KINGAI OS release integrity check failed: '+String(error.message||error));process.exitCode=1});
}
