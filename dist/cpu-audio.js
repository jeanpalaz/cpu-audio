/**

Cpu-Audio, an extension to the hash system to address timecode into audio/video elements
Copyright (C) 2014-2018 Xavier ?dascritch? Mouton-Dubosc
License GNU GPL 3

 - project mini-site https://dascritch.github.io/cpu-audio/
 - project repository : https://github.com/dascritch/cpu-audio
 - blog post : https://dascritch.net/post/2018/11/06/Reconstruire-son-lecteur-audio-pour-le-web
 - previously known as
   - https://github.com/dascritch/timecodehash
   - https://github.com/dascritch/ondemiroir-audio-tag
   - https://github.com/dascritch/plugin-dc-ondemiroir-audio-tag

**/
//# sourceMappingURL=./cpu-audio.js.map

(function(){'use strict';let template,shadow_element;const thisDoc=(document._currentScript||document.currentScript).ownerDocument,CpuAudioTagName="CPU-AUDIO",CpuControllerTagName="CPU-CONTROLLER",selector_interface="#interface",acceptable_selector="audio[controls]",acceptable_hide_atttributes=["actions","chapters"];const sources_i18n={fr:{loading:"Chargement en cours\u2026",pause:"Pause",play:"Lecture",canonical:"Lien vers la fiche du sonore",moment:"Lien vers ce moment",untitled:"(sans titre)",cover:"pochette",more:"Actions",share:"Partager",twitter:"Partager sur Twitter",facebook:"Partager sur Facebook",e_mail:"Partager par e-mail",download:"T\u00e9l\u00e9charger",back:"Annuler",media_err_aborted:"Vous avez annul\u00e9 la lecture.",media_err_network:"Une erreur r\u00e9seau a caus\u00e9 l'interruption du t\u00e9l\u00e9chargement.",
media_err_decode:"La lecture du sonore a \u00e9t\u00e9 annul\u00e9e suite \u00e0 des probl\u00e8mes de corruption ou de fonctionnalit\u00e9s non support\u00e9s par votre navigateur.",media_err_src_not_supported:"Le sonore n'a pu \u00eatre charg\u00e9, soit \u00e0 cause de sourcis sur le serveur, le r\u00e9seau ou parce que le format n'est pas support\u00e9.",media_err_unknow:"Erreur due \u00e0 une raison inconnue."},en:{loading:"Loading\u2026",pause:"Pause",play:"Play",canonical:"Link to the sound's page",
moment:"Link to this time",untitled:"(untitled)",cover:"cover",more:"Actions",share:"Share",twitter:"Share on Twitter",facebook:"Share on Facebook","e-mail":"Share via e-mail",download:"Download",back:"Back",media_err_aborted:"You have aborted the play.",media_err_network:"A network error broke the download.",media_err_decode:"Play was canceled due to file corruption or a not supported function in your browser.",media_err_src_not_supported:"The media cannot be downloaded due to server problems, network problems or unsupported by your browser.",
media_err_unknow:"Error of unknown cause."}};let prefered_language="fr",languages=window.navigator.languages;languages=void 0!==languages?languages:[navigator.language||navigator.browserLanguage];let added=!1;for(let a in languages){let b=languages[a];if(b.split){let a=b.split("-")[0];added||"object"!==typeof i18n_source||null===i18n_source||void 0===i18n_source[a]||(prefered_language=a)}}const __=sources_i18n[prefered_language];function _insert(){var a=document.createElement("style");a.innerHTML=' audio[controls] { display : block; width : 100%; } :root { --cpu-height : 64px; --cpu-font-family : Lato, "Open Sans", "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif; --cpu-font-size : 15px; --cpu-background : #555; --cpu-color : #ddd; --cpu-playing-background : #444; --cpu-playing-color : #fff; --cpu-error-background : #a00 ; --cpu-error-color : #ff7 ; --cpu-popup-background : #aaa; --cpu-popup-color : #333; --cpu-elapse-width : 185px; --cpu-min-padding : 16px; --cpu-inner-shadow : inset 0px 5px 10px -5px black; } @media (max-width: 640px) , @element .interface and (max-width: 640px) { :root , .interface { --cpu-font-size : 13px; --cpu-height : 32px; --cpu-elapse-width : 160px; --cpu-min-padding : 4px; } @media (max-width: 480px) , @element .interface and (max-width: 480px) { :root , .interface { --cpu-elapse-width : 80px; } }';
document.head.appendChild(a);a=document.createElement("template");a.id="template_cpu";a.innerHTML=`<style>#interface { font-family : var(--cpu-font-family); font-size : var(--cpu-font-size); --cpu-timeline-height : 10px; } #interface, * { line-height : 1.2; border : none; padding : 0; margin : 0; transition : none; moz-user-select: none; ms-user-select: none; webkit-user-select: none; user-select: none; } .principal { display : flex; overflow : hidden; background : var(--cpu-background); color : var(--cpu-color); height : var(--cpu-height); } .act-error { background : var(--cpu-error-background); color : var(--cpu-error-color); } a, button { background : var(--cpu-background); color : var(--cpu-color); border : none; text-decoration : none; } svg { fill : currentColor; width : var(--cpu-height); height : var(--cpu-height); } a:hover, a:focus, button:hover, button:focus { color : var(--cpu-background); background : var(--cpu-color); } a:hover svg , a:focus svg { fill : currentColor; } .loading circle { fill : #777; } .act-play { background : var(--cpu-playing-background); color : var(--cpu-playing-color); } .act-play a { color : var(--cpu-playing-color); } .act-play a:hover, .act-play a:focus { color : var(--cpu-playing-background); background : var(--cpu-playing-color); } .show-error { background : var(--cpu-error-background); color : var(--cpu-error-color); } #pageerror { padding: 0px 4px; align-self: center; } #control, #actions, #back { flex : 0 0 var(--cpu-height); width : var(--cpu-height); max-height : var(--cpu-height); height : 100%; text-align : center; vertical-align : middle; } a { cursor : pointer; } .loading, #play, #pause, .show-main #pageshare, .show-main #pageerror, .show-share #pagemain, .show-share #pageerror, .show-error #pagemain, .show-error #pageshare , .show-error #poster, .handheld-nav , .show-handheld-nav #titleline { display : none; } .act-loading .loading, .act-play #play, .act-pause #pause { display : block; } .show-share #pageshare, .show-main #pagemain, .share { flex : 1 1 100%; display : flex; align-items: center; } .act-loading .loading circle:nth-child(1) { animation: pulse0 2s infinite; } .act-loading .loading circle:nth-child(2) { animation: pulse1 2s infinite; } .act-loading .loading circle:nth-child(3) { animation: pulse2 2s infinite; } @keyframes pulse0 { 0% {opacity : 1;} 50% {opacity : 0;} 100% {opacity : 1;} } @keyframes pulse1 { 0% {opacity : 0.75;} 12% {opacity : 1;} 62% {opacity : 0;} 100% {opacity : 0.75;} } @keyframes pulse2 { 0% {opacity : 0.5;} 25% {opacity : 1;} 75% {opacity : 0;} 100% {opacity : 0.5;} } @keyframes pulse3 { 0% {opacity : 0.25;} 37% {opacity : 1;} 87% {opacity : 0;} 100% {opacity : 0.25;} } #poster { max-width : var(--cpu-height); min-width : var(--cpu-height); max-height : var(--cpu-height); min-height : var(--cpu-height); object-fit: contain; } .loading svg, #play svg, #pause svg, #actions svg { vertical-align : middle; max-width : 100%; max-height : 100%; } .loading { background : var(--cpu-background) !important; } #titleline { display : flex; } #about, #title { flex : 1 1 100%; position : relative; } #title a { display : block; text-overflow : ellipsis; max-height: 48px; overflow: hidden; } #canonical.untitled { font-style : italic; } #elapse { flex : 1 0 var(--cpu-elapse-width); text-align : right; } #time { background : black; width : 100%; height : var(--cpu-timeline-height); display : block; border-radius : 4px; position : relative; cursor:none; } #loadingline, #elapsedline { background : white; height : var(--cpu-timeline-height) ; display : block ; position : absolute; left : 0; border-radius : 4px; pointer-events : none; } #elapsedline { z-index : 2; } #points { display : block ; position : absolute; left : 0; width: 100%; opacity : 0; } #points svg { fill : red; pointer-events : none; position: absolute; z-index : 126; width : 10px; height : 10px; } .act-loading #loadingline { background : repeating-linear-gradient(135deg, #bbb 0, #999 5px, #999 10px, #ddd 15px, #ddd 20px, #bbb 25px); animation: loadingline 500ms linear infinite; } @keyframes loadingline { 0% { background-position-x : -30px; } 100% { background-position-x : 0px;} } .show-handheld-nav .handheld-nav { display : flex; } .handheld-nav * { flex : 1 0 auto; height : calc( var(--cpu-height) - calc( var(--cpu-timeline-height) + 4px ) ); } [type="time"] { text-align : center; } .hide-actions #actions { visibility : hidden; pointer-events: none; min-width : var(--cpu-min-padding); max-width : var(--cpu-min-padding); } .share { text-align : center; } .share a { display: flex; align-items: center; justify-content: center; height : var(--cpu-height); } .share a, .share div { flex : 1 0; color : white; text-decoration : none; overflow : hidden; text-overflow : clip; } .share a:hover, .share a:focus, .share div:hover { color : var(--cpu-background); background : var(--cpu-color); } .share svg { vertical-align : middle; width : 32px; height : 32px; } .share #nativeshare { display : none; } .hasnativeshare .share #nativeshare { display : flex; } .hasnativeshare .share .nonativeshare { display : none; } #twitter { background : #4DB5F4 } #facebook, #nativeshare { background : #5974CC } #email { background : #CC0000 } #link { background : #77F } #popup { pointer-events : none; position: absolute; transform: translate(-25px, -19px); z-index : 127; min-width : 50px; font-size : 11px; text-align : center; padding : 2px; border-radius: 4px; box-shadow: black 2px 2px; background : var(--cpu-popup-background); color : var(--cpu-popup-color); opacity : 0; moz-user-select: none; ms-user-select: none; webkit-user-select: none; user-select: none; } #popup:before { pointer-events : none; content:""; position: absolute; z-index : 127; left: 20px; bottom: -8px; width: 0; height : 0; border-top: 8px solid var(--cpu-popup-background); border-left: 4px solid transparent; border-right: 4px solid transparent; } #chapters, #playlist { display : flex; overflow : scoll; background : var(--cpu-background); color : var(--cpu-color); list-style: none; flex-direction: column; padding : 0 var(--cpu-min-padding); box-shadow: var(--cpu-inner-shadow); } .cue { border-top : 1px solid black; } .cue a { display : flex; margin : 0px; padding : 2px } .active-cue a { background : var(--cpu-color); color : var(--cpu-background); } .cue strong { flex : 1 1; font-weight : normal; } .cue span { flex : 0 0 var(--cpu-elapse-width); text-align : right; } .mode-compact { width : calc(var(--cpu-elapse-width) + var(--cpu-height) + 32px); } .mode-button { width : var(--cpu-height); } .mode-compact #poster, .mode-compact #title, .mode-compact #line, .mode-compact #actions, .mode-compact #chapters, .mode-button #poster, .mode-button #about, .mode-button #actions, .mode-button #chapters, .mode-hidden, .hide-chapters #chapters { display : none; } .mode-compact.show-main #pagemain { flex : 0 0 auto; } @media (max-width: 640px) , @element #interface and (max-width: 640px) { .nosmall { display : none; } #title a { max-height : 16px; } #elapse { max-height : 16px; } #interface { --cpu-timeline-height : 8px ; } } @media (max-width: 480px) , @element #interface and (max-width: 480px) { .mode-default .notiny { display : none; } .mode-default #elapse { flex : 1 0 var(--cpu-elapse-width); } } @media (max-width: 320px) , @element #interface and (max-width: 320px) { .mode-default #elapse { display : none; } } @media print { #interface { display : none; } }</style><div id="interface" tabindex="0"> <div class="principal"> <img id="poster" class="nosmall" src="" alt="" /> <div id="pageerror"> </div> <div id="pagemain"> <a id="control" tabindex="0"> <div class="loading" aria-label="${__.loading}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <circle cx="6" cy="22" r="4" /> <circle cx="16" cy="22" r="4" /> <circle cx="26" cy="22" r="4" /> </svg> </div> <div id="play" aria-label="${__.pause}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 6,6 12.667,6 12.667,26 6,26 z" /> <path d="M 19.333,6 26,6 26,26 19.333,26 z" /> </svg> </div> <div id="pause" aria-label="${__.play}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 6,6 6,26 26,16 z" /> </svg> </div> </a> <div id="about"> <div id="titleline"> <div id="title"><a href="#" id="canonical" aria-label="${__.canonical}"></a></div> <a id="elapse" aria-label="${__.moment}" tabindex="-1">\u2026</a> </div> <div class="handheld-nav"> <button type="button" id="restart"> <svg viewBox="0 0 32 32" aria-hidden="true"> <polygon points="4,0 8,0 8,16 4,16"/> <path d="M 16,0 8,8 16,16 z" /> <path d="M 24,0 16,8 24,16 z" /> </svg> </button> <button type="button" id="fastreward"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 8,0 0,8 8,16 z" /> <path d="M 16,0 8,8 16,16 z" /> <path d="M 24,0 16,8 24,16 z" /> </svg> </button> <button type="button" id="reward"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 8,0 0,8 8,16 z" /> <path d="M 16,0 8,8 16,16 z" /> </svg> </button> <input type="time" step="1" min="0:00" id="inputtime" /> <button type="button" id="foward"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 0,0 8,8 0,16 z" /> <path d="M 8,0 16,8 8,16 z" /> </svg> </button> <button type="button" id="fastfoward"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 0,0 8,8 0,16 z" /> <path d="M 8,0 16,8 8,16 z" /> <path d="M 16,0 24,8 16,16 z" /> </svg> </button> </div> <div id="line"> <div id="time"> <div id="loadingline"></div> <div id="elapsedline"></div> <div id="points"> <svg id="pointstart" viewBox="0 0 2 5" aria-hidden="true"> <path d="M 0,0 2,0 1,1 1,4 2,5 0,5 z" /> </svg> <svg id="pointend" viewBox="0 0 2 5" aria-hidden="true"> <path d="M 2,0 0,0 1,1 1,4 0,5 2,5 z" /> </svg> </div> <time id="popup">--:--</time> </div> </div> </div> <a id="actions" aria-label="${__.more}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <circle cx="12" cy="10" r="4" /> <circle cx="12" cy="22" r="4" /> <circle cx="23" cy="16" r="4" /> <polygon points="12,8 24,14 24,18 12,12"/> <polygon points="12,20 24,14 24,18 12,24"/> </svg> </a> </div> <div id="pageshare"> <div class="share"> <a href="#" target="social" id="nativeshare" class="nosmall" aria-label="${__.share}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <circle cx="12" cy="10" r="4" /> <circle cx="12" cy="22" r="4" /> <circle cx="23" cy="16" r="4" /> <polygon points="12,8 24,14 24,18 12,12"/> <polygon points="12,20 24,14 24,18 12,24"/> </svg> <span class="nosmall">${__.share}</span> </a> <a href="#" target="social" id="twitter" class="nonativeshare nosmall" aria-label="${__.twitter}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 25.941,9.885 C 25.221,10.205 24.448,10.422 23.637,10.520 24.465,10.020 25.101,9.230 25.401,8.288 24.626,8.750 23.768,9.086 22.854,9.267 22.122,8.483 21.080,7.993 19.926,7.993 c -2.215,0 -4.011,1.806 -4.011,4.034 0,0.316 0.035,0.623 0.103,0.919 -3.333,-0.168 -6.288,-1.774 -8.267,-4.215 -0.345,0.596 -0.542,1.289 -0.542,2.028 0,1.399 0.708,2.634 1.784,3.358 -0.657,-0.020 -1.276,-0.202 -1.816,-0.504 -3.98e-4,0.016 -3.98e-4,0.033 -3.98e-4,0.050 0,1.954 1.382,3.585 3.217,3.955 -0.336,0.092 -0.690,0.141 -1.056,0.141 -0.258,0 -0.509,-0.025 -0.754,-0.072 0.510,1.602 1.991,2.769 3.746,2.801 -1.372,1.082 -3.102,1.726 -4.981,1.726 -0.323,0 -0.642,-0.019 -0.956,-0.056 1.775,1.144 3.883,1.812 6.148,1.812 7.377,0 11.411,-6.147 11.411,-11.478 0,-0.174 -0.004,-0.348 -0.011,-0.522 0.783,-0.569 1.463,-1.279 2.001,-2.088 z" /> </svg> <span class="nosmall">${__.twitter}</span> </a> <a href="#" target="social" id="facebook" class="nonativeshare nosmall" aria-label="${__.facebook}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="m 21.117,16.002 -3.728,0 0,10.027 -4.297,0 0,-10.027 -2.070,0 0,-3.280 2.070,0 0,-2.130 c 0,-2.894 1.248,-4.616 4.652,-4.616 l 3.922,0 0,3.549 -3.203,0 c -0.950,-0.001 -1.068,0.495 -1.068,1.421 l -0.005,1.775 4.297,0 -0.568,3.280 0,2.34e-4 z" /> </svg> <span class="nosmall">${__.facebook}</span> </a> <a href="#" target="social" id="email" class="nonativeshare" aria-label="${__.e_mail}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="m 8.030,8.998 15.920,0 c 0.284,0 0.559,0.053 0.812,0.155 l -8.773,9.025 -8.773,-9.026 c 0.253,-0.101 0.528,-0.155 0.812,-0.155 z m -1.990,12.284 0,-10.529 c 0,-0.036 0.002,-0.073 0.004,-0.109 l 5.835,6.003 -5.771,5.089 c -0.045,-0.146 -0.068,-0.298 -0.069,-0.453 z m 17.910,1.754 -15.920,0 c -0.175,0 -0.348,-0.020 -0.514,-0.060 l 5.662,-4.993 2.811,2.892 2.811,-2.892 5.662,4.993 c -0.165,0.039 -0.338,0.060 -0.514,0.060 z m 1.990,-1.754 c 0,0.155 -0.023,0.307 -0.068,0.453 l -5.771,-5.089 5.835,-6.003 c 0.002,0.036 0.004,0.073 0.004,0.109 z" /> </svg> <span class="nosmall">${__.e_mail}</span> </a> <a href="#" target="social" id="link" aria-label="${__.download}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 6,6 26,6 16,26 z" /> <rect x="6" y="22" width="20" height="4" /> </svg> <span class="nosmall">${__.download}</span></a> <a id="back" aria-label="${__.back}"> <svg viewBox="0 0 32 32" aria-hidden="true"> <path d="M 9,8 24,23 23,24 8,9 z" /> <path d="M 9,24 24,9 23,8 8,23 z" /> </svg> <span class="nosmall">${__.back}</span> </a> </div> </div> </div> <ul id="chapters"> </ul> <ul id="playlist"> </ul> </div> `;
document.head.appendChild(a)}null!==document.head?_insert():document.addEventListener("DOMContentLoaded",_insert,!1);function onDebug(a){"function"===typeof a&&a()}function querySelector_apply(a,b,c){c=void 0===c?document:c;Array.from(c.querySelectorAll(a)).forEach(b)}function is_decent_browser_for_webcomponents(){return void 0!==window.customElements}function absolutize_url(a){let b=document.createElement("a");b.href="string"!==typeof a?a:a.split("#")[0];return b.href}function not_screen_context(){return!window.matchMedia("screen").matches}
function prevent_link_on_same_page(a){absolutize_url(window.location.href)===absolutize_url(a.target.href)&&a.preventDefault()}function element_prevent_link_on_same_page(a){a.addEventListener("click",prevent_link_on_same_page)}function _isEvent(a){return void 0!==a.preventDefault};const convert={units:{d:86400,h:3600,m:60,s:1},TimeInSeconds:function(a){let b=0;""!==a&&(b=/^\d+$/.test(a)?Number(a):-1===a.indexOf(":")?this.SubunitTimeInSeconds(a):this.ColonTimeInSeconds(a));return b},SubunitTimeInSeconds:function(a){let b=0;for(let c in convert.units)convert.units.hasOwnProperty(c)&&-1!==a.indexOf(c)&&(a=a.split(c),b+=Number(a[0].replace(/\D*/g,""))*convert.units[c],a=a[1]);return b},ColonTimeInSeconds:function(a){let b=0;a=a.split(":");let c=[1,60,3600,86400];for(let d=0;d<
a.length;d++)b+=Number(a[d])*c[a.length-1-d];return b},SecondsInTime:function(a){let b="",c=!1;for(let d in convert.units)if(convert.units.hasOwnProperty(d)){let e=convert.units[d];if(a>=e||c){c=!0;let g=Math.floor(a/e);b+=g+d;a-=g*e}}return""===b?"0s":b},SecondsInColonTime:function(a){let b="",c=!1;for(let d in convert.units)if(convert.units.hasOwnProperty(d)){let e=convert.units[d];if(a>=e||c){c=!0;let d=Math.floor(a/e);b+=""===b?"":":";b+=(10>d&&""!==b?"0":"")+d;a-=d*e}}return 1===b.length?"0:0"+
b:2===b.length?"0:"+b:""===b?"0:00":b},SecondsInPaddledColonTime:function(a){a=convert.SecondsInColonTime(a);return"00:00:00".substr(0,8-a.length)+a}};const KEY_LEFT_ARROW=37,KEY_RIGHT_ARROW=39,trigger={_timecode_start:!1,_timecode_end:!1,_remove_timecode_outofborders:function(a){if(!1!==trigger._timecode_start&&a<trigger._timecode_start||!1!==trigger._timecode_end&&a>trigger._timecode_end)trigger._timecode_start=!1,trigger._timecode_end=!1},hashOrder:function(a,b){var c=!0;"string"!==typeof a&&(c="at_start"in a,a=location.hash.substr(1));let d="";var e="";a=a.split("&");let g=!1;for(let b in a){var f=a[b];if(-1===f.indexOf("=")&&""===d)d=f;else{f=
f.split("=");let a=f[1];switch(f[0]){case "t":e=a=""!==a?a:"0";g=!0;break;case "autoplay":g="1"===a;break;case "auto_play":g="true"===a}}}if(""===e||c&&!g)return onDebug(b),!1;c=e.split(",");e=c[0];trigger._timecode_start=convert.TimeInSeconds(e);trigger._timecode_end=1<c.length?convert.TimeInSeconds(c[1]):!1;!1!==trigger._timecode_end&&(trigger._timecode_end=trigger._timecode_end>trigger._timecode_start?trigger._timecode_end:!1);document.CPU.jumpIdAt(d,e,b);return!0},hover:function(a){let b=document.CPU.find_container(a.target);
a.target.getClientRects();b.show_throbber_at(a.offsetX/a.target.clientWidth*b.audiotag.duration)},out:function(a){document.CPU.find_container(a.target).hide_throbber()},throbble:function(a){let b,c=document.CPU.find_container(a.target).audiotag;b=void 0!==a.at?a.at:a.offsetX/a.target.clientWidth*c.duration;trigger._remove_timecode_outofborders(b);document.CPU.seekElementAt(c,b);trigger.play(a)},pause:function(a,b){void 0===b&&(a=a.target,b="AUDIO"===a.tagName?a:document.CPU.find_container(a).audiotag);
b.pause();document.CPU.current_audiotag_playing=null;window.localStorage.removeItem(b.currentSrc)},play_once:function(a){a=a.target;document.CPU.only_play_one_audiotag&&document.CPU.current_audiotag_playing&&!document.CPU.is_audiotag_playing(a)&&trigger.pause(void 0,document.CPU.current_audiotag_playing);document.CPU.current_audiotag_playing=a},play:function(a,b){void 0===b&&(b=document.CPU.find_container(a.target).audiotag);trigger._remove_timecode_outofborders(b.currentTime);document.CPU.global_controller&&
(document.CPU.global_controller.attach_audiotag_to_controller(b),document.CPU.global_controller.audiotag=b,document.CPU.global_controller.show_main(),document.CPU.global_controller.build_chapters(),document.CPU.global_controller.build_playlist());b.play()},key:function(a,b){function c(b){a.at=d.audiotag.currentTime+b;d.show_throbber_at(a.at);trigger.throbble(a);d.hide_throbber_later()}b=void 0===b?1:b;let d=document.CPU.find_container(a.target);switch(a.keyCode){case 27:trigger.restart(a);trigger.pause(void 0,
d.audiotag);break;case 32:d.audiotag.paused?trigger.play(void 0,d.audiotag):trigger.pause(void 0,d.audiotag);break;case 35:document.CPU.seekElementAt(d.audiotag,d.audiotag.duration);break;case 36:trigger.restart(a);break;case KEY_LEFT_ARROW:c(-(document.CPU.keymove*b));break;case KEY_RIGHT_ARROW:c(+(document.CPU.keymove*b));break;default:return}a.preventDefault()},keydownplay:function(a){if(13===a.keyCode){var b=document.CPU.find_container(a.target);b.audiotag.paused?trigger.play(void 0,b.audiotag):
trigger.pause(void 0,b.audiotag);a.preventDefault()}},restart:function(a){a=document.CPU.find_container(a.target);document.CPU.seekElementAt(a.audiotag,0)},reward:function(a){a.keyCode=KEY_LEFT_ARROW;trigger.key(a)},foward:function(a){a.keyCode=KEY_RIGHT_ARROW;trigger.key(a)},fastreward:function(a){a.keyCode=KEY_LEFT_ARROW;trigger.key(a,4)},fastfoward:function(a){a.keyCode=KEY_RIGHT_ARROW;trigger.key(a,4)},input_time_change:function(a){let b=document.CPU.find_container(a.target);a=convert.ColonTimeInSeconds(a.target.value);
b.show_throbber_at(a);document.CPU.seekElementAt(b.audiotag,a)},cuechange:function(a,b){if(void 0!==b){var c=b.querySelector(".active-cue");null!==c&&c.classList.remove("active-cue");0!==a.target.activeCues.length&&(a=b.querySelector(`#${a.target.activeCues[0].id}`),null!==a&&a.classList.add("active-cue"))}},update:function(a){a=a.target;!1!==trigger._timecode_end&&a.currentTime>trigger._timecode_end&&trigger.pause(void 0,a);a.CPU_update();a.paused||window.localStorage.setItem(a.currentSrc,String(a.currentTime))},
ended:function(a,b){void 0===b&&(b=a.target);if("playlist"in b.dataset){a=b.dataset.playlist;var c=document.CPU.playlists[a];if(void 0===c)console.warn(`Named playlist ${a} not created. WTF ?`);else{var d=c.indexOf(b.id);-1===d?console.warn(`Audiotag ${b.id} not in playlist ${a}. WTF ?`):d+1!==c.length&&(b=c[d+1],a=document.getElementById(b),null===a?console.warn(`Audiotag #${b} doesn't exists. WTF ?`):(document.CPU.seekElementAt(a,0),trigger.play(void 0,a)))}}},observer_cpuaudio:function(a){a=document.CPU.find_container(a[0].target);
null===a.element.querySelector("audio")?(console.info("<audio> element was removed."),a.element.remove()):a.element.copy_attributes_to_media_dataset()},observer_audio:function(a){a=document.CPU.find_container(a[0].target);a.build_chapters();a.complete_template();let b=document.CPU.global_controller;b&&a.audiotag.isEqualNode(b.audiotag)&&(b.build_chapters(),b.complete_template())},native_share:function(a){a=document.CPU.find_container(a.target).fetch_audiotag_dataset();navigator.share({title:a.title,
text:a.title,url:a.canonical})},_show_alternate_nav:!1,touchstart:function(a){a=document.CPU.find_container(a.target);trigger._show_alternate_nav=setTimeout(a.show_alternate_nav,500,a)},touchcancel:function(a){clearTimeout(trigger._show_handheld_nav)}};document.CPU=document.CPU?document.CPU:{keymove:5,only_play_one_audiotag:!0,current_audiotag_playing:null,global_controller:null,dynamicallyAllocatedIdPrefix:"CPU-Audio-tag-",count_element:0,playlists:{},advance_in_playlist:!0,convert,trigger,default_dataset:{title:function(){for(var a of["og","twitter"]){let b=window.document.querySelector(`meta[property="${a}:title"]`);if(null!==b)return b.content}a=window.document.title;return""===a?null:a}(),poster:function(){for(let a of['property="og:image"',
'name="twitter:image:src"']){let b=window.document.querySelector(`meta[${a}]`);if(null!==b)return b.content}return null}(),canonical:function(){let a=window.document.querySelector('link[rel="canonical"]');return null!==a?a.href:window.location.href.split("#")[0]}(),twitter:function(){let a=window.document.querySelector('meta[name="twitter:creator"]');return null!==a&&1<a.content.length?a.content:null}(),playlist:null},recall_stored_play:function(a){if(null===document.CPU.current_audiotag_playing){a=
a.target;var b=Number(window.localStorage.getItem(a.currentSrc));0<b&&(document.CPU.seekElementAt(a,b),trigger.play(void 0,a))}},recall_audiotag:function(a){a.addEventListener("loadedmetadata",document.CPU.recall_stored_play);a.addEventListener("play",trigger.play_once);a.addEventListener("ended",trigger.ended);a.addEventListener("ready",document.CPU.recall_stored_play);a.addEventListener("canplay",document.CPU.recall_stored_play);"ready load loadeddata canplay abort error suspend emptied play playing pause ended durationchange loadedmetadata timeupdate waiting".split(" ").forEach(function(b){a.addEventListener(b,
trigger.update)});is_decent_browser_for_webcomponents()?a.addEventListener("loadedmetadata",document.CPU.find_container(a).build_chapters):["pause","ended"].forEach(function(b){a.addEventListener(b,trigger.pause)});""===a.preload&&(a.preload="metadata");a.load()},connect_audiotag:function(a){document.CPU.recall_audiotag(a);a.hidden=!0;a.removeAttribute("controls");if("string"===typeof a.dataset.playlist){let b=a.dataset.playlist;b in document.CPU.playlists||(document.CPU.playlists[b]=[]);document.CPU.playlists[b].push(a.id)}},
is_audiotag_playing:function(a){return document.CPU.current_audiotag_playing&&a.isEqualNode(document.CPU.current_audiotag_playing)},is_audiotag_global:function(a){return null===this.global_controller?this.is_audiotag_playing(a):a.isEqualNode(this.global_controller.audiotag)},jumpIdAt:function(a,b,c){function d(a){let c=a.target;_isEvent(a)&&c.removeEventListener("loadedmetadata",d,!0);a=convert.TimeInSeconds(b);document.CPU.seekElementAt(c,a);c.readyState>=c.HAVE_FUTURE_DATA?e({target:c}):c.addEventListener("canplay",
e,!0);trigger.update({target:c})}function e(a){let b=a.target;trigger.play(void 0,b);_isEvent(a)&&b.removeEventListener("canplay",e,!0);onDebug(c)}a=""!==a?document.getElementById(a):document.querySelector("cpu-audio audio");if(void 0===a||null===a||void 0===a.currentTime)return console.warn("jumpIdAt audiotag ",a),!1;a.readyState<a.HAVE_CURRENT_DATA?(a.addEventListener("loadedmetadata",d,!0),a.load()):d({target:a});trigger.update({target:a})},find_interface:function(a){return a.closest(selector_interface)},
find_container:function(a){return a.tagName===CpuAudioTagName||a.tagName===CpuControllerTagName?a.CPU:"AUDIO"===a.tagName?a.parentNode.CPU:this.find_interface(a).parentNode.host.CPU},seekElementAt:function(a,b){if(!isNaN(b)){if(void 0!==a.fastSeek)a.fastSeek(b);else try{a.currentTime=b}catch(c){a.src=`${a.currentSrc.split("#")[0]}#t=${b}`}a=a.CPU_controller();null!==a&&a.update_loading&&a.update_loading(b)}},find_current_playlist:function(){let a=this.global_controller.audiotag;if(null===a)return null;
for(let b in this.playlists)if(0<=this.playlists[b].indexOf(a.id))return this.playlists[b];return null}};let CPU_element_api=class{constructor(a,b){this.element=a;this.elements={};this.audiotag=a._audiotag;this.container=b}update_act_container(a){this.container.classList.remove("act-loading","act-pause","act-play");this.container.classList.add(`act-${a}`)}update_playbutton(){this.audiotag.readyState<this.audiotag.HAVE_CURRENT_DATA?this.update_act_container("loading"):this.update_act_container(this.audiotag.paused?"pause":"play")}update_line(a,b){let c=this.audiotag.duration;this.elements[`${a}line`].style.width=
0===c?0:`${100*b/c}%`}update_buffered(){let a=0,b=this.audiotag.buffered;for(let c=0;c++;c<b.length)a=b.end(c);this.update_line("elapsed",a)}update_time(a){var b=convert.SecondsInTime(this.audiotag.currentTime),c=absolutize_url(this.audiotag.dataset.canonical)+"#";c+=this.audiotag.id?this.audiotag.id+"&":"";a=this.elements.elapse;a.href=c+("t="+b);b="\u2026";isNaN(Math.round(this.audiotag.duration))||(b=convert.SecondsInColonTime(Math.round(this.audiotag.duration)));c=convert.SecondsInColonTime(this.audiotag.currentTime);
a.innerHTML=`${c}\n                                    <span class="notiny"> / ${b}</span>`;this.elements.inputtime.isEqualNode(this.element.shadowRoot.activeElement)||(this.elements.inputtime.value=convert.SecondsInPaddledColonTime(this.audiotag.currentTime));this.elements.inputtime.max=convert.SecondsInPaddledColonTime(this.audiotag.duration);this.update_line("loading",this.audiotag.currentTime);this.update_buffered()}update_time_borders(){document.CPU.is_audiotag_global(this.audiotag)&&!1!==trigger._timecode_end?
(this.elements.points.style.opacity=1,this.elements.pointstart.style.left=`calc(${100*trigger._timecode_start/this.audiotag.duration}% - 4px)`,this.elements.pointend.style.left=`calc(${100*trigger._timecode_end/this.audiotag.duration}% + 0px)`):this.elements.points.style.opacity=0}update_loading(a){this.update_line("loading",a);this.update_act_container("loading")}update_error(){if(null!==this.audiotag.error){let a,b=this.elements.pageerror;this.show_interface("error");switch(this.audiotag.error.code){case this.audiotag.error.MEDIA_ERR_ABORTED:a=
__.media_err_aborted;break;case this.audiotag.error.MEDIA_ERR_NETWORK:a=__.media_err_network;break;case this.audiotag.error.MEDIA_ERR_DECODE:a=__.media_err_decode;break;case this.audiotag.error.MEDIA_ERR_SRC_NOT_SUPPORTED:a=__.media_err_src_not_supported;break;default:a=__.media_err_unknow}b.innerText=a;return!0}return!1}update(){this.update_error()||(this.update_playbutton(),this.update_time(),this.update_time_borders())}show_throbber_at(a){if(!(1>this.audiotag.duration)){var b=this.elements.popup;
b.style.opacity=1;b.style.left=100*a/this.audiotag.duration+"%";b.innerHTML=convert.SecondsInColonTime(a)}}hide_throbber(a){(void 0===a?this:a).elements.popup.style.opacity=0}hide_throbber_later(){let a=this.elements.popup;a._hider&&window.clearTimeout(a._hider);a._hider=window.setTimeout(this.hide_throbber,1E3,this)}fetch_audiotag_dataset(){let a={};for(let b in document.CPU.default_dataset){let c=null;b in this.audiotag.dataset?c=this.audiotag.dataset[b]:null!==document.CPU.default_dataset[b]&&
(c=document.CPU.default_dataset[b]);a[b]=void 0===c?null:c}return a}update_links(){let a=this.fetch_audiotag_dataset();if(null===a.canonical)var b="";else{b=a.canonical;var c=b.indexOf("#");b=-1===c?b:b.substr(0,c)}b=b+`#${this.audiotag.id}`+(0===this.audiotag.currentTime?"":`&t=${convert.SecondsInTime(this.audiotag.currentTime)}`);b=encodeURI(absolutize_url(b));c="";a.twitter&&"@"===a.twitter[0]&&(c=`&via=${a.twitter.substring(1)}`);this.elements.twitter.href=`https://twitter.com/share?text=${a.title}&url=${b}${c}`;
this.elements.facebook.href=`https://www.facebook.com/sharer.php?t=${a.title}&u=${b}`;this.elements.email.href=`mailto:?subject=${a.title}&body=${b}`;this.elements.link.href=this.audiotag.currentSrc}show_interface(a){this.container.classList.remove("show-main","show-share","show-error");this.container.classList.add("show-"+a)}show_actions(a){a=void 0!==a?document.CPU.find_container(a.target):this;a.show_interface("share");a.update_links()}show_main(a){(void 0!==a?document.CPU.find_container(a.target):
this).show_interface("main")}show_handheld_nav(a){(void 0!==a?document.CPU.find_container(a.target):this).container.classList.toggle("show-handheld-nav");a.preventDefault()}add_id_to_audiotag(){""===this.audiotag.id&&(this.audiotag.id=document.CPU.dynamicallyAllocatedIdPrefix+String(document.CPU.count_element++))}complete_template(){let a=this.fetch_audiotag_dataset();this.elements.canonical.href=a.canonical;null===a.title?(this.elements.canonical.classList.add("untitled"),a.title=__.untitled):this.elements.canonical.classList.remove("untitled");
this.elements.canonical.innerText=a.title;this.elements.poster.src=a.poster}attach_audiotag_to_controller(a){a&&(this.audiotag=a,this.add_id_to_audiotag(),this.complete_template(),trigger.update({target:this.audiotag}))}build_chapters(a){let b=this;void 0!==a&&(b=document.CPU.find_container(a.target));let c=b.elements.chapters;c.innerHTML="";if(b.audiotag&&b.audiotag.textTracks&&0!==b.audiotag.textTracks.length){for(let d of b.audiotag.textTracks)if("chapters"===d.kind.toLowerCase()&&null!==d.cues){d.addEventListener("cuechange",
function(a){trigger.cuechange(a,c)});for(let e of d.cues){a=document.createElement("li");a.id=e.id;a.classList.add("cue");let d=convert.SecondsInTime(e.startTime),f=convert.SecondsInColonTime(e.startTime);a.innerHTML=`<a href="#${b.audiotag.id}&t=${d}" tabindex="0">\n                            <strong>${e.text}</strong>\n                            <span>${f}</span>\n                        </a>`;c.append(a)}}b.element.tagName===CpuAudioTagName&&document.CPU.is_audiotag_playing(b.audiotag)&&null!==
document.CPU.global_controller&&document.CPU.global_controller.build_chapters()}}build_playlist(){let a=this.elements.playlist;a.innerHTML="";var b=document.CPU.find_current_playlist();if(null!==b)for(let c of b){b=document.getElementById(c);let d=document.createElement("li");d.classList.add("cue");c===this.audiotag.id&&d.classList.add("active-cue");d.innerHTML=`<a href="#${b.id}&t=0" tabindex="0">\n                                <strong>${b.dataset.title}</strong>\n                            </a>`;
a.append(d)}}build_controller(){this.element.classList.add(this.classname);let a=this;querySelector_apply("[id]",function(b){a.elements[b.id]=b},this.element.shadowRoot);var b={pause:trigger.play,play:trigger.pause,time:trigger.throbble,actions:this.show_actions,back:this.show_main,poster:this.show_main,restart:trigger.restart,fastreward:trigger.fastreward,reward:trigger.reward,foward:trigger.foward,fastfoward:trigger.fastfoward};for(var c in b)this.elements[c].addEventListener("click",b[c]);this.element.addEventListener("keydown",
trigger.key);this.elements.control.addEventListener("keydown",trigger.keydownplay);b=this.elements.time;c={mouseover:!0,mousemove:!0,mouseout:!1,touchstart:!0,touchend:!1,touchcancel:!1};for(let a in c)b.addEventListener(a,c[a]?trigger.hover:trigger.out,{passive:!0});b.addEventListener("touchstart",trigger.touchstart,{passive:!0});b.addEventListener("touchend",trigger.touchcancel,{passive:!0});b.addEventListener("contextmenu",this.show_handheld_nav);this.elements.inputtime.addEventListener("input",
trigger.input_time_change);this.elements.inputtime.addEventListener("change",trigger.input_time_change);this.show_main();this.build_chapters()}};HTMLAudioElement.prototype.CPU_controller=function(){return this.closest(CpuAudioTagName)};HTMLAudioElement.prototype.CPU_update=function(){var a=this.CPU_controller();a&&(a=a.CPU)&&a.update&&a.update();document.CPU.global_controller&&document.CPU.global_controller.update()};class CpuControllerElement extends HTMLElement{constructor(){super();not_screen_context()?this.remove():this.tagName===CpuAudioTagName&&null===this.querySelector(acceptable_selector)?(console.warn(`Tag <${CpuAudioTagName}> without <audio controls>.\nSee https://github.com/dascritch/cpu-audio/blob/master/INSTALL.md for a correct installation.`),this.remove()):(template=thisDoc.querySelector("template#template_cpu"),shadow_element=this.attachShadow({mode:"open"}),shadow_element.innerHTML=template.innerHTML)}connectedCallback(){if(!not_screen_context()){this.CPU=
new CPU_element_api(this,this.shadowRoot.querySelector(selector_interface));this.CPU.audiotag||(document.CPU.global_controller=this.CPU,this.CPU.audiotag=window.document.querySelector("cpu-audio audio"));this.CPU.build_controller();querySelector_apply(".canonical",element_prevent_link_on_same_page,this.shadowRoot);this.CPU.attach_audiotag_to_controller(this.CPU.audiotag);var a=this.CPU.elements["interface"].classList,b=this.getAttribute("mode");a.add(`mode-${null!==b?b:"default"}`);b=this.getAttribute("hide");
if(null!==b){b=b.split(",");for(let c of b)c=c.toLowerCase(),-1<acceptable_hide_atttributes.indexOf(c)&&a.add(`hide-${c}`)}navigator.share&&(a.add("hasnativeshare"),this.CPU.elements.nativeshare.addEventListener("click",trigger.native_share))}}disconnectedCallback(){}};class CpuAudioElement extends CpuControllerElement{copy_attributes_to_media_dataset(){for(let a in document.CPU.default_dataset){let b=this.getAttribute(a);null!==b&&(this._audiotag.dataset[a.toLowerCase()]=b)}}connectedCallback(){this._audiotag=this.querySelector(acceptable_selector);null!==this._audiotag&&(this.copy_attributes_to_media_dataset(),super.connectedCallback(),document.CPU.connect_audiotag(this.CPU.audiotag),this.observer_cpuaudio=new MutationObserver(trigger.observer_cpuaudio),this.observer_cpuaudio.observe(this,
{childList:!0,attributes:!0}),this.observer_audio=new MutationObserver(trigger.observer_audio),this.observer_audio.observe(this,{childList:!0,attributes:!0,subtree:!0}))}};function launch(){window.addEventListener("hashchange",trigger.hashOrder,!1);trigger.hashOrder({at_start:!0});is_decent_browser_for_webcomponents()?(window.customElements.define(CpuAudioTagName.toLowerCase(),CpuAudioElement),window.customElements.define(CpuControllerTagName.toLowerCase(),CpuControllerElement),window.document.body.classList.add("cpu-audio-with-webcomponents")):(console.error(`<${CpuAudioTagName}> WebComponent may NOT behave correctly. Only timecode hash links are activated.\nSee https://github.com/dascritch/cpu-audio/blob/master/index.html for details`),
querySelector_apply(acceptable_selector,document.CPU.recall_audiotag),window.document.body.classList.add("cpu-audio-without-webcomponents"))}null!==window.document.body?launch():window.document.addEventListener("DOMContentLoaded",launch,!1);})();
