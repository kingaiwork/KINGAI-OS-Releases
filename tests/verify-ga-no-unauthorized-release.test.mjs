import test from 'node:test';
import assert from 'node:assert/strict';
import {auditPublishedReleases} from '../scripts/verify-ga-no-unauthorized-release.mjs';

test('developer preview release is allowed',()=>{
  assert.deepEqual(auditPublishedReleases([{tag_name:'v0.1.0-dev',prerelease:true,draft:false}]).errors,[]);
});
test('draft unreleased candidate is ignored',()=>{
  assert.equal(auditPublishedReleases([{tag_name:'v1.0.0',prerelease:false,draft:true}]).ok,true);
});
test('publicly published GA triggers alert',()=>{
  const out=auditPublishedReleases([{tag_name:'v1.0.0',prerelease:false,draft:false}]);
  assert.equal(out.ok,false);
  assert.match(out.errors[0],/UNAUTHORIZED GA/);
});
test('non-draft release with missing prerelease flag blocks',()=>{
  assert.equal(auditPublishedReleases([{tag_name:'unknown',draft:false}]).ok,false);
});
test('empty released list is not false GA alert',()=>{
  assert.equal(auditPublishedReleases([]).ok,true);
});
test('malformed API response blocks',()=>{
  assert.equal(auditPublishedReleases({releases:[]}).ok,false);
});
test('multiple releases scanned rather than first only',()=>{
  const out=auditPublishedReleases([
    {tag_name:'v0.1.0-dev',prerelease:true,draft:false},
    {tag_name:'v1.0.0',prerelease:false,draft:false}
  ]);
  assert.equal(out.ok,false);
  assert.equal(out.checkedReleases,2);
});
