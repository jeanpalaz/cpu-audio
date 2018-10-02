
function launch() {

    window.addEventListener('hashchange', trigger.hashOrder, false);
    trigger.hashOrder({ at_start : true });

    if (!is_decent_browser_for_webcomponents()) {
        console.error(`<${CpuAudioTagName}> WebComponent may NOT behave correctly. Only timecode hash links are activated.\nSee https://github.com/dascritch/cpu-audio/blob/master/index.html for details`);
        querySelector_apply(acceptable_selector, document.CPU.recall_audiotag);
        window.document.body.classList.add('cpu-audio-without-webcomponents');
    } else {
        window.customElements.define(CpuAudioTagName.toLowerCase(), CpuAudioElement);
        window.customElements.define(CpuControllerTagName.toLowerCase(), CpuControllerElement); 
        window.document.body.classList.add('cpu-audio-with-webcomponents');
    }
}

if (window.document.body !== null) {
    launch();
} else {
    // needed in cpu-audio.js context
    window.document.addEventListener('DOMContentLoaded', launch, false);
}

