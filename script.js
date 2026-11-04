(function(root){'use strict';
const REF={diag:934,dpi:520,gen:185},K=REF.dpi*REF.gen;
  const LV={low:{general:155,redDot:145,x2:135,x4:115,sniper:55,camera:165,fire:65},mid:{general:185,redDot:175,x2:165,x4:145,sniper:85,camera:195,fire:60},high:{general:200,redDot:190,x2:180,x4:160,sniper:105,camera:200,fire:50}};
  const clampI=(v,a,b)=>Math.min(b,Math.max(a,Math.round(v)));
  const snap50=v=>Math.min(3200,Math.max(200,Math.round(v/50)*50));
  const DEV=(()=>{const w=Math.max(screen.width,screen.height),h=Math.min(screen.width,screen.height);
  const dpr=window.devicePixelRatio||1,touch=navigator.maxTouchPoints||0,ua=navigator.userAgent||'';
  const plat=(navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||'';
  const lang=navigator.language||'',cores=navigator.hardwareConcurrency||0,memory=navigator.deviceMemory||0;
  const timezone=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){return'';}})();
  let model='Unknown';
  const m=ua.match(/Android[^;]*;\s*([^;)]+?)\s*(?:Build|\))/i);
  if(m)model=m[1].trim().replace(/\s+Build.*$/,'');else if(/iPad/.test(ua)||(/Macintosh/.test(ua)&&touch>1))model='iPad';else if(/iPhone/.test(ua))model='iPhone';
  if(/^(wv|K|U|Android)$/i.test(model)||/^[a-z]{2}[-_][A-Z]{2}$/.test(model))model='Unknown';
  const screenStr=w+'x'+h;
  return{code:model,model,screen:screenStr,dpr,touch,platform:plat,language:lang,cores,memory,timezone,ua,diag:Math.hypot(w,h)};})();
const SK=['general','redDot','x2','x4','sniper','camera'];
const TC={free:{n:1,jit:.06,fj:.09,dj:.04,snap:100,ms:0,dev:0},trial:{n:8,jit:.04,fj:.06,dj:.025,snap:50,ms:280,dev:1},renew:{n:48,jit:.03,fj:.04,dj:.015,snap:25,ms:750,dev:2},buy:{n:320,jit:.02,fj:.02,dj:.008,snap:10,ms:1500,dev:3}};TC.perm=TC.buy;
const rndR=(a,b)=>a+Math.random()*(b-a);
const snapTo=(v,st)=>Math.min(3200,Math.max(200,Math.round(v/st)*st));
const costOf=(s,base,gT)=>{const g=Math.max(1,s[0]);let c=0;for(let i=1;i<6;i++){const d=s[i]/g-base[SK[i]]/base.general;c+=d*d*1000;}for(let i=0;i<4;i++){if(s[i]<s[i+1])c+=(s[i+1]-s[i])*20;}const dg=(s[0]-gT)/200;c+=dg*dg*400;return c;};
const compute=(level,hasDpi,cfg,hist)=>{
const H=hist||[];
const base=LV[level]||LV.mid;
const sf=cfg.dev>=1?Math.min(1.1,Math.max(.9,REF.diag/DEV.diag)):1;
const gm=(hasDpi?.92:1)*sf,gT=base.general*gm;
const hs=new Set(H.map(h=>h.sig)),lastGens=new Set(H.slice(0,2).map(h=>h.gen));
const one=()=>{
const sv=1+rndR(-cfg.jit,cfg.jit);
const s=SK.map(k=>clampI(base[k]*gm*sv*(1+rndR(-cfg.jit,cfg.jit)*.6),0,200));
let fi=base.fire*(cfg.dev>=1?DEV.diag/REF.diag:1);
if(cfg.dev>=2)fi*=1+(gT-s[0])/400;
if(cfg.dev>=3)fi*=1+(Math.min(3,Math.max(1,DEV.dpr||2.5))-2.5)*.01;
const fire=clampI(fi*(1+rndR(-cfg.fj,cfg.fj)),30,100);
let dp=K/Math.max(1,s[0]);

if(cfg.dev>=3)dp*=Math.pow(DEV.diag/REF.diag,.15);
const dpi=snapTo(dp*(1+rndR(-cfg.dj,cfg.dj)),cfg.snap);
const sig=s.join('.')+'|'+fire+'|'+dpi;
return{s,fire,dpi,sig,gen:s[0],c:cfg.n>1?costOf(s,base,gT):0,dup:hs.has(sig)||(s[0]<200&&lastGens.has(s[0]))};};
let best=null,any=null;
for(let i=0;i<cfg.n;i++){const r=one();if(!any)any=r;if(!r.dup&&(!best||r.c<best.c))best=r;}
for(let k=0;k<80&&!best;k++){const r=one();if(!r.dup)best=r;}
return best||any;};
root.ZnexCalc={REF,K,LV,SK,TC,DEV,clampI,snap50,snapTo,compute};
})(window);
