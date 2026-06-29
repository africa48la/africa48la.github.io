/* telegramencrypted io · client-side text encoder/decoder + simple cipher.
   Base64 uses TextEncoder for correct UTF-8. Nothing is uploaded. Labels from window.T. */
(function(){
  var T = window.T || {};
  var enc = new TextEncoder(), dec = new TextDecoder();
  function bytesToBin(b){ var s=""; for(var i=0;i<b.length;i++) s+=String.fromCharCode(b[i]); return s; }
  function binToBytes(s){ var b=new Uint8Array(s.length); for(var i=0;i<s.length;i++) b[i]=s.charCodeAt(i); return b; }
  function b64encode(t){ return btoa(bytesToBin(enc.encode(t))); }
  function b64decode(t){ return dec.decode(binToBytes(atob(t.trim()))); }
  function hexencode(t){ return Array.from(enc.encode(t)).map(function(x){return ("0"+x.toString(16)).slice(-2);}).join(""); }
  function hexdecode(t){ t=t.replace(/[^0-9a-fA-F]/g,""); var b=new Uint8Array(t.length/2);
    for(var i=0;i<b.length;i++) b[i]=parseInt(t.substr(i*2,2),16); return dec.decode(b); }
  function xorBytes(bytes,key){ var kb=enc.encode(key||""), out=new Uint8Array(bytes.length);
    if(!kb.length) return bytes;
    for(var i=0;i<bytes.length;i++) out[i]=bytes[i]^kb[i%kb.length]; return out; }
  function cipherEnc(t,key){ return btoa(bytesToBin(xorBytes(enc.encode(t),key))); }
  function cipherDec(t,key){ return dec.decode(xorBytes(binToBytes(atob(t.trim())),key)); }
  var OPS={
    b64e:function(t){return b64encode(t);}, b64d:function(t){return b64decode(t);},
    urle:function(t){return encodeURIComponent(t);}, urld:function(t){return decodeURIComponent(t);},
    hexe:function(t){return hexencode(t);}, hexd:function(t){return hexdecode(t);},
    cye:function(t){return cipherEnc(t,(document.getElementById("tpass")||{}).value||"");},
    cyd:function(t){return cipherDec(t,(document.getElementById("tpass")||{}).value||"");}
  };
  function $(id){ return document.getElementById(id); }
  function counts(){
    var t=($("tin")||{}).value||"";
    if($("cbytes")) $("cbytes").textContent=enc.encode(t).length;
    if($("cchars")) $("cchars").textContent=Array.from(t).length;
  }
  function run(mode){
    var t=($("tin")||{}).value||"", out=$("tout");
    if(!out) return;
    try{ out.value=OPS[mode]?OPS[mode](t):t; }
    catch(e){ out.value=T.err_decode||"decode error"; }
  }
  function init(){
    var tin=$("tin");
    if(tin){ tin.addEventListener("input",counts); counts(); }
    document.querySelectorAll(".modes button").forEach(function(b){
      b.addEventListener("click",function(){ run(b.getAttribute("data-m")); });
    });
    var cp=$("tcopy"); if(cp) cp.addEventListener("click",function(){
      var v=($("tout")||{}).value||"";
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(v);
      else { var ta=document.createElement("textarea"); ta.value=v; document.body.appendChild(ta); ta.select();
             try{document.execCommand("copy");}catch(e){} document.body.removeChild(ta); }
    });
    var cl=$("tclear"); if(cl) cl.addEventListener("click",function(){
      if($("tin")) $("tin").value=""; if($("tout")) $("tout").value=""; counts(); });
    var sw=$("tswap"); if(sw) sw.addEventListener("click",function(){
      if($("tin")&&$("tout")){ $("tin").value=$("tout").value; $("tout").value=""; counts(); } });
  }
  if(document.readyState!=="loading") init(); else document.addEventListener("DOMContentLoaded",init);
})();
