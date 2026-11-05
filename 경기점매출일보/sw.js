// 경기점 매출일보 서비스워커 — 항상 최신 화면을 먼저 받아오고, 오프라인일 때만 저장본 사용
var CACHE='gyeonggi-ilbo-v1';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET'||req.url.indexOf(self.location.origin)!==0)return;
  e.respondWith(fetch(req).then(function(res){
    var copy=res.clone();caches.open(CACHE).then(function(c){c.put(req,copy);});
    return res;
  }).catch(function(){return caches.match(req);}));
});
