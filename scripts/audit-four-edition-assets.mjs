#!/usr/bin/env node
/**
 * Four-edition PUBLIC ASSET INVENTORY audit.
 * A PASS proves only that a release record lists 4 uploaded AMD64 ISO
 * assets, GitHub-computed SHA-256 metadata, and corresponding sidecars.
 * It does NOT prove installer, secure boot, hardware, signing, updates,
 * rollback, licenses, security or commercial GA readiness.
 * Real sidecar content must also pass scripts/verify-release.mjs.
 */
import {pathToFileURL} from 'node:url';

export const editions = Object.freeze([
  ['desktop','Desktop'], ['server','Server'], ['edge','Edge'],
  ['ai-workstation','AI-Workstation']
]);
const allowedTag = /^v[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9][a-z0-9.-]*)?$/;
const shaPattern = /^sha256:[0-9a-f]{64}$/i;
const base = 'https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/';

export function auditFourEditionAssets(release) {
  const errors=[], info=[];
  if(!release || typeof release!=='object') return {
    ok:false,errors:['No published release'],editions:info,certified:false,gaAuthorized:false
  };
  const tag = String(release.tag_name || '');
  if(!allowedTag.test(tag)) errors.push('Invalid release version tag');
  if(release.draft) errors.push('Draft is not publicly downloadable');
  const items=Array.isArray(release.assets)?release.assets:[];
  const grouped=new Map();
  for(const item of items) {
    if(typeof item?.name!=='string' || grouped.has(item.name)) {
      errors.push('Missing or duplicate asset filename: '+String(item?.name));
      continue;
    }
    grouped.set(item.name,item);
  }
  const expected=new Set();
  for(const [id,label] of editions) {
    const iso=`KINGAI-OS-${label}-${tag.slice(1)}-amd64.iso`;
    const sidecar=iso+'.sha256';
    expected.add(iso);
    expected.add(sidecar);
    const image=grouped.get(iso), sums=grouped.get(sidecar);
    const item={edition:id,iso,isoPresent:!!image,sidecarPresent:!!sums,
      isoDigestVerifiedFromGitHubMetadata:false};
    if(!image) errors.push('Missing edition ISO: '+id);
    else {
      if(image.state!=='uploaded') errors.push('ISO not fully uploaded: '+id);
      if(!Number.isSafeInteger(image.size) || image.size<100*1024*1024)
        errors.push('Suspicious ISO size: '+id);
      if(!shaPattern.test(String(image.digest||'')))
        errors.push('Missing GitHub SHA-256 digest: '+id);
      else item.isoDigestVerifiedFromGitHubMetadata=true;
      if(image.browser_download_url!==base+tag+'/'+iso)
        errors.push('Noncanonical ISO download URL: '+id);
    }
    if(!sums) errors.push('Missing edition checksum sidecar: '+id);
    else {
      if(sums.state!=='uploaded') errors.push('Sidecar not fully uploaded: '+id);
      if(!shaPattern.test(String(sums.digest||'')))
        errors.push('Missing sidecar SHA-256 metadata: '+id);
      if(!Number.isSafeInteger(sums.size) || sums.size<80 || sums.size>4096)
        errors.push('Unexpected sidecar size: '+id);
      if(sums.browser_download_url!==base+tag+'/'+sidecar)
        errors.push('Noncanonical sidecar URL: '+id);
    }
    info.push(item);
  }
  for(const item of items) if(/\.iso$/i.test(String(item?.name||''))&&!expected.has(item.name))
    errors.push('Unexpected or unreviewed ISO: '+item.name);
  return {ok:errors.length===0,errors,tag,editions:info,
    certified:false,gaAuthorized:false,
    scope:'release asset metadata only; actual installer/hardware/rollback/signature proof REQUIRED'};
}

async function main() {
  const token=process.env.GITHUB_TOKEN;
  const headers={'Accept':'application/vnd.github+json','User-Agent':'KINGAI-OS-four-edition-readiness'};
  if(token) headers.Authorization='Bearer '+token;
  const tag=(process.env.KINGAI_RELEASE_TAG||'v0.1.0-dev').trim();
  if(!allowedTag.test(tag)) throw Error('Unsafe requested release tag');
  const url='https://api.github.com/repos/kingaiwork/KINGAI-OS-Releases/releases/tags/'+encodeURIComponent(tag);
  const response=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});
  if(!response.ok) throw Error('Release inventory not accessible: HTTP '+response.status);
  const audit=auditFourEditionAssets(await response.json());
  console.log(JSON.stringify({readiness:audit.ok?'FOUR_ISOS_LISTED':'BLOCKED_MISSING_OFFICIAL_ASSETS',...audit},null,2));
  if(process.env.KINGAI_REQUIRE_FOUR_ISO==='YES'&&!audit.ok) process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)
  main().catch(e=>{console.error(String(e));process.exitCode=1});
