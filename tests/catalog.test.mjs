import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';

const data=JSON.parse(readFileSync(new URL('../catalog/product-family.json',import.meta.url),'utf8'));
const expected=['desktop','server','edge','ai-workstation'];

test('family machine-readable catalog is complete and honest',()=>{
  assert.equal(data.brand,'KINGAI OS');
  assert.deepEqual(data.editions.map(x=>x.id),expected);
  assert.equal(new Set(data.editions.map(x=>x.name)).size,4);
  for(const e of data.editions){
    assert.match(e.name,/^KINGAI OS /);
    assert.ok(['developer-preview','planned'].includes(e.releaseStatus));
    if(e.releaseStatus==='planned'){
      assert.equal(e.image,null);
      assert.equal(e.download,null);
      assert.equal(e.version,null);
    }else{
      assert.equal(e.version,'0.1.0-dev');
      assert.deepEqual(e.architecture,['amd64']);
      assert.match(e.image,/^KINGAI-OS-(Desktop|Server)-0\.1\.0-dev-amd64\.iso$/);
      assert.match(e.sha256,/^[a-f0-9]{64}$/);
      assert.equal(e.download, 'https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/'+e.image);
    }
  }
});

test('current official ISO checksums match published release digests',()=>{
  const digests={
    desktop:'3a53c03566a1d72595a5340bdeb3eeec815342ee032fac8e2d4a4a1f9cf1643d',
    server:'433bb0dd2b07f8c7579296626d706c662d42938b7b8366983799d50670abb85d'
  };
  for(const [id,digest] of Object.entries(digests))assert.equal(data.editions.find(e=>e.id===id).sha256,digest);
});

test('README documents current preview and explicitly excludes planned downloads',()=>{
  const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');
  for(const edition of data.editions)assert.ok(readme.includes(edition.name),'missing '+edition.name);
  assert.ok(readme.includes('Developer Preview'));
  assert.ok(readme.includes('no published ISO'));
});
