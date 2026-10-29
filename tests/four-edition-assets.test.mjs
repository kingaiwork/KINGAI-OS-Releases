import assert from 'node:assert/strict';
import {test} from 'node:test';
import {auditFourEditionAssets} from '../scripts/audit-four-edition-assets.mjs';

const tag='v1.0.0-rc1';
const link=(name)=>'https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/'+tag+'/'+name;
function asset(name,size){return {name,size,state:'uploaded',digest:'sha256:'+'a'.repeat(64),browser_download_url:link(name)};}
function fixture() {
 const assets=[];
 for(const edition of ['Desktop','Server','Edge','AI-Workstation']) {
   const iso='KINGAI-OS-'+edition+'-1.0.0-rc1-amd64.iso';
   assets.push(asset(iso,2139549696),asset(iso+'.sha256',104));
 }
 return {tag_name:tag,prerelease:true,draft:false,assets};
}
test('four distinct ISO asset inventory is necessary but never sufficient for GA',()=>{
 const r=auditFourEditionAssets(fixture());
 assert.equal(r.ok,true,r.errors.join('; '));
 assert.equal(r.certified,false);
 assert.equal(r.gaAuthorized,false);
 assert.equal(r.editions.length,4);
});
test('missing Edge and AI Workstation ISOs fail individually',()=>{
 const r=fixture();
 r.assets=r.assets.filter(x=>!x.name.includes('-Edge-')&&!x.name.includes('-AI-Workstation-'));
 const a=auditFourEditionAssets(r);
 assert.equal(a.ok,false);
 assert.ok(a.errors.some(x=>x.includes('edge')));
 assert.ok(a.errors.some(x=>x.includes('ai-workstation')));
});
test('missing checksum sidecar fails',()=>{
 const r=fixture();r.assets=r.assets.filter(x=>!x.name.includes('Server-')||!x.name.endsWith('.sha256'));
 assert.ok(auditFourEditionAssets(r).errors.some(x=>x.includes('server')));
});
test('mismatched download origin fails even with a SHA value',()=>{
 const r=fixture();r.assets[0].browser_download_url='https://example.com/iso';
 assert.ok(auditFourEditionAssets(r).errors.some(x=>x.includes('Noncanonical')));
});
test('duplicate ISO, unuploaded asset, or very small fake image fails',()=>{
 const r=fixture();r.assets.push({...r.assets[0]});
 assert.ok(auditFourEditionAssets(r).errors.some(x=>x.includes('duplicate')));
 const q=fixture();q.assets[0].state='starter';q.assets[0].size=512;
 assert.ok(auditFourEditionAssets(q).errors.some(x=>x.includes('fully uploaded')));
 assert.ok(auditFourEditionAssets(q).errors.some(x=>x.includes('size')));
});
test('unreviewed and invalid release tags never pass',()=>{
 const r=fixture();r.assets.push(asset('KINGAI-OS-Other-1.0.0-rc1-amd64.iso',220000000));
 assert.ok(auditFourEditionAssets(r).errors.some(x=>x.includes('Unexpected')));
 const q=fixture();q.tag_name='../latest';
 assert.equal(auditFourEditionAssets(q).ok,false);
});
test('an entirely absent release is blocked',()=>assert.equal(auditFourEditionAssets(null).ok,false));
