const zlib=require('zlib');
const bundle=require('./_demo-bundle');

let CACHE=null;

function parseTar(buf){
  const files=new Map();
  for(let off=0;off+512<=buf.length;off+=512){
    const header=buf.subarray(off,off+512);
    if(header.every(b=>b===0)) break;
    const rawName=header.subarray(0,100).toString('utf8').replace(/\0.*$/,'');
    const prefix=header.subarray(345,500).toString('utf8').replace(/\0.*$/,'');
    const name=(prefix?prefix+'/'+rawName:rawName).replace(/^\.\//,'').replace(/^\/+/, '');
    const sizeRaw=header.subarray(124,136).toString('utf8').replace(/\0.*$/,'').trim();
    const size=parseInt(sizeRaw||'0',8)||0;
    const start=off+512,end=start+size;
    if(name && !name.endsWith('/')) files.set(name,buf.subarray(start,end));
    off=start+Math.ceil(size/512)*512-512;
  }
  return files;
}
function files(){
  if(CACHE) return CACHE;
  const gz=Buffer.from(bundle,'base64');
  CACHE=parseTar(zlib.gunzipSync(gz));
  return CACHE;
}
function safePath(v=''){
  let p=String(v||'').split('?')[0].replace(/^\/+|\/+$/g,'');
  try{p=decodeURIComponent(p)}catch{}
  if(!p || p==='demos') return 'index.html';
  p=p.replace(/^demos\/?/,'');
  if(!p) return 'index.html';
  if(p.includes('..')||p.includes('\\')) return null;
  if(p.endsWith('/')) p+='index.html';
  if(!/\.[a-z0-9]+$/i.test(p)) p+='/index.html';
  return p;
}
module.exports=async function handler(req,res){
  if(req.method!=='GET'&&req.method!=='HEAD'){
    res.setHeader('Allow','GET, HEAD');
    return res.status(405).end();
  }
  const p=safePath(req.query.path||'');
  if(!p) return res.status(400).send('Invalid path');
  const data=files().get(p);
  if(!data) return res.status(404).send('Demo não encontrada');
  const ext=p.split('.').pop().toLowerCase();
  const ct={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'application/javascript; charset=utf-8',svg:'image/svg+xml',json:'application/json; charset=utf-8'}[ext]||'application/octet-stream';
  res.setHeader('Content-Type',ct);
  res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');
  if(req.method==='HEAD') return res.status(200).end();
  return res.status(200).send(data);
};
