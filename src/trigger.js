const trigger = {

    _timecode_start : false,
    _timecode_end : false,

    hashOrder : function(hashcode, callback_fx){
        let at_start = true;
        if (typeof hashcode !== 'string') {
            at_start = 'at_start' in hashcode;
            hashcode = location.hash.substr(1);
        }
        let hash = '';
        let timecode = '';
        let segments = hashcode.split('&');
        let autoplay = false;

        for (let _id in segments) {
            let parameter = segments[_id];
            if ((parameter.indexOf('=') === -1) && (hash === '')) {
                // should reference to the ID of the element
                hash = parameter;
            } else {
                // should be a key=value parameter
                let atoms = parameter.split('=');
                let p_key = atoms[0];
                let p_value = atoms[1];
                switch (p_key) {
                    case 't':
                        // is a time index
                        p_value = (p_value !== '') ? p_value : '0';
                        timecode = p_value;
                        // we make autoplay at requested timecode, simplier of the user
                        autoplay = true;
                        break;
                    case 'autoplay':
                        // is a card from a social network, run now
                        autoplay =  p_value === '1';
                        break;
                    case 'auto_play':
                        // is a card from a social network, run now
                        autoplay = p_value === 'true';
                        break;
                }
            }
        }

        if ((timecode === '') || ((at_start) && (!autoplay))) {
            // this is a normal anchor call. Go back to normal behaviour
            onDebug(callback_fx);
            return false;
        }

        // we may have a begin,end notation
        let times = timecode.split(',');
        let timecode_start = times[0];
        trigger._timecode_start = convert.TimeInSeconds(timecode_start);
        trigger._timecode_end = times.length > 1 ? convert.TimeInSeconds(times[1]) : false;
        if (trigger._timecode_end !== false) {
            trigger._timecode_end = (trigger._timecode_end > trigger._timecode_start) ?
                trigger._timecode_end :
                false;
        }

        CPU_Audio.jumpIdAt(hash, timecode_start, callback_fx);
        // scroll to the audio element. Should be reworked, or parametrable
        // window.location.hash = `#${hash}`;
        return true;
    },
    hover : function(event) {
        let container = CPU_Audio.find_container(event.target);

        let target_rect = event.target.getClientRects()[0];
        let relLeft = target_rect.left;
        let ratio = event.offsetX / event.target.clientWidth;
        let seeked_time = ratio * container.audiotag.duration;

        container.show_throbber_at(seeked_time);
    },
    out : function(event) {
        let container = CPU_Audio.find_container(event.target);
        container.hide_throbber();
    },

    throbble : function(event) {
        let at = 0;
        let container = CPU_Audio.find_container(event.target);
        let audiotag = container.audiotag;
        if (event.at !== undefined) {
            at = event.at;
        } else {
            // normal usage
            let ratio = event.offsetX  / event.target.clientWidth;
            at = ratio * audiotag.duration;
        }
        CPU_Audio.seekElementAt(audiotag, at);
        trigger.play(event);
    },
    pause : function(event, audiotag) {
        if (audiotag === undefined) {
            let target = event.target;
            audiotag = (target.tagName === 'AUDIO') ? target : CPU_Audio.find_container(target).audiotag;
        }
        audiotag.pause();
        CPU_Audio.current_audiotag_playing = null;
        window.localStorage.removeItem(audiotag.currentSrc);
    },
    play_once : function(event) {
        let audiotag = event.target;
      
        if ( (CPU_Audio.only_play_one_audiotag) && (CPU_Audio.current_audiotag_playing) && (!CPU_Audio.is_audiotag_playing(audiotag)) ) {
            trigger.pause(undefined, CPU_Audio.current_audiotag_playing);
        }
        CPU_Audio.current_audiotag_playing = audiotag;
    },
    play : function(event, audiotag) {
        if (audiotag === undefined) {
            audiotag = CPU_Audio.find_container(event.target).audiotag;
        }
        if (CPU_Audio.global_controller) {
            CPU_Audio.global_controller.attach_audiotag_to_controller(audiotag);
            CPU_Audio.global_controller.audiotag = audiotag;
            CPU_Audio.global_controller.show_main();
            CPU_Audio.global_controller.build_chapters();
            CPU_Audio.global_controller.build_playlist();
        }
        audiotag.play();
    },
    key : function(event) {
        let container = CPU_Audio.find_container(event.target);

        function seek_relative(seconds) {
            event.at = container.audiotag.currentTime + seconds;
            container.show_throbber_at(event.at);
            trigger.throbble(event);
            container.hide_throbber_later();
        }

        switch (event.keyCode) {
            // can't use enter : standard usage
            case 27 : // esc
                CPU_Audio.seekElementAt(container.audiotag, 0);
                trigger.pause(undefined,container.audiotag);
                break;
            case 32 : // space
                container.audiotag.paused ?
                    trigger.play(undefined,container.audiotag) :
                    trigger.pause(undefined,container.audiotag);
                break;
            case 35 : // end
                CPU_Audio.seekElementAt(container.audiotag, container.audiotag.duration);
                break;
            case 36 : // home
                CPU_Audio.seekElementAt(container.audiotag, 0);
                break;
            case 37 : // ←
                seek_relative(- CPU_Audio.keymove);
                break;
            case 39 : // →
                seek_relative(+ CPU_Audio.keymove);
                break;
            default:
                return ;
        }
        event.preventDefault();
    },
    keydownplay : function(event) {
        if (event.keyCode !== 13 ) {
            return;
        } 
        let container = CPU_Audio.find_container(event.target);

        container.audiotag.paused ?
            trigger.play(undefined,container.audiotag) :
            trigger.pause(undefined,container.audiotag);
        
        event.preventDefault();
    },

    cuechange : function(event, chapters_element) {
        // when the position in a media element goes out of the current
        if (chapters_element === undefined) {
            return;
        }
        let classname = 'active-cue';
        let previous = chapters_element.querySelector(`.${classname}`);
        if (previous !== null) {
            previous.classList.remove(classname);
        }
        if (event.target.activeCues.length === 0) {
            // too early, we need to keep this case from Chrome
            return;
        }

        let cue_id = event.target.activeCues[0].id;
        chapters_element.querySelector(`#${cue_id}`).classList.add(classname);
    },

    update : function(event) {
        let audiotag = event.target;

        if ((trigger._timecode_end !== false) && (audiotag.currentTime > trigger._timecode_end)) {
            trigger.pause(undefined, audiotag);
        }

        audiotag.CPU_update();
        if (!audiotag.paused) {
            window.localStorage.setItem(audiotag.currentSrc, String(audiotag.currentTime));
        }
    },
    ended : function(event, audiotag) {
        // the media element reached its end 
        if (audiotag === undefined) {
            audiotag = event.target;
        }
        if (!('playlist' in audiotag.dataset)) {
            return;
        }
        // and is in a declarated playlist
        let playlist_name = audiotag.dataset.playlist;
        let playlist = document.CPU.playlists[playlist_name];
        if (playlist === undefined) {
            console.warn(`Named playlist ${playlist_name} not created. WTF ?`);
            return;
        }
        let playlist_index = playlist.indexOf(audiotag.id);
        if (playlist_index === -1) {
            console.warn(`Audiotag ${audiotag.id} not in playlist ${playlist_name}. WTF ?`);
            return;
        }
        if ((playlist_index +1) === playlist.length) {
            // end of playlist
            return;
        }
        let next_id = playlist[playlist_index+1];
        let next_audiotag = document.getElementById(next_id);
        if (next_audiotag === null) {
            console.warn(`Audiotag #${next_id} doesn't exists. WTF ?`);
            return;
        }
        // Play the next media in playlist, starting at zero
        CPU_Audio.seekElementAt(next_audiotag, 0);
        trigger.play(undefined, next_audiotag);
    },
    observer_cpuaudio : function(mutationsList) {
        let container = document.CPU.find_container(mutationsList[0].target);

        let audio_element = container.element.querySelector('audio')
        if (audio_element === null) {
            console.info('<audio> element was removed.')
            container.element.remove();
            return;
        }
        container.element.copy_attributes_to_media_dataset();
    },
    observer_audio : function(mutationsList) {
        let container = document.CPU.find_container(mutationsList[0].target);

        // in case <track> changed/removed
        container.build_chapters();

        // in case attributes changed
        container.complete_template();

        let global_controller = CPU_Audio.global_controller;
        if ((global_controller) && (container.audiotag.isEqualNode(global_controller.audiotag))) {
            global_controller.build_chapters();
            global_controller.complete_template();
        }
    }

}