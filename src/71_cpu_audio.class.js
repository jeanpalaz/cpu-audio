
// Controller with assigned audio element
class CpuAudioElement extends CpuControllerElement {

    copy_attributes_to_media_dataset() {
        // copying personalized data to audio tag
        for (let key in document.CPU.default_dataset) {
            let value = this.getAttribute(key);
            if (value !== null) {
                this._audiotag.dataset[key.toLowerCase()] = value;
            }
        }        
    }

    connectedCallback() {

        this._audiotag = this.querySelector(acceptable_selector);
        if (this._audiotag === null) {
            return;
        }

        this.copy_attributes_to_media_dataset();

        super.connectedCallback();

        document.CPU.connect_audiotag(this.CPU.audiotag);
    
        this.observer_cpuaudio = new MutationObserver(trigger.observer_cpuaudio);
        this.observer_cpuaudio.observe(this, {
            'childList': true,
            'attributes' : true
        });

        this.observer_audio = new MutationObserver(trigger.observer_audio);
        this.observer_audio.observe(this, {
            'childList': true,
            'attributes' : true,
            'subtree' : true
        });

        // this.observer.disconnect();

    }

}