const convert = {
    _units : {
        'd' : 86400,
        'h' : 3600,
        'm' : 60,
        's' : 1
    },

    TimeInSeconds : function(givenTime) {
        let seconds = 0;
        if (/^\d+$/.test(givenTime)) {
            seconds = Number(givenTime);
        } else {
            seconds = (givenTime.indexOf(':') === -1) ? this.SubunitTimeInSeconds(givenTime) : this.ColonTimeInSeconds(givenTime) ;
        }
        return seconds;
    },
    SubunitTimeInSeconds : function(givenTime) {
        let seconds = 0;
        for(let key in convert._units) {
            if ( (convert._units.hasOwnProperty(key)) && (givenTime.indexOf(key) !== -1) ) {
                let atoms = givenTime.split(key);
                seconds += Number(atoms[0].replace(/\D*/g,'' )) * convert._units[key];
                givenTime = atoms[1];
            }
        }
        return seconds;
    },
    ColonTimeInSeconds : function(givenTime) {
        let seconds = 0;
        let atoms = givenTime.split(':');
        let convert = [1, 60, 3600, 86400];
        for (let pos = 0 ; pos < atoms.length ; pos++) {
            seconds += Number(atoms[pos]) * convert[((atoms.length-1) - pos)];
        }
        return seconds;
    },
    SecondsInTime : function(givenSeconds) {
        let converted = '';
        let inned = false;
        for(let key in convert._units) {
            if (convert._units.hasOwnProperty(key)) {
                let multiply = convert._units[key];
                if ((givenSeconds >= multiply) || (inned)) {
                    inned = true;
                    let digits = Math.floor(givenSeconds / multiply);
                    converted += digits + key;
                    givenSeconds -= digits * multiply;
                }
            }
        }
        return converted === '' ? '0s' : converted;
    },
    SecondsInColonTime : function(givenSeconds) {
        let converted = '';
        let inned = false;
        for(let key in convert._units) {
            if (convert._units.hasOwnProperty(key)) {
                let multiply = convert._units[key];
                if ((givenSeconds >= multiply) || (inned)) {
                    inned = true;
                    let digits = Math.floor(givenSeconds / multiply);
                    converted += (converted === '' ? '' : ':');
                    converted += ( ((digits<10) && (converted !== '')) ? '0' : '') + digits ;
                    givenSeconds -= digits * multiply;
                }
            }
        }
        if (converted.length === 1) {
            return '0:0' + converted;
        }
        if (converted.length === 2) {
            return '0:' + converted;
        } 
        
        return converted === '' ? '0:00' : converted;
    },
}