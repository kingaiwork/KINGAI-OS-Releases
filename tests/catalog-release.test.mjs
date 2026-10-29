import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditCatalogAgainstRelease} from '../scripts/verify-catalog-release.mjs';

const catalog=JSON.parse(readFileSync(new URL('../catalog/product-family.json',import.meta.url),'utf8'));
function fixture(){
  const tag='v0.1.0-dev';
  const assets=[];
  for(const edition of catalog.editions.filter(x=>x.releaseStatus==='developer-preview')){
    assets.push({name:edition.image,digest:'sha256:'+edition.sha256,browser_download_url:edition.download});
    assets.push({name:edition.image+'.sha256',digest:'sha256:'+'a'.repeat(64)});
  }
  return {catalog:structuredClone(catalog),release:{tag_name:tag,draft:false,prerelease:true,assets}};
}
test('real preview metadata shape and catalog agree',()=>{
  const {catalog,release}=fixture();
  assert.deepEqual(auditCatalogAgainstRelease(catalog,release).errors,[]);
});
test('planned editions cannot advertise nonexistent installer',()=>{
  const {catalog,release}=fixture();
  catalog.editions[2].download='https://example.com/fake.iso';
  assert.equal(auditCatalogAgainstRelease(catalog,release).ok,false);
});
test('mismatched ISO content digest blocks catalog publication',()=>{
  const {catalog,release}=fixture();
  release.assets[0].digest='sha256:'+'b'.repeat(64);
  assert.ok(auditCatalogAgainstRelease(catalog,release).errors.some(x=>x.includes('hash conflict')));
});
test('a new real prerelease requires a fresh catalog',()=>{
  const {catalog,release}=fixture();
  release.tag_name='v0.2.0-dev';
  assert.equal(auditCatalogAgainstRelease(catalog,release).ok,false);
});
test('missing checksum sidecar cannot pass',()=>{
  const {catalog,release}=fixture();
  release.assets=release.assets.filter(x=>!x.name.endsWith('.sha256'));
  assert.ok(auditCatalogAgainstRelease(catalog,release).errors.some(x=>x.includes('companion')));
});
test('wrong-origin release URL cannot pass',()=>{
  const {catalog,release}=fixture();
  release.assets[0].browser_download_url='https://example.net/other.iso';
  assert.equal(auditCatalogAgainstRelease(catalog,release).ok,false);
});
