(function(){
  try{
    var t = localStorage.getItem("ads:theme") || "light";
    document.documentElement.setAttribute("data-theme", t);
  }catch(e){}

  try{
    var saved = JSON.parse(localStorage.getItem("ads:colors") || "null");
    var themeColors = (saved && saved[t]) || (t === "dark" && saved && saved.light);
    var hex = themeColors && themeColors.primary && themeColors.primary.hex;
    if (hex && /^#[0-9a-f]{6}$/i.test(hex)){
      var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
      var mix = function(c, target, amt){ return Math.round(c + (target - c) * amt); };
      var toHex = function(rr, gg, bb){
        return "#" + [rr, gg, bb].map(function(v){ var h = v.toString(16); return h.length === 1 ? "0" + h : h; }).join("");
      };
      var dark600 = toHex(mix(r, 0, 0.18), mix(g, 0, 0.18), mix(b, 0, 0.18));
      var light400 = toHex(mix(r, 255, 0.25), mix(g, 255, 0.25), mix(b, 255, 0.25));
      var rootStyle = document.documentElement.style;
      rootStyle.setProperty("--red-500", hex);
      rootStyle.setProperty("--red-600", dark600);
      rootStyle.setProperty("--red-400", light400);
      rootStyle.setProperty("--red-tint", "rgba(" + r + "," + g + "," + b + ",0.08)");
      rootStyle.setProperty("--red-glow", "rgba(" + r + "," + g + "," + b + ",0.35)");
    }
  }catch(e){}

  try{
    var savedBg = JSON.parse(localStorage.getItem("ads:bg-colors") || "null");
    var bgSet = savedBg && savedBg[t];
    if (bgSet){
      var bgRoot = document.documentElement.style;
      if (bgSet.primary && /^#[0-9a-f]{6}$/i.test(bgSet.primary)) bgRoot.setProperty("--graphite-950", bgSet.primary);
      if (bgSet.secondary && /^#[0-9a-f]{6}$/i.test(bgSet.secondary)) bgRoot.setProperty("--graphite-900", bgSet.secondary);
      if (bgSet.tertiary && /^#[0-9a-f]{6}$/i.test(bgSet.tertiary)) bgRoot.setProperty("--graphite-850", bgSet.tertiary);
    }
  }catch(e){}

  try{
    var savedStatus = JSON.parse(localStorage.getItem("ads:status-colors") || "null");
    var statusSet = savedStatus && savedStatus[t];
    if (statusSet){
      var stRoot = document.documentElement.style;
      if (statusSet.success && /^#[0-9a-f]{6}$/i.test(statusSet.success)) stRoot.setProperty("--green-500", statusSet.success);
      if (statusSet.warning && /^#[0-9a-f]{6}$/i.test(statusSet.warning)) stRoot.setProperty("--amber-500", statusSet.warning);
      if (statusSet.info && /^#[0-9a-f]{6}$/i.test(statusSet.info)) stRoot.setProperty("--blue-500", statusSet.info);
      if (statusSet.danger && /^#[0-9a-f]{6}$/i.test(statusSet.danger)){
        var dgr = parseInt(statusSet.danger.slice(1, 3), 16), dgg = parseInt(statusSet.danger.slice(3, 5), 16), dgb = parseInt(statusSet.danger.slice(5, 7), 16);
        var dgmix = function(c, target, amt){ return Math.round(c + (target - c) * amt); };
        var dgtoHex = function(rr, gg, bb){
          return "#" + [rr, gg, bb].map(function(v){ var h = v.toString(16); return h.length === 1 ? "0" + h : h; }).join("");
        };
        stRoot.setProperty("--danger-500", statusSet.danger);
        stRoot.setProperty("--danger-600", dgtoHex(dgmix(dgr, 0, 0.18), dgmix(dgg, 0, 0.18), dgmix(dgb, 0, 0.18)));
        stRoot.setProperty("--danger-400", dgtoHex(dgmix(dgr, 255, 0.25), dgmix(dgg, 255, 0.25), dgmix(dgb, 255, 0.25)));
      }
    }
  }catch(e){}

  try{
    var savedNeutral = JSON.parse(localStorage.getItem("ads:neutral-colors") || "null");
    var neutralSet = savedNeutral && savedNeutral[t];
    if (neutralSet){
      var nRoot = document.documentElement.style;
      if (neutralSet.c800 && /^#[0-9a-f]{6}$/i.test(neutralSet.c800)) nRoot.setProperty("--graphite-800", neutralSet.c800);
      if (neutralSet.c700 && /^#[0-9a-f]{6}$/i.test(neutralSet.c700)) nRoot.setProperty("--graphite-700", neutralSet.c700);
      if (neutralSet.c600 && /^#[0-9a-f]{6}$/i.test(neutralSet.c600)) nRoot.setProperty("--graphite-600", neutralSet.c600);
      if (neutralSet.c500 && /^#[0-9a-f]{6}$/i.test(neutralSet.c500)) nRoot.setProperty("--graphite-500", neutralSet.c500);
      if (neutralSet.border && /^#[0-9a-f]{6}$/i.test(neutralSet.border)) nRoot.setProperty("--control-border", neutralSet.border);
    }
  }catch(e){}

  try{
    var savedText = JSON.parse(localStorage.getItem("ads:text-colors") || "null");
    var textSet = savedText && savedText[t];
    if (textSet){
      var txRoot = document.documentElement.style;
      if (textSet.hi && /^#[0-9a-f]{6}$/i.test(textSet.hi)) txRoot.setProperty("--text-hi", textSet.hi);
      if (textSet.mid && /^#[0-9a-f]{6}$/i.test(textSet.mid)) txRoot.setProperty("--text-mid", textSet.mid);
      if (textSet.dim && /^#[0-9a-f]{6}$/i.test(textSet.dim)) txRoot.setProperty("--text-dim", textSet.dim);
    }
  }catch(e){}
})();
