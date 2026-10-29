#!/usr/bin/env node
// Read-only, bounded ISO download URL reachability. NOT a full ISO download,
// byte-level SHA-256 verification, installation certification or release approval.
import {pathToFileURL} from 'node:url';

export async function auditHead(assets, fetcher=fetch) {
  const errors=[];
  if(!Array.isArray(assets))return ['Expected ISO release asset array'];
  for(const asset of assets) {
    if(!asset?.name?.endsWith('.iso'))continue;
    const expected='https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/'+asset.name;
    if(asset.browser_download_url!==expected || !/^[A-Za-z0-9][A-Za-z0-9._-]+\.iso$/.test(asset.name)) {
      errors.push('Noncanonical or unsafe download URL '+String(asset.name));
      continue;
    }
    try {
      const response=await fetcher(asset.browser_download_url, {
        method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(30000),
        headers:{'User-Agent':'KINGAI-OS-download-reachability-HEAD'}
      });
      if(!response.ok) {
        errors.push('ISO download HTTP '+response.status+': '+asset.name);
        continue;
      }
      const length=response.headers?.get?.('content-length');
      if(length!==null && length!==undefined && length!=='' && Number(length)!==asset.size){
        errors.push('Download length differs from GitHub published asset size: '+asset.name);
      }
    } catch(error) {
      errors.push('ISO download HEAD failed: '+asset.name+': '+String(error.message||error));
    }
  }
  return errors;
}

async function main(){
  const headers={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',
    'User-Agent':'KINGAI-OS-download-reachability-HEAD'};
  if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
  const url='https://api.github.com/repos/kingaiwork/KINGAI-OS-Releases/releases/tags/v0.1.0-dev';
  const r=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});
  if(!r.ok)throw new Error('Release API unavailable HTTP '+r.status);
  const release=await r.json();
  const isos=release.assets.filter(a=>a.name?.endsWith('.iso'));
  if(isos.length!==2 || !isos.some(a=>a.name.includes('Desktop')) || !isos.some(a=>a.name.includes('Server'))) {
    throw new Error('Expected exactly two publicly released preview ISOs');
  }
  const errors=await auditHead(isos);
  console.log(JSON.stringify({status:errors.length?'FAIL':'PASS',method:'HEAD only, no multi-GB download',
    checked:isos.map(a=>a.name),errors,installTested:false,gaAuthorized:false},null,2));
  if(errors.length)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(e=>{console.error(String(e));process.exitCode=1;});
}
