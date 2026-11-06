// Serveur statique minimal pour prévisualiser le site en local
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain','.ico':'image/x-icon','.json':'application/json'};
http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);if(!f.startsWith(root))return res.writeHead(403).end();fs.readFile(f,(e,d)=>{if(e){res.writeHead(404,{'Content-Type':'text/html'});return res.end('404');}res.writeHead(200,{'Content-Type':types[path.extname(f).toLowerCase()]||'application/octet-stream'});res.end(d);});}).listen(5173,()=>console.log('http://localhost:5173'));
