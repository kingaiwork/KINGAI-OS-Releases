import test from 'node:test';
import assert from 'node:assert/strict';
import {auditHead} from '../scripts/check-download-head.mjs';

const base='https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/';
const a={name:'KINGAI-OS-Desktop-0.1.0-dev-amd64.iso',size:2139549696,
  browser_download_url:base+'KINGAI-OS-Desktop-0.1.0-dev-amd64.iso'};

test('valid 200 with exact byte length passes without body download',async()=>{
  let called=0;
  const errors=await auditHead([a],async(url,opt)=>{
    called++; assert.equal(opt.method,'HEAD');assert.equal(url,a.browser_download_url);
    return {ok:true,status:200,headers:{get:()=>String(a.size)}};
  });
  assert.equal(called,1);assert.deepEqual(errors,[]);
});
test('404 and mismatched length block',async()=>{
  assert.equal((await auditHead([a],async()=>({ok:false,status:404}))).length,1);
  const e=await auditHead([a],async()=>({ok:true,status:200,headers:{get:()=>String(a.size-1)}}));
  assert.match(e[0],/length differs/);
});
test('noncanonical ISO redirects cannot be checked as legitimate',async()=>{
  const e=await auditHead([{...a,browser_download_url:'https://attacker.invalid/malicious.iso'}],async()=>{
    throw Error('must not fetch');
  });
  assert.match(e[0],/Noncanonical/);
});
test('network failures remain visible, no silent success',async()=>{
  const e=await auditHead([a],async()=>{throw Error('timeout')});
  assert.match(e[0],/timeout/);
});
test('invalid API structures are blocked',async()=>{
  assert.ok((await auditHead({})).length);
});
