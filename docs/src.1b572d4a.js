parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"PXcJ":[function(require,module,exports) {
"use strict";exports.__esModule=!0,exports.convertBtn=document.getElementById("convert-btn"),exports.inputTextarea=document.getElementById("input-textarea"),exports.outputTextarea=document.getElementById("output-textarea"),exports.bpmInput=document.getElementById("bpm-input"),exports.fpsInput=document.getElementById("fps-input"),exports.getNoteBtn=document.getElementById("get-note-btn"),exports.exoResetBtn=document.getElementById("exo-reset-btn"),exports.trackCntInput=document.getElementById("track-cnt-input");
},{}],"90oN":[function(require,module,exports) {
"use strict";exports.__esModule=!0;var t=function(){function t(){this.bpm=60,this.fps=60,this.tick=1}return t.prototype.setBpm=function(t){this.bpm=parseInt(t,10)},t.prototype.setFps=function(t){this.fps=parseInt(t,10)},t.prototype.setTick=function(t){this.tick=parseInt(t,10)},t.prototype.beatToExo=function(t,o){var e=0,s=1;console.log(t);for(var n=0;n<t.length;n++){var p=t[n];"-"!==p&&("o"===p&&(s=this.bpm*n/this.tick,e>0&&o.addScene(e,s,1),e=s+1))}return o.export()},t}();exports.ngConvert=t;
},{}],"eF3L":[function(require,module,exports) {
"use strict";exports.__esModule=!0;var t=function(){function t(t){t&&this.setInputText(t)}return t.prototype.parse=function(t){var r={},e=t.split("\n");if("ModPlug Tracker  IT"!==e[0])throw new Error("入力されたデータはModPlug Tracker  ITじゃない");var s=this.parseOrders(e[1]);r.orders=s||[0];var n=this.parsePatterns(e);return r.patterns=n,console.log(r),r},t.prototype.parsePatterns=function(t){for(var r=[],e=2;e<t.length;){var s=this.parseRows(t[e]);if(console.log(s),e+=1,!1!==s){var n={};n.rows=s,n.tracks=this.parseTracks(t.slice(e,e+s)),r.push(n),e+=s}}return r},t.prototype.parseTracks=function(t){for(var r=this,e=t[0].split("|").length-1,s=new Array(e),n=0;n<s.length;n++)s[n]=new Array;for(var o=0;o<t.length;o++){var a=t[o].split("|").map(function(t){return r.parseRow(t)});for(n=0;n<a.length-1;n++)s[n][o]=a[n+1]}return console.log(s),s},t.prototype.parseRow=function(t){var r={};return r.note=t.slice(0,3),r.instrument=parseInt(t.slice(3,5),16),r.volume=t.slice(5,8),r.effect=t.slice(8,10),r},t.prototype.parseRows=function(t){if(t.startsWith("Rows:")){var r=t.substring("Rows:".length);return parseInt(r,10)}return!1},t.prototype.parseOrders=function(t){return!!t.startsWith("Orders:")&&t.substring("Orders:".length).split(",").map(function(t){return parseInt(t,10)})},t.prototype.setInputText=function(t){t!==this.inputText&&(this.inputText=t,this.data=this.parse(this.inputText))},t.prototype.getTrack=function(t){for(var r=[],e=this.data.orders,s=0;s<e.length;s++)r.push.apply(r,this.data.patterns[e[s]].tracks[t]);return r},t.prototype.getNoteRhythm=function(t){for(var r="",e=this.getTrack(t),s=0;s<e.length;s++){"..."!==e[s].note?r+="o":r+="-"}return r},t.prototype.toAviutl=function(){return this.data.patterns[0].tracks[0][0].note},t}();exports.ngTracker=t;
},{}],"2GNO":[function(require,module,exports) {
"use strict";var t=this&&this.__assign||function(){return(t=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t}).apply(this,arguments)};exports.__esModule=!0;var n=function(){function n(t,n){this.defInfo=t||this._defInfo(),this.defDraw=n||this._defDraw(),this.defScene=this._defScene(),this.objs=[]}return n.prototype.reset=function(){this.objs=[]},n.prototype.assignObjDef=function(n,e,r){return{info:t({},this.defInfo,n),obj:t({},e),draw:t({},this.defDraw,r)}},n.prototype.addScene=function(t,n,e){return this._addScene({start:t,end:n},{_:e})},n.prototype._addScene=function(n,e,r){var o=this.assignObjDef(n,t({},this.defScene,e),r);console.log(o),this.objs.push(o)},n.prototype.paramStringify=function(t){for(var n="",e=0,r=Object.keys(t);e<r.length;e++){var o=r[e];n+="_"===o?"="+t[o]+"\n":o+"="+t[o]+"\n"}return n},n.prototype.objStringify=function(t,n){var e="";return e+="["+t+"]\n",e+=this.paramStringify(n.info),e+="["+t+".0]\n",e+=this.paramStringify(n.obj),n.draw&&(e+="["+t+".1]\n",e+=this.paramStringify(n.draw)),e},n.prototype.export=function(){for(var t=this._header()+"\n",n=this.objs,e=0;e<n.length;e++)t+=this.objStringify(e,n[e]);return t},n.prototype._header=function(){return"[exedit]\nwidth=1280\nheight=720\nrate=60\nscale=1\nlength=6000\naudio_rate=44100\naudio_ch=2"},n.prototype._defInfo=function(){return{start:0,end:1,layer:1,overlay:1,camera:0}},n.prototype._defDraw=function(){return{_name:"標準描画",X:0,Y:0,Z:0,"拡大率":100,"透明度":0,"回転":0,blend:0}},n.prototype._defScene=function(){return{_name:"シーン","再生位置":1,"再生速度":100,"ループ再生":0,_:1}},n}();exports.ngExo=n;
},{}],"7QCb":[function(require,module,exports) {
"use strict";var t=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e};exports.__esModule=!0;var e=t(require("./constant")),n=require("./convert/convert"),r=require("./tracker/tracker"),u=require("./exo/exo"),a=new n.ngConvert,o=new r.ngTracker,c=new u.ngExo;function l(t){try{t.setInputText(e.inputTextarea.value)}catch(n){e.outputTextarea.value=n}}function i(t){t.setBpm(e.bpmInput.value),t.setFps(e.fpsInput.value)}e.getNoteBtn.onclick=function(){l(o),i(a);var t,n=parseInt(e.trackCntInput.value,10);t=a.beatToExo(o.getNoteRhythm(n),c),e.outputTextarea.value=t},e.exoResetBtn.onclick=function(){c.reset()},e.convertBtn.onclick=function(t){l(o),i(a);var n,r=parseInt(e.trackCntInput.value,10);n=o.getNoteRhythm(r),e.outputTextarea.value=n},console.log("hello");
},{"./constant":"PXcJ","./convert/convert":"90oN","./tracker/tracker":"eF3L","./exo/exo":"2GNO"}]},{},["7QCb"], null)
//# sourceMappingURL=/src.1b572d4a.map