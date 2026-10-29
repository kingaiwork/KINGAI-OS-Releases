#!/usr/bin/env node
// Read-only contract: public product catalog must match real GitHub release assets.
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const owner='kingaiwork';
const repo='KINGAI-OS-Releases';
const digestRE=/^[a-f0-9]{64}$/i;
const prefix='https://github.com/'+owner+'/'+repo+'/releases/download/';

export function auditCatalogAgainstRelease(catalog,release){
  const errors=[];
  const editions=Array.isArray(catalog?.editions)?catalog.editions:[];
  if(editions.map(x=>x?.id).join(',')!=='desktop,server,edge,ai-workstation')errors.push('must specify exactly four editions in authoritative order');
  if(!release||release.draft||!release.prerelease)errors.push('no published developer prerelease is available');
  const version=String(release?.tag_name||'').replace(/^v/,'');
  const assets=new Map(Array.isArray(release?.assets)?release.assets.map(x=>[x.name,x]):[]);
  for(const edition of editions){
    const published=edition?.releaseStatus==='developer-preview';
    if(published){
      if(!['desktop','server'].includes(edition.id))errors.push('only Desktop/Server previews may be marked available');
      if(edition.version!==version)errors.push('outdated version for '+edition.id);
      if(JSON.stringify(edition.architecture)!=='["amd64"]')errors.push('unsupported architecture claim: '+edition.id);
      const asset=assets.get(edition.image);
      if(!asset)errors.push('missing ISO release asset '+edition.image);
      else{
        const realDigest=String(asset.digest||'').replace(/^sha256:/i,'').toLowerCase();
        if(!digestRE.test(realDigest)||realDigest!==edition.sha256)errors.push('release/catalog hash conflict '+edition.id);
        if(asset.browser_download_url!==edition.download || !edition.download.startsWith(prefix+release.tag_name+'/'))errors.push('noncanonical download URL '+edition.id);
        if(!assets.has(edition.image+'.sha256'))errors.push('missing checksum companion '+edition.id);
      }
    }else if(edition.releaseStatus==='planned'){
      for(const key of ['version','image','download'])if(edition[key]!==null)errors.push('planned edition incorrectly publishes '+key+': '+edition.id);
    }else errors.push('unsupported releaseStatus '+edition?.id);
  }
  if(!catalog?.policies?.release)errors.push('missing release-claims policy');
  return {ok:errors.length===0,errors,checkedTag:release?.tag_name||null};
}

async function main(){
  const catalog=JSON.parse(readFileSync(new URL('../catalog/product-family.json',import.meta.url),'utf8'));
  const headers={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'KINGAI-OS-catalog-consistency'};
  if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
  const url='https://api.github.com/repos/'+owner+'/'+repo+'/releases?per_page=20';
  const res=await fetch(url,{headers});
  if(!res.ok)throw new Error('Cannot verify real release: HTTP '+res.status);
  const releases=await res.json();
  const release=Array.isArray(releases)?releases.find(r=>!r.draft):null;
  const report=auditCatalogAgainstRelease(catalog,release);
  console.log(JSON.stringify({status:report.ok?'PASS':'FAIL',...report},null,2));
  if(!report.ok)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(e=>{console.error(String(e));process.exitCode=1;});
}
