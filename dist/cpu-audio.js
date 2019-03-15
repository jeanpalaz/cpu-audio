(function(){/*

Cpu-Audio: an extension to the hash system to address timecode into audio/video elements.
Version 5.3
Copyright (C) 2014-2019 Xavier "dascritch" Mouton-Dubosc & contributors.
License GNU GPL 3

- project mini-site https://dascritch.github.io/cpu-audio/
- project repository : https://github.com/dascritch/cpu-audio
- use case : http://cpu.pm
- blog post : https://dascritch.net/post/2018/11/06/Reconstruire-son-lecteur-audio-pour-le-web
*/
'use strict';let d,g;const h=(document._currentScript||document.currentScript).ownerDocument,p=["actions","chapters"];let q="fr",r=window.navigator.languages;r=void 0!==r?r:[navigator.language||navigator.browserLanguage];for(let a in r){let b=r[a];if(b.split){let a=b.split("-")[0];"object"===typeof i18n_source&&null!==i18n_source&&void 0!==i18n_source[a]&&(q=a)}}
const t={fr:{loading:"Chargement en cours\u2026",pause:"Pause",play:"Lecture",canonical:"Lien vers la fiche du sonore",moment:"Lien vers ce moment",untitled:"(sans titre)",cover:"pochette",more:"Actions",share:"Partager",twitter:"Partager sur Twitter",facebook:"Partager sur Facebook",e_mail:"Partager par e-mail",download:"T\u00e9l\u00e9charger",back:"Annuler",media_err_aborted:"Vous avez annul\u00e9 la lecture.",media_err_network:"Une erreur r\u00e9seau a caus\u00e9 l'interruption du t\u00e9l\u00e9chargement.",
media_err_decode:"La lecture du sonore a \u00e9t\u00e9 annul\u00e9e suite \u00e0 des probl\u00e8mes de corruption ou de fonctionnalit\u00e9s non support\u00e9s par votre navigateur.",media_err_src_not_supported:"Le sonore n'a pu \u00eatre charg\u00e9, soit \u00e0 cause de sourcis sur le serveur, le r\u00e9seau ou parce que le format n'est pas support\u00e9.",media_err_unknow:"Erreur due \u00e0 une raison inconnue."},en:{loading:"Loading\u2026",pause:"Pause",play:"Play",canonical:"Link to the sound's page",
moment:"Link to this time",untitled:"(untitled)",cover:"cover",more:"Actions",share:"Share",twitter:"Share on Twitter",facebook:"Share on Facebook","e-mail":"Share via e-mail",download:"Download",back:"Back",media_err_aborted:"You have aborted the play.",media_err_network:"A network error broke the download.",media_err_decode:"Play was canceled due to file corruption or a not supported function in your browser.",media_err_src_not_supported:"The media cannot be downloaded due to server problems, network problems or unsupported by your browser.",
media_err_unknow:"Error of unknown cause."}}[q];function u(){var a=document.createElement("style");a.innerHTML=' audio[controls] { display : block; width : 100%; } :root { --cpu-height : 64px; --cpu-font-family : Lato, "Open Sans", "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif; --cpu-font-size : 15px; --cpu-background : #555; --cpu-color : #ddd; --cpu-playing-background : #444; --cpu-playing-color : #fff; --cpu-error-background : #a00 ; --cpu-error-color : #ff7 ; --cpu-popup-background : #aaa; --cpu-popup-color : #333; --cpu-elapse-width : 185px; --cpu-min-padding : 16px; --cpu-inner-shadow : inset 0px 5px 10px -5px black; } @media (max-width: 640px) , @element .interface and (max-width: 640px) { :root , .interface { --cpu-font-size : 13px; --cpu-height : 32px; --cpu-elapse-width : 160px; --cpu-min-padding : 4px; } @media (max-width: 480px) , @element .interface and (max-width: 480px) { :root , .interface { --cpu-elapse-width : 80px; } }';
document.head.appendChild(a);a=document.createElement("template");a.id="template_cpu";a.innerHTML=`<style>#interface { font-family : var(--cpu-font-family); font-size : var(--cpu-font-size); --cpu-timeline-height : 10px; } #interface, * { line-height : 1.2; border : none; padding : 0; margin : 0; transition : none; moz-user-select: none; ms-user-select: none; webkit-user-select: none; user-select: none; } #principal { display : flex; overflow : hidden; background : var(--cpu-background); color : var(--cpu-color); height : var(--cpu-height); } .act-error { background : var(--cpu-error-background); color : var(--cpu-error-color); } a, button { background : var(--cpu-background); color : var(--cpu-color); border : none; text-decoration : none; } svg { fill : currentColor; width : var(--cpu-height); height : var(--cpu-height); } a:hover, a:focus, button:hover, button:focus { color : var(--cpu-background); background : var(--cpu-color); } a:hover svg , a:focus svg { fill : currentColor; } #loading circle { fill : #777; } .act-play { background : var(--cpu-playing-background); color : var(--cpu-playing-color); } .act-play a { color : var(--cpu-playing-color); } .act-play a:hover, .act-play a:focus { color : var(--cpu-playing-background); background : var(--cpu-playing-color); } .show-error { background : var(--cpu-error-background); color : var(--cpu-error-color); } #pageerror { padding: 0px 4px; align-self: center; } #control, #actions, #back { flex : 0 0 var(--cpu-height); width : var(--cpu-height); max-height : var(--cpu-height); height : 100%; text-align : center; vertical-align : middle; } a { cursor : pointer; } #loading, #play, #pause, .show-main #pageshare, .show-main #pageerror, .show-share #pagemain, .show-share #pageerror, .show-error #pagemain, .show-error #pageshare , .show-error #poster, #handheld-nav , .show-handheld-nav #titleline { display : none; } .act-loading #loading, .act-play #play, .act-pause #pause { display : block; } .show-share #pageshare, .show-main #pagemain, .share { flex : 1 1 100%; display : flex; align-items: center; } .act-loading #loading circle:nth-child(1) { animation: pulse0 2s infinite; } .act-loading #loading circle:nth-child(2) { animation: pulse1 2s infinite; } .act-loading #loading circle:nth-child(3) { animation: pulse2 2s infinite; } @keyframes pulse0 { 0% {opacity : 1;} 50% {opacity : 0;} 100% {opacity : 1;} } @keyframes pulse1 { 0% {opacity : 0.75;} 12% {opacity : 1;} 62% {opacity : 0;} 100% {opacity : 0.75;} } @keyframes pulse2 { 0% {opacity : 0.5;} 25% {opacity : 1;} 75% {opacity : 0;} 100% {opacity : 0.5;} } @keyframes pulse3 { 0% {opacity : 0.25;} 37% {opacity : 1;} 87% {opacity : 0;} 100% {opacity : 0.25;} } #poster { max-width : var(--cpu-height); min-width : var(--cpu-height); max-height : var(--cpu-height); min-height : var(--cpu-height); object-fit: contain; opacity : 0; } .poster-loaded #poster { opacity: 1; } #loading svg, #play svg, #pause svg, #actions svg { vertical-align : middle; max-width : 100%; max-height : 100%; } #loading { background : var(--cpu-background) !important; } #titleline { display : flex; } #about, #title { flex : 1 1 100%; position : relative; } #title a { display : block; text-overflow : ellipsis; max-height: 48px; overflow: hidden; } #canonical.untitled { font-style : italic; } #elapse { flex : 1 0 var(--cpu-elapse-width); text-align : right; } #time { background : black; width : 100%; height : var(--cpu-timeline-height); display : block; border-radius : 4px; position : relative; cursor:none; } #loadingline, #elapsedline { background : white; height : var(--cpu-timeline-height) ; display : block ; position : absolute; left : 0; border-radius : 4px; pointer-events : none; } #elapsedline { z-index : 2; } #chaptersline { position : absolute; width : 100%; height : 2px; bottom : -4px; } #chaptersline a { position : absolute; background : black; display : block; height : 2px; outline : 2px solid var(--cpu-background); } #chaptersline a:hover, #chaptersline a.with-preview { background : white; } #chaptersline a.active-cue { background : var(--cpu-color); } #points { display : block ; position : absolute; left : 0; width: 100%; opacity : 0; } #points svg { fill : red; pointer-events : none; position: absolute; z-index : 126; width : 10px; height : 10px; } #preview { display : none; } .act-loading #loadingline { background : repeating-linear-gradient(135deg, #bbb 0, #999 5px, #999 10px, #ddd 15px, #ddd 20px, #bbb 25px); animation: loadingline 500ms linear infinite; } @keyframes loadingline { 0% { background-position-x : -30px; } 100% { background-position-x : 0px;} } .show-handheld-nav #handheld-nav { display : flex; } #handheld-nav * { flex : 1 0 auto; height : calc( var(--cpu-height) / 2 ); } [type="time"] { text-align : center; } .hide-actions #actions { visibility : hidden; pointer-events: none; min-width : var(--cpu-min-padding); max-width : var(--cpu-min-padding); } .share { text-align : center; } .share a { display: flex; align-items: center; justify-content: center; height : var(--cpu-height); } .share a, .share div { flex : 1 0; color : white; text-decoration : none; overflow : hidden; text-overflow : clip; } .share a:hover, .share a:focus, .share div:hover { color : var(--cpu-background); background : var(--cpu-color); } .share svg { vertical-align : middle; width : 32px; height : 32px; } .share #nativeshare { display : none; } .hasnativeshare .share #nativeshare { display : flex; } .hasnativeshare .share .nonativeshare { display : none; } #twitter { background : #4DB5F4 } #facebook, #nativeshare { background : #5974CC } #email { background : #CC0000 } #link { background : #77F } #popup { pointer-events : none; position: absolute; transform: translate(-25px, -19px); z-index : 127; min-width : 50px; font-size : 11px; text-align : center; padding : 2px; border-radius: 4px; box-shadow: black 2px 2px; background : var(--cpu-popup-background); color : var(--cpu-popup-color); opacity : 0; moz-user-select: none; ms-user-select: none; webkit-user-select: none; user-select: none; } #popup:before { pointer-events : none; content:""; position: absolute; z-index : 127; left: 20px; bottom: -8px; width: 0; height : 0; border-top: 8px solid var(--cpu-popup-background); border-left: 4px solid transparent; border-right: 4px solid transparent; } #chapters, #playlist { display : flex; overflow : scoll; background : var(--cpu-background); color : var(--cpu-color); list-style: none; flex-direction: column; padding : 0 var(--cpu-min-padding); box-shadow: var(--cpu-inner-shadow); } .cue { border-top : 1px solid black; } .cue a { display : flex; margin : 0px; padding : 2px } .active-cue a { background : var(--cpu-color); color : var(--cpu-background); } .cue strong { flex : 1 1; font-weight : normal; } .cue span { flex : 0 0 var(--cpu-elapse-width); text-align : right; } .mode-compact { width : calc(var(--cpu-elapse-width) + var(--cpu-height) + 32px); } .mode-button { width : var(--cpu-height); } .mode-compact #poster, .mode-compact #title, .mode-compact #line, .mode-compact #actions, .mode-compact #chapters, .mode-button #poster, .mode-button #about, .mode-button #actions, .mode-button #chapters, .mode-hidden, .hide-chapters #chapters { display : none; } .mode-compact.show-main #pagemain { flex : 0 0 auto; } @media (max-width: 640px) , @element #interface and (max-width: 640px) { .nosmall { display : none; } #title a { max-height : 16px; } #elapse { max-height : 16px; } #interface { --cpu-timeline-height : 8px ; } .with-preview #preview { display : block; position : absolute; height : var(--cpu-timeline-height) ; left : 0; right: 0; outline : 2px solid cyan; border-radius : 4px; z-index : 127; pointer-events : none; } } @media (max-width: 480px) , @element #interface and (max-width: 480px) { .mode-default .notiny { display : none; } .mode-default #elapse { flex : 1 0 var(--cpu-elapse-width); } } @media (max-width: 320px) , @element #interface and (max-width: 320px) { .mode-default #elapse { display : none; } .nosmallest { display : none; } } @media print { #interface { display : none; } }</style><div id="interface" tabindex="0"> <div id="principal"> <img id="poster" class="nosmall" src="" alt="" /> <div id="pageerror" role="alert"> </div> <div id="pagemain"> <a id="control" tabindex="0"> <div id="loading" aria-label="${t.loading}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <circle cx="6" cy="22" r="4" /> <circle cx="16" cy="22" r="4" /> <circle cx="26" cy="22" r="4" /> </svg> </div> <div id="play" aria-label="${t.pause}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 6,6 12.667,6 12.667,26 6,26 z" /> <path d="M 19.333,6 26,6 26,26 19.333,26 z" /> </svg> </div> <div id="pause" aria-label="${t.play}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 6,6 6,26 26,16 z" /> </svg> </div> </a> <div id="about"> <div id="titleline"> <div id="title"><a href="#" id="canonical" aria-label="${t.canonical}"></a></div> <a id="elapse" aria-label="${t.moment}" tabindex="-1">\u2026</a> </div> <div id="handheld-nav"> <button type="button" id="restart"> <svg viewBox="0 0 24 16" aria-hidden="true"> <polygon points="4,0 8,0 8,16 4,16"/> <path d="M 16,0 8,8 16,16 z" /> <path d="M 24,0 16,8 24,16 z" /> </svg> </button> <button type="button" id="fastreward"> <svg viewBox="0 0 24 16" aria-hidden="true"> <path d="M 8,0 0,8 8,16 z" /> <path d="M 16,0 8,8 16,16 z" /> <path d="M 24,0 16,8 24,16 z" /> </svg> </button> <button type="button" id="reward"> <svg viewBox="0 0 24 16" aria-hidden="true"> <path d="M 8,0 0,8 8,16 z" /> <path d="M 16,0 8,8 16,16 z" /> </svg> </button> <input type="time" step="1" min="0:00" id="inputtime" class="nosmallest" /> <button type="button" id="foward"> <svg viewBox="0 0 24 16" aria-hidden="true"> <path d="M 0,0 8,8 0,16 z" /> <path d="M 8,0 16,8 8,16 z" /> </svg> </button> <button type="button" id="fastfoward"> <svg viewBox="0 0 24 16" aria-hidden="true"> <path d="M 0,0 8,8 0,16 z" /> <path d="M 8,0 16,8 8,16 z" /> <path d="M 16,0 24,8 16,16 z" /> </svg> </button> </div> <div id="line"> <div id="time"> <div id="loadingline"></div> <div id="elapsedline" role="progressbar"></div> <div id="points"> <svg id="pointstart" viewBox="0 0 2 5" aria-hidden="true"> <path d="M 0,0 2,0 1,1 1,4 2,5 0,5 z" /> </svg> <svg id="pointend" viewBox="0 0 2 5" aria-hidden="true"> <path d="M 2,0 0,0 1,1 1,4 0,5 2,5 z" /> </svg> </div> <div id="preview"></div> <time id="popup">--:--</time> </div> <div id="chaptersline" role="progressbar" class="nosmall"></div> </div> </div> <a id="actions" aria-label="${t.more}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <circle cx="12" cy="10" r="4" /> <circle cx="12" cy="22" r="4" /> <circle cx="23" cy="16" r="4" /> <polygon points="12,8 24,14 24,18 12,12"/> <polygon points="12,20 24,14 24,18 12,24"/> </svg> </a> </div> <div id="pageshare"> <div class="share"> <a href="#" target="social" id="nativeshare" class="nosmall" aria-label="${t.share}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <circle cx="12" cy="10" r="4" /> <circle cx="12" cy="22" r="4" /> <circle cx="23" cy="16" r="4" /> <polygon points="12,8 24,14 24,18 12,12"/> <polygon points="12,20 24,14 24,18 12,24"/> </svg> <span class="nosmall">${t.share}</span> </a> <a href="#" target="social" id="twitter" class="nonativeshare nosmall" aria-label="${t.twitter}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 25.941,9.885 C 25.221,10.205 24.448,10.422 23.637,10.520 24.465,10.020 25.101,9.230 25.401,8.288 24.626,8.750 23.768,9.086 22.854,9.267 22.122,8.483 21.080,7.993 19.926,7.993 c -2.215,0 -4.011,1.806 -4.011,4.034 0,0.316 0.035,0.623 0.103,0.919 -3.333,-0.168 -6.288,-1.774 -8.267,-4.215 -0.345,0.596 -0.542,1.289 -0.542,2.028 0,1.399 0.708,2.634 1.784,3.358 -0.657,-0.020 -1.276,-0.202 -1.816,-0.504 -3.98e-4,0.016 -3.98e-4,0.033 -3.98e-4,0.050 0,1.954 1.382,3.585 3.217,3.955 -0.336,0.092 -0.690,0.141 -1.056,0.141 -0.258,0 -0.509,-0.025 -0.754,-0.072 0.510,1.602 1.991,2.769 3.746,2.801 -1.372,1.082 -3.102,1.726 -4.981,1.726 -0.323,0 -0.642,-0.019 -0.956,-0.056 1.775,1.144 3.883,1.812 6.148,1.812 7.377,0 11.411,-6.147 11.411,-11.478 0,-0.174 -0.004,-0.348 -0.011,-0.522 0.783,-0.569 1.463,-1.279 2.001,-2.088 z" /> </svg> <span class="nosmall">${t.twitter}</span> </a> <a href="#" target="social" id="facebook" class="nonativeshare nosmall" aria-label="${t.facebook}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="m 21.117,16.002 -3.728,0 0,10.027 -4.297,0 0,-10.027 -2.070,0 0,-3.280 2.070,0 0,-2.130 c 0,-2.894 1.248,-4.616 4.652,-4.616 l 3.922,0 0,3.549 -3.203,0 c -0.950,-0.001 -1.068,0.495 -1.068,1.421 l -0.005,1.775 4.297,0 -0.568,3.280 0,2.34e-4 z" /> </svg> <span class="nosmall">${t.facebook}</span> </a> <a href="#" target="social" id="email" class="nonativeshare" aria-label="${t.e_mail}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="m 8.030,8.998 15.920,0 c 0.284,0 0.559,0.053 0.812,0.155 l -8.773,9.025 -8.773,-9.026 c 0.253,-0.101 0.528,-0.155 0.812,-0.155 z m -1.990,12.284 0,-10.529 c 0,-0.036 0.002,-0.073 0.004,-0.109 l 5.835,6.003 -5.771,5.089 c -0.045,-0.146 -0.068,-0.298 -0.069,-0.453 z m 17.910,1.754 -15.920,0 c -0.175,0 -0.348,-0.020 -0.514,-0.060 l 5.662,-4.993 2.811,2.892 2.811,-2.892 5.662,4.993 c -0.165,0.039 -0.338,0.060 -0.514,0.060 z m 1.990,-1.754 c 0,0.155 -0.023,0.307 -0.068,0.453 l -5.771,-5.089 5.835,-6.003 c 0.002,0.036 0.004,0.073 0.004,0.109 z" /> </svg> <span class="nosmall">${t.e_mail}</span> </a> <a href="#" target="social" id="link" aria-label="${t.download}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 6,6 26,6 16,26 z" /> <rect x="6" y="22" width="20" height="4" /> </svg> <span class="nosmall">${t.download}</span></a> <a id="back" aria-label="${t.back}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 9,8 24,23 23,24 8,9 z" /> <path d="M 9,24 24,9 23,8 8,23 z" /> </svg> <span class="nosmall">${t.back}</span> </a> </div> </div> </div> <ul id="chapters"> </ul> <ul id="playlist"> </ul> </div> `;
document.head.appendChild(a)}null!==document.head?u():document.addEventListener("DOMContentLoaded",u,!1);function v(a,b,c){c=void 0===c?document:c;Array.from(c.querySelectorAll(a)).forEach(b)}function w(a){let b=document.createElement("a");b.href="string"!==typeof a?a:a.split("#")[0];return b.href}function x(a){w(window.location.href)===w(a.target.href)&&a.preventDefault()}function y(a){a.addEventListener("click",x)}function z(a){window.console.warn(`${"CPU-AUDIO"}: ${a}`)};const A={units:{d:86400,h:3600,m:60,s:1},_is_only_numeric:/^\d+$/,_any_not_numeric:/\D*/g,TimeInSeconds:function(a){let b=0;""!==a&&(b=A._is_only_numeric.test(a)?Number(a):-1===a.indexOf(":")?this.SubunitTimeInSeconds(a):this.ColonTimeInSeconds(a));return b},SubunitTimeInSeconds:function(a){let b=0;for(let c in A.units)A.units.hasOwnProperty(c)&&-1!==a.indexOf(c)&&(a=a.split(c),b+=Number(a[0].replace(A._any_not_numeric,""))*A.units[c],a=a[1]);return b},ColonTimeInSeconds:function(a){let b=0;a=a.split(":");
let c=[1,60,3600,86400];for(let e=0;e<a.length;e++)b+=Number(a[e])*c[a.length-1-e];return b},SecondsInTime:function(a){let b="",c=!1;for(let e in A.units)if(A.units.hasOwnProperty(e)){let f=A.units[e];if(a>=f||c){c=!0;let l=Math.floor(a/f);b+=l+e;a-=l*f}}return""===b?"0s":b},SecondsInColonTime:function(a){let b="",c=!1;for(let e in A.units)if(A.units.hasOwnProperty(e)){let f=A.units[e];if(a>=f||c){c=!0;let e=Math.floor(a/f);b+=""===b?"":":";b+=(10>e&&""!==b?"0":"")+e;a-=e*f}}return 1===b.length?"0:0"+
b:2===b.length?"0:"+b:""===b?"0:00":b},SecondsInPaddledColonTime:function(a){a=A.SecondsInColonTime(a);return"00:00:00".substr(0,8-a.length)+a}};const B={_timecode_start:!1,_timecode_end:!1,_remove_timecode_outofborders:function(a){if(!1!==B._timecode_start&&a<B._timecode_start||!1!==B._timecode_end&&a>B._timecode_end)B._timecode_start=!1,B._timecode_end=!1},hashOrder:function(a,b){var c=!0;"string"!==typeof a&&(c="at_start"in a,a=location.hash.substr(1));let e="";var f="";a=a.split("&");let l=!1;for(let b in a){var k=a[b];if(-1===k.indexOf("=")&&""===e)e=k;else{k=k.split("=");let a=k[1];switch(k[0]){case "t":f=a=""!==a?a:"0";l=!0;break;case "autoplay":l=
"1"===a;break;case "auto_play":l="true"===a}}}if(""===f||c&&!l)return"function"===typeof b&&b(),!1;c=f.split(",");f=c[0];B._timecode_start=A.TimeInSeconds(f);B._timecode_end=1<c.length?A.TimeInSeconds(c[1]):!1;!1!==B._timecode_end&&(B._timecode_end=B._timecode_end>B._timecode_start?B._timecode_end:!1);document.CPU.jumpIdAt(e,f,b);return!0},hover:function(a){let b=a.target,c=document.CPU.find_container(b);b.getClientRects();c.show_throbber_at(a.offsetX/b.clientWidth*c.audiotag.duration)},out:function(a){document.CPU.find_container(a.target).hide_throbber()},
preview_hover:function(){},preview_container_hover:function(a){var b=a.target;a=document.CPU.find_container(b);b=b.closest("li");a.preview(b.dataset.cueStartTime,b.dataset.cueEndTime,b.dataset.cueId)},throbble:function(a){var b=a.target;let c=document.CPU.find_container(b).audiotag;b=void 0!==a.at?a.at:a.offsetX/b.clientWidth*c.duration;B._remove_timecode_outofborders(b);document.CPU.seekElementAt(c,b);B.play(a)},pause:function(a,b){void 0===b&&(a=a.target,b="AUDIO"===a.tagName?a:document.CPU.find_container(a).audiotag);
b.pause();document.CPU.current_audiotag_playing=null;window.localStorage.removeItem(b.currentSrc)},play_once:function(a){a=a.target;document.CPU.only_play_one_audiotag&&document.CPU.current_audiotag_playing&&!document.CPU.is_audiotag_playing(a)&&B.pause(void 0,document.CPU.current_audiotag_playing);document.CPU.current_audiotag_playing=a},play:function(a,b){void 0===b&&(b=document.CPU.find_container(a.target).audiotag);document.CPU.global_controller&&!b.isEqualNode(document.CPU.global_controller.audiotag)&&
(a=document.CPU.global_controller,a.attach_audiotag_to_controller(b),a.audiotag=b,a.show_main(),a.build_chapters(),a.build_playlist());try{b.play(),B._remove_timecode_outofborders(b.currentTime)}catch(c){}},key:function(a,b){function c(b){a.at=e.audiotag.currentTime+b;e.show_throbber_at(a.at);B.throbble(a);e.hide_throbber_later()}b=void 0===b?1:b;let e=document.CPU.find_container(a.target),f=e.audiotag;switch(a.keyCode){case 27:B.restart(a);B.pause(void 0,f);break;case 32:f.paused?B.play(void 0,f):
B.pause(void 0,f);break;case 35:document.CPU.seekElementAt(f,f.duration);break;case 36:B.restart(a);break;case 37:c(-(document.CPU.keymove*b));break;case 39:c(+(document.CPU.keymove*b));break;default:return}a.preventDefault()},keydownplay:function(a){if(13===a.keyCode){var b=document.CPU.find_container(a.target).audiotag;b.paused?B.play(void 0,b):B.pause(void 0,b);a.preventDefault()}},restart:function(a){a=document.CPU.find_container(a.target);document.CPU.seekElementAt(a.audiotag,0)},reward:function(a){a.keyCode=
37;B.key(a)},foward:function(a){a.keyCode=39;B.key(a)},fastreward:function(a){a.keyCode=37;B.key(a,4)},fastfoward:function(a){a.keyCode=39;B.key(a,4)},input_time_change:function(a){var b=a.target;a=document.CPU.find_container(b);b=A.ColonTimeInSeconds(b.value);a.show_throbber_at(b);document.CPU.seekElementAt(a.audiotag,b)},cuechange:function(a,b){document.body.classList.remove(document.CPU.body_className_playing_cue);if(void 0!==b){var c=b.querySelector("#chapters"),e=c.querySelector(".active-cue");
null!==e&&e.classList.remove("active-cue");0!==a.target.activeCues.length&&(a=a.target.activeCues[0].id,null!==document.CPU.current_audiotag_playing&&(document.CPU.body_className_playing_cue=`cpu_playing_tag_\u00ab${document.CPU.current_audiotag_playing.id}\u00bb_cue_\u00ab${a}\u00bb`,document.body.classList.add(document.CPU.body_className_playing_cue)),c=c.querySelector(`#${a}`),null!==c&&(c.classList.add("active-cue"),b=b.querySelector("#chaptersline"),c=b.querySelector(".active-cue"),null!==c&&
c.classList.remove("active-cue"),b=b.querySelector("#segment-"+a),null!==b&&b.classList.add("active-cue")))}},update:function(a){a=a.target;!1!==B._timecode_end&&a.currentTime>B._timecode_end&&B.pause(void 0,a);a.CPU_update();a.paused||window.localStorage.setItem(a.currentSrc,String(a.currentTime))},ended:function(a,b){void 0===b&&(b=a.target);if("playlist"in b.dataset){a=b.dataset.playlist;var c=document.CPU.playlists[a];if(void 0===c)z(`Named playlist ${a} not created. WTF ?`);else{var e=c.indexOf(b.id);
-1===e?z(`Audiotag ${b.id} not in playlist ${a}. WTF ?`):e+1!==c.length&&(b=c[e+1],a=document.getElementById(b),null===a?z(`Audiotag #${b} doesn't exists. WTF ?`):(document.CPU.seekElementAt(a,0),B.play(void 0,a)))}}},observer_cpuaudio:function(a){a=document.CPU.find_container(a[0].target);null===a.element.querySelector("audio")?(window.console.info("CPU-AUDIO: <audio> element was removed."),a.element.remove()):a.element.copy_attributes_to_media_dataset()},observer_audio:function(a){a=document.CPU.find_container(a[0].target);
a.build_chapters();a.complete_template();let b=document.CPU.global_controller;b&&a.audiotag.isEqualNode(b.audiotag)&&(b.build_chapters(),b.complete_template())},native_share:function(a){a=document.CPU.find_container(a.target).fetch_audiotag_dataset();navigator.share({title:a.title,text:a.title,url:a.canonical})},_show_alternate_nav:!1,touchstart:function(a){a=document.CPU.find_container(a.target);B._show_alternate_nav=setTimeout(a.show_alternate_nav,500,a)},touchcancel:function(){clearTimeout(B._show_handheld_nav)}};var C;
if(document.CPU)C=document.CPU;else{var D;a:{for(let a of["og","twitter"]){let b=document.querySelector(`meta[property="${a}:title"]`);if(null!==b){D=b.content;break a}}let a=document.title;D=""===a?null:a}var E=D,F;a:{for(let a of['property="og:image"','name="twitter:image:src"']){let b=document.querySelector(`meta[${a}]`);if(null!==b){F=b.content;break a}}F=null}var G=F,H;{let a=document.querySelector('link[rel="canonical"]');H=null!==a?a.href:location.href.split("#")[0]}var I;{let a=document.querySelector('meta[name="twitter:creator"]');I=
null!==a&&1<a.content.length?a.content:null}C={keymove:5,only_play_one_audiotag:!0,current_audiotag_playing:null,global_controller:null,previewed:null,body_className_playing_cue:null,dynamicallyAllocatedIdPrefix:"CPU-Audio-tag-",count_element:0,playlists:{},advance_in_playlist:!0,convert:A,trigger:B,default_dataset:{title:E,poster:G,canonical:H,twitter:I,playlist:null},recall_stored_play:function(a){if(null===document.CPU.current_audiotag_playing){a=a.target;var b=Number(window.localStorage.getItem(a.currentSrc));
0<b&&(document.CPU.seekElementAt(a,b),B.play(void 0,a))}},recall_audiotag:function(a){a.addEventListener("loadedmetadata",document.CPU.recall_stored_play);a.addEventListener("play",B.play_once);a.addEventListener("ended",B.ended);a.addEventListener("ready",document.CPU.recall_stored_play);a.addEventListener("canplay",document.CPU.recall_stored_play);"ready load loadeddata canplay abort error suspend emptied play playing pause ended durationchange loadedmetadata timeupdate waiting".split(" ").forEach(function(b){a.addEventListener(b,
B.update)});void 0===window.customElements&&["pause","ended"].forEach(function(b){a.addEventListener(b,B.pause)});""===a.preload&&(a.preload="metadata");a.load()},connect_audiotag:function(a){document.CPU.recall_audiotag(a);a.hidden=!0;a.removeAttribute("controls");if("string"===typeof a.dataset.playlist){let b=a.dataset.playlist;b in document.CPU.playlists||(document.CPU.playlists[b]=[]);document.CPU.playlists[b].push(a.id)}},is_audiotag_playing:function(a){return document.CPU.current_audiotag_playing&&
a.isEqualNode(document.CPU.current_audiotag_playing)},is_audiotag_global:function(a){return null===this.global_controller?this.is_audiotag_playing(a):a.isEqualNode(this.global_controller.audiotag)},jumpIdAt:function(a,b,c){function e(a){let c=a.target;void 0!==a.preventDefault&&c.removeEventListener("loadedmetadata",e,!0);a=A.TimeInSeconds(b);document.CPU.seekElementAt(c,a);c.readyState>=c.HAVE_FUTURE_DATA?f({target:c}):c.addEventListener("canplay",f,!0);B.update({target:c})}function f(a){let b=a.target;
B.play(void 0,b);void 0!==a.preventDefault&&b.removeEventListener("canplay",f,!0);"function"===typeof c&&c()}a=""!==a?document.getElementById(a):document.querySelector("cpu-audio audio");if(void 0===a||null===a||void 0===a.currentTime)return z("jumpIdAt audiotag ",a),!1;a.readyState<a.HAVE_CURRENT_DATA?(a.addEventListener("loadedmetadata",e,!0),a.load()):e({target:a});B.update({target:a})},find_interface:function(a){return a.closest("#interface")},find_container:function(a){if("CPU-AUDIO"===a.tagName||
"CPU-CONTROLLER"===a.tagName)return a.CPU;let b=a.closest("CPU-AUDIO");return b?b.CPU:document.CPU.find_interface(a).parentNode.host.CPU},seekElementAt:function(a,b){if(!isNaN(b)){if(void 0!==a.fastSeek)a.fastSeek(b);else try{a.currentTime=b}catch(c){a.src=`${a.currentSrc.split("#")[0]}#t=${b}`}a=a.CPU_controller();null!==a&&a.update_loading&&a.update_loading(b)}},find_current_playlist:function(){let a=this.global_controller.audiotag;if(null===a)return null;for(let b in this.playlists)if(0<=this.playlists[b].indexOf(a.id))return this.playlists[b];
return null}}}document.CPU=C;let J=class{constructor(a,b){this.element=a;this.elements={};this.audiotag=a._audiotag;this.container=b}update_act_container(a){this.container.classList.remove("act-loading","act-pause","act-play");this.container.classList.add(`act-${a}`)}update_playbutton(){let a=this.audiotag;a.readyState<a.HAVE_CURRENT_DATA?this.update_act_container("loading"):this.update_act_container(a.paused?"pause":"play")}update_line(a,b){let c=this.audiotag.duration;this.elements[`${a}line`].style.width=0===c?0:`${100*b/
c}%`}update_buffered(){let a=0,b=this.audiotag.buffered;for(let c=0;c++;c<b.length)a=b.end(c);this.update_line("elapsed",a)}update_time(){let a=this.audiotag;var b=Math.floor(a.currentTime),c=a.dataset.canonical;c=void 0===c?"":c;var e=w(c)+"#";e+=(-1===c.indexOf("#")?a.id:c.substr(c.indexOf("#")+1))+"&";c=this.elements.elapse;c.href=e+("t="+b);b="\u2026";isNaN(Math.round(a.duration))||(b=A.SecondsInColonTime(Math.round(a.duration)));e=A.SecondsInColonTime(a.currentTime);c.innerHTML=`${e}<span class="notiny"> / ${b}</span>`;
c=this.elements.inputtime;c.isEqualNode(this.element.shadowRoot.activeElement)||(c.value=A.SecondsInPaddledColonTime(a.currentTime));c.max=A.SecondsInPaddledColonTime(a.duration);this.update_line("loading",a.currentTime);this.update_buffered()}update_time_borders(){let a=this.audiotag;document.CPU.is_audiotag_global(a)&&!1!==B._timecode_end?(this.elements.points.style.opacity=1,this.elements.pointstart.style.left=`calc(${100*B._timecode_start/a.duration}% - 4px)`,this.elements.pointend.style.left=
`calc(${100*B._timecode_end/a.duration}% + 0px)`):this.elements.points.style.opacity=0}update_loading(a){this.update_line("loading",a);this.update_act_container("loading")}update_error(){var a=this.audiotag;if(null!==a.error){let b=this.elements.pageerror;this.show_interface("error");switch(a.error.code){case a.error.MEDIA_ERR_ABORTED:a=t.media_err_aborted;break;case a.error.MEDIA_ERR_NETWORK:a=t.media_err_network;break;case a.error.MEDIA_ERR_DECODE:a=t.media_err_decode;break;case a.error.MEDIA_ERR_SRC_NOT_SUPPORTED:a=
t.media_err_src_not_supported;break;default:a=t.media_err_unknow}b.innerText=a;return!0}return!1}update(){this.update_error()||(this.update_playbutton(),this.update_time(),this.update_time_borders())}show_throbber_at(a){if(!(1>this.audiotag.duration)){var b=this.elements.popup;b.style.opacity=1;b.style.left=100*a/this.audiotag.duration+"%";b.innerHTML=A.SecondsInColonTime(a)}}hide_throbber(a){(void 0===a?this:a).elements.popup.style.opacity=0}hide_throbber_later(){let a=this.elements.popup;a._hider&&
window.clearTimeout(a._hider);a._hider=window.setTimeout(this.hide_throbber,1E3,this)}preview(a,b,c){var e=!isNaN(a),f=this.elements["interface"].classList;let l=this.elements.chaptersline,k=l.querySelector(".with-preview");k&&k.classList.remove("with-preview");e?(f.add("with-preview"),document.CPU.previewed=this.audiotag.id,e=this.audiotag.duration,f=this.elements.preview,f.style.left=`${100*a/e}%`,f.style.right=`${100-100*(void 0===b?e:b)/e}%`,(a=l.querySelector("#segment-"+c))&&a.classList.add("with-preview")):
(f.remove("with-preview"),document.CPU.previewed=null)}fetch_audiotag_dataset(){let a={};for(let b in document.CPU.default_dataset){let c=null;b in this.audiotag.dataset?c=this.audiotag.dataset[b]:null!==document.CPU.default_dataset[b]&&(c=document.CPU.default_dataset[b]);a[b]=void 0===c?null:c}return a}update_links(){let a=this.fetch_audiotag_dataset();if(null===a.canonical)var b="";else{b=a.canonical;var c=b.indexOf("#");b=-1===c?b:b.substr(0,c)}b=encodeURI(w(b+`#${this.audiotag.id}`+(0===this.audiotag.currentTime?
"":`&t=${Math.floor(this.audiotag.currentTime)}`)));c="";a.twitter&&"@"===a.twitter[0]&&(c=`&via=${a.twitter.substring(1)}`);this.elements.twitter.href=`https://twitter.com/share?text=${a.title}&url=${b}${c}`;this.elements.facebook.href=`https://www.facebook.com/sharer.php?t=${a.title}&u=${b}`;this.elements.email.href=`mailto:?subject=${a.title}&body=${b}`;this.elements.link.href=this.audiotag.currentSrc}show_interface(a){this.container.classList.remove("show-main","show-share","show-error");this.container.classList.add("show-"+
a)}show_actions(a){a=void 0!==a?document.CPU.find_container(a.target):this;a.show_interface("share");a.update_links()}show_main(a){(void 0!==a?document.CPU.find_container(a.target):this).show_interface("main")}show_handheld_nav(a){(void 0!==a?document.CPU.find_container(a.target):this).container.classList.toggle("show-handheld-nav");a.preventDefault()}add_id_to_audiotag(){""===this.audiotag.id&&(this.audiotag.id=document.CPU.dynamicallyAllocatedIdPrefix+String(document.CPU.count_element++))}complete_template(){let a=
this.fetch_audiotag_dataset(),b=this.elements.canonical;b.href=a.canonical;null===a.title?(b.classList.add("untitled"),a.title=t.untitled):b.classList.remove("untitled");b.innerText=a.title;this.elements.poster.src=a.poster}attach_audiotag_to_controller(a){a&&(this.audiotag=a,this.add_id_to_audiotag(),this.complete_template(),B.update({target:a}))}_cuechange_event(a){try{let b;b=a.target.activeCues[0];if(Object.is(b,this._activecue))return;this._activecue=b}catch(b){}B.cuechange(a,this.elements["interface"])}build_chapters(a){let b=
this,c=this.audiotag;void 0!==a&&(b=document.CPU.find_container(a.target),null===b&&window.console.error("CPU-AUDIO: Container CPU- not ready yet. WTF ?"));a=b.elements.chapters;a.innerHTML="";let e=b.elements.chaptersline;e.innerHTML="";let f=!1;if(c&&c.textTracks&&0<c.textTracks.length)for(let n of c.textTracks)if("chapters"===n.kind.toLowerCase()&&null!==n.cues){var l=b._cuechange_event.bind(b);n.removeEventListener("cuechange",l);n.addEventListener("cuechange",l);for(let b of n.cues){var k=Math.floor(b.startTime);
let f=A.SecondsInColonTime(b.startTime);l=`#${c.id}&t=${k}`;let m=document.createElement("li");m.id=b.id;m.classList.add("cue");m.innerHTML=`<a href="${l}" tabindex="0">`+`<strong>${b.text}</strong>`+`<span>${f}</span>`+"</a>";a.append(m);m.dataset.cueId=b.id;m.dataset.cueStartTime=k;m.dataset.cueEndTime=Math.floor(b.endTime);k=document.createElement("a");k.id="segment-"+b.id;k.href=l;k.title=b.text;k.tabIndex="-1";k.style.left=String(100*b.startTime/c.duration)+"%";k.style.right=String(100-100*b.endTime/
c.duration)+"%";e.append(k)}0<n.cues.length&&(f=!0)}"CPU-AUDIO"===b.element.tagName&&(f&&document.body.classList.add(`cpu_tag_\u00ab${c.id}\u00bb_chaptered`),null!==document.CPU.global_controller&&c.isEqualNode(document.CPU.global_controller.audiotag)&&document.CPU.global_controller.build_chapters())}build_playlist(){let a=this.elements.playlist;a.innerHTML="";var b=document.CPU.find_current_playlist();if(null!==b)for(let c of b){b=document.getElementById(c);let e=document.createElement("li");e.classList.add("cue");
c===this.audiotag.id&&e.classList.add("active-cue");e.innerHTML=`<a href="#${b.id}&t=0" tabindex="0">`+`<strong>${b.dataset.title}</strong>`+"</a>";a.append(e)}}build_controller(){this.element.classList.add(this.classname);let a=this;v("[id]",function(b){a.elements[b.id]=b},this.element.shadowRoot);this.elements.poster.addEventListener("load",function(){a.elements["interface"].classList.add("poster-loaded")});let b={passive:!0};var c={pause:B.play,play:B.pause,time:B.throbble,actions:this.show_actions,
back:this.show_main,poster:this.show_main,restart:B.restart,fastreward:B.fastreward,reward:B.reward,foward:B.foward,fastfoward:B.fastfoward};for(var e in c)this.elements[e].addEventListener("click",c[e]);this.element.addEventListener("keydown",B.key);this.elements.control.addEventListener("keydown",B.keydownplay);c=this.elements.time;e={mouseover:!0,mousemove:!0,mouseout:!1,touchstart:!0,touchend:!1,touchcancel:!1};for(var f in e)c.addEventListener(f,e[f]?B.hover:B.out,b);c.addEventListener("touchstart",
B.touchstart,b);c.addEventListener("touchend",B.touchcancel,b);c.addEventListener("contextmenu",this.show_handheld_nav);this.elements.inputtime.addEventListener("input",B.input_time_change);this.elements.inputtime.addEventListener("change",B.input_time_change);this.show_main();this.build_chapters();f=this.build_chapters.bind(this);this.audiotag.addEventListener("loadedmetadata",f,b);(c=this.audiotag.querySelector('track[kind="chapters"]'))&&c.addEventListener("load",f,b);f=this.elements.chapters;
f.addEventListener("mouseover",B.preview_container_hover,b);f.addEventListener("focusin",B.preview_container_hover,b);c=this.preview.bind(this);f.addEventListener("mouseleave",c,b);f.addEventListener("focusout",c,b)}};HTMLAudioElement.prototype.CPU_controller=function(){return this.closest("CPU-AUDIO")};HTMLAudioElement.prototype.CPU_update=function(){var a=this.CPU_controller();a&&(a=a.CPU)&&a.update&&a.update();document.CPU.global_controller&&document.CPU.global_controller.update()};class K extends HTMLElement{constructor(){super();window.matchMedia("screen").matches?"CPU-AUDIO"===this.tagName&&null===this.querySelector("audio[controls]")?(z("Tag <CPU-AUDIO> without <audio controls>.\nSee https://github.com/dascritch/cpu-audio/blob/master/INSTALL.md for a correct installation."),this.remove()):(d=h.querySelector("template#template_cpu"),g=this.attachShadow({mode:"open"}),g.innerHTML=d.innerHTML):this.remove()}connectedCallback(){if(window.matchMedia("screen").matches){this.CPU=
new J(this,this.shadowRoot.querySelector("#interface"));this.CPU.audiotag||(document.CPU.global_controller=this.CPU,this.CPU.audiotag=document.querySelector("cpu-audio audio"));this.CPU.build_controller();v("#canonical",y,this.shadowRoot);this.CPU.attach_audiotag_to_controller(this.CPU.audiotag);var a=this.CPU.elements["interface"].classList,b=this.getAttribute("mode");a.add(`mode-${null!==b?b:"default"}`);b=this.getAttribute("hide");if(null!==b){b=b.split(",");for(let c of b)c=c.toLowerCase(),-1<
p.indexOf(c)&&a.add(`hide-${c}`)}navigator.share&&(a.add("hasnativeshare"),this.CPU.elements.nativeshare.addEventListener("click",B.native_share))}}disconnectedCallback(){}};class L extends K{copy_attributes_to_media_dataset(){for(let a in document.CPU.default_dataset){let b=this.getAttribute(a);null!==b&&(this._audiotag.dataset[a.toLowerCase()]=b)}}connectedCallback(){this._audiotag=this.querySelector("audio[controls]");null!==this._audiotag&&(this.copy_attributes_to_media_dataset(),super.connectedCallback(),document.CPU.connect_audiotag(this.CPU.audiotag),this.observer_cpuaudio=new MutationObserver(B.observer_cpuaudio),this.observer_cpuaudio.observe(this,{childList:!0,
attributes:!0}),this.observer_audio=new MutationObserver(B.observer_audio),this.observer_audio.observe(this,{childList:!0,attributes:!0,subtree:!0}))}};function M(){void 0===window.customElements?(window.console.error("CPU-AUDIO: WebComponent may NOT behave correctly on this browser. Only timecode hash links are activated.\nSee https://github.com/dascritch/cpu-audio/blob/master/index.html for details"),v("audio[controls]",document.CPU.recall_audiotag),document.body.classList.add("cpu-audio-without-webcomponents")):(window.customElements.define("cpu-audio",L),window.customElements.define("cpu-controller",K),document.body.classList.add("cpu-audio-with-webcomponents"));
window.addEventListener("hashchange",B.hashOrder,!1);B.hashOrder({at_start:!0})}null!==document.body?M():document.addEventListener("DOMContentLoaded",M,!1);}).call(this);
