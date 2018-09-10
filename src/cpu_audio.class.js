
// Controller with assigned audio element
class CpuAudioElement extends CpuControllerElement {

    connectedCallback() {

        this._audiotag = this.querySelector(acceptable_selector);
        if (this._audiotag === null) {
            return;
        }

        // copying personalized data to audio tag
        for (let key in CPU_Audio.default_dataset) {
            let value = this.getAttribute(key);
            if (value !== null) {
                this._audiotag.dataset[key.toLowerCase()] = value;
            }
        }

        super.connectedCallback();

        CPU_Audio.connect_audiotag(this.CPU.audiotag);
    
        this.observer_cpuaudio = new MutationObserver(trigger.observer_cpuaudio);
        this.observer_cpuaudio.observe(this, {
            childList: true,
            attributes : true
        });

        this.observer_audio = new MutationObserver(trigger.observer_audio);
        this.observer_audio.observe(this, {
            childList: true,
            attributes : true,
            subtree : true
        });

        // this.observer.disconnect();

    }

}