#!/usr/bin/env node
// Read-only public release sentry. This is an alert, not GitHub release protection.
// Publishing a GA outside this workflow remains possible; required protection is separate.
import {pathToFileURL} from 'node:url';

export function auditPublishedReleases(releases) {
  const errors=[];
  if (!Array.isArray(releases)) return {ok:false,errors:['Expected release API array']};
  for(const release of releases) {
    if (!release || typeof release!=='object') {
      errors.push('Malformed release entry');
      continue;
    }
    if(release.draft) continue;
    if(release.prerelease===false) {
      errors.push(
        'UNAUTHORIZED GA DETECTED: '+String(release.tag_name||'untagged')+'. '+
        'Do not advertise production-ready status until externally verified Ed25519 release signature, '+
        'hardware+installer+upgrade/rollback evidence and human GA approval are recorded.'
      );
    } else if(release.prerelease!==true) {
      errors.push('Unknown non-draft release class: '+String(release.tag_name||'untagged'));
    }
  }
  return {ok:errors.length===0,errors,checkedReleases:releases.length,
    reviewedProductionReleases:0};
}

async function main(){
  const headers={
    'Accept':'application/vnd.github+json',
    'X-GitHub-Api-Version':'2022-11-28',
    'User-Agent':'KINGAI-OS-independent-GA-alert',
  };
  if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
  const res=await fetch(
    'https://api.github.com/repos/kingaiwork/KINGAI-OS-Releases/releases?per_page=100',
    {headers,signal:AbortSignal.timeout(30000)}
  );
  if(!res.ok)throw new Error('Failed to read public release list: HTTP '+res.status);
  const report=auditPublishedReleases(await res.json());
  console.log(JSON.stringify({status:report.ok?'PASS':'BLOCKED',...report},null,2));
  if(!report.ok)process.exitCode=1;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(err=>{console.error(String(err));process.exitCode=1;});
}
