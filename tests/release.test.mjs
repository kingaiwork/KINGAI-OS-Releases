import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createHash} from 'node:crypto';
import {auditReleaseMeta,verifySidecars} from '../scripts/verify-release.mjs';

const hash='a'.repeat(64);
function fixture(){
  const tag='v0.1.0-dev';
  const asset=(name,size,body)=>{
    const digest=body===undefined?hash:createHash('sha256').update(body).digest('hex');
    return {name,size,state:'uploaded',digest:'sha256:'+digest,
      browser_download_url:'https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/'+tag+'/'+name};
  };
  const desktop='KINGAI-OS-Desktop-0.1.0-dev-amd64.iso';
  const server='KINGAI-OS-Server-0.1.0-dev-amd64.iso';
  const dText=hash+'  '+desktop+'\n';
  const sText=hash+'  '+server+'\n';
  return {release:{tag_name:tag,draft:false,prerelease:true,assets:[
    asset(desktop,2000000000),asset(desktop+'.sha256',dText.length,dText),
    asset(server,1200000000),asset(server+'.sha256',sText.length,sText)
  ]},sidecars:new Map([[desktop+'.sha256',dText],[server+'.sha256',sText]])};
}

test('valid Desktop/Server preview has digest and sidecars',async()=>{
  const {release,sidecars}=fixture();
  const check=auditReleaseMeta(release);
  assert.equal(check.ok,true,check.errors.join('; '));
  const fetcher=async url=>({ok:true,text:async()=>sidecars.get(decodeURIComponent(url.split('/').pop()))});
  assert.deepEqual(await verifySidecars(release,fetcher),[]);
});
test('dev tag cannot masquerade as stable',()=>{
  const {release}=fixture();release.prerelease=false;
  assert.equal(auditReleaseMeta(release).ok,false);
});
test('missing checksum companion fails without downloading ISO',()=>{
  const {release}=fixture();release.assets=release.assets.filter(a=>!a.name.endsWith('.sha256'));
  assert.ok(auditReleaseMeta(release).errors.some(x=>x.includes('sidecar missing')));
});
test('reject unsigned or wrong-origin assets',()=>{
  const {release}=fixture();release.assets[0].digest=null;
  release.assets[1].browser_download_url='https://example.invalid/checksum';
  assert.ok(auditReleaseMeta(release).errors.length>=2);
});
test('reject checksum payload that does not match published ISO digest',async()=>{
  const {release,sidecars}=fixture();sidecars.set(release.assets[1].name,'b'.repeat(64)+'  '+release.assets[0].name+'\n');
  const fetcher=async url=>({ok:true,text:async()=>sidecars.get(url.split('/').pop())});
  const errors=await verifySidecars(release,fetcher);
  assert.ok(errors.some(x=>x.includes('checksum disagrees')));
});

test('reject canonical-prefix URL substitution and unsafe filenames',()=>{
  const {release}=fixture();
  release.assets[0].browser_download_url += '.substitute';
  assert.ok(auditReleaseMeta(release).errors.some(x=>x.includes('exact canonical filename')));
  const other=fixture().release;
  other.assets[0].name='../wrong.iso';
  assert.ok(auditReleaseMeta(other).errors.some(x=>x.includes('invalid release asset filename')));
});

test('reject oversized streamed sidecars before buffering unbounded data',async()=>{
  const {release}=fixture();
  const huge=new Uint8Array(5000).fill(97);
  const fetcher=async()=>({ok:true,body:new ReadableStream({start(controller){controller.enqueue(huge);controller.close();}})});
  const errors=await verifySidecars(release,fetcher);
  assert.ok(errors.some(x=>x.includes('sidecar exceeds bounded length')),errors.join('; '));
});
