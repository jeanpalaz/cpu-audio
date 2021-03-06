CPU-Audio WebComponent
======================

An audio WebComponent to provide an user-interface, timecoded links and some other features to an `<audio>` tag.

<!-- calling the webcomponent -->
<cpu-audio 
    title="Au carnaval avec Samba Résille (2003)"
    poster="https://dascritch.net/vrac/.blog2/entendu/.1404-SambaResille_m.jpg"
    canonical="https://dascritch.net/post/2014/04/08/Au-Carnaval-avec-Samba-R%C3%A9sille"
    twitter="@dascritch"
    >
    <audio controls id="sound">
        <source src="https://dascritch.net/vrac/sonores/podcast/1404-SambaResille2003.mp3" type="audio/mpeg">
    </audio>
    <!-- {% include no_component_message.html %} -->
</cpu-audio>

Some links :
* [Demonstration site](https://dascritch.github.io/cpu-audio/)
    * [Features](https://dascritch.github.io/cpu-audio/FEATURES)
    * [How to install](https://dascritch.github.io/cpu-audio/INSTALL)
    * [Live configuration](https://dascritch.github.io/cpu-audio/LIVE)
* [JS installable code](https://dascritch.github.io/cpu-audio/dist/cpu-audio.js) 
* [Code repository](https://github.com/dascritch/cpu-audio/), [Latest stable release](https://github.com/dascritch/cpu-audio/releases/latest)
* Informations (in french) : [Reconstruire son lecteur audio pour le web](https://dascritch.net/post/2018/11/06/Reconstruire-son-lecteur-audio-pour-le-web)
* Main author : [Xavier "dascritch" Mouton-Dubosc](http://dascritch.com)
* [How to participate to this project](https://github.com/dascritch/cpu-audio/blob/master/CONTRIBUTING.md)

Version : 5.3 [Licence GPL 3](LICENSE)


Purpose
-------

An hashtag observer for `<audio>` tags with fancy interface, hyperlinks and share buttons.

When you load a page :

1. if your URL has an hash with a timecode (`page#tagID&t=10m`), the service will play the named `<audio controls>` at this timecode (here, `#TagID` at 10 minutes) ;
2. else, if a `<audio controls>` with a url `<source>` was played in your website, and was unexpectedly exited, the service will play the `<audio controls>` at the same timecode.

During the page life :

* if an `<audio controls>` anchor <a href="#sound&t=10m">is linked with a timecode, as `<a href="#sound&t=10m">`</a>, the service will play this tag at this timecode ;
* no cacophony : when a `<audio controls>` starts, it will stop any other `<audio controls>` in the page ;
* if you have a `<cpu-controller>` in your page, it will clone the playing `<cpu-audio>` interface.

<a href="#sound&t=20m45s">This link starts the upper player at 20:45</a>


Features
---------

[TL;DR ? See it in action](FEATURES)

* hyperlink `<audio>` tags to a specific time, [Media Fragment standards](https://www.w3.org/TR/media-frags/) ;
* standards first, future-proof ;
* only one single file to deploy ;
* pure vanilla, no dependencies to any framework ;
* progressive enhancement, can works even without proper WebComponent support ;
* add an UI, customizable via attributes and CSS variables ;
* responsive liquid design ;
* recall the player where it was unexpectedly left (click on a link when playing) ;
* play only one sound in the page ;
* playlist with auto-advance ;
* play only a range between 2 timestamps ;
* chapters ;
* global `<cpu-controller>` .

It could have been done via polyfills or frameworks, but I wanted a plain standard, vanilla javascript, easy to install and configure.

WebComponents will work mainly on : 

* Google Chrome
* Firefox (63 +)
* Safari Mac
* Safari iOS

WebComponent standard won't be implemented, the hash links will work but without the interface :

* Edge


Keyboard functions
------------------

When the interface got the focus, you can use those keys :

* <kbd>Space</kbd> : play/pause audio
* <kbd>Enter</kbd> : play/pause audio (only on play/pause button)
* <kbd>←</kbd> : -5 seconds
* <kbd>→</kbd> : +5 seconds
* <kbd>↖</kbd> : back to start
* <kbd>End</kbd> : to the end, finish playing, ev. skip to the sound in playlist
* <kbd>Escape</kbd> : back to start, stop playing

For handheld users, a long press on the timeline will show you a bench of buttons for a more precise navigation.


HOW TO install
--------------

* [How install, deploy and customize on your server](INSTALL)
* [You can try playing with our live configurator tool, event it isn't perfect yet.](LIVE)
* [Known problems and misconfigurations](TROUBLESHOOTING)


Participate
-----------

* [Contribute in any way](https://github.com/dascritch/cpu-audio/blob/master/CONTRIBUTING.md)
* [Tests](tests-minimal.html)
* [Bugs, issues, tickets and features](https://github.com/dascritch/cpu-audio/issues)
* [What to do, next](https://github.com/dascritch/cpu-audio/blob/master/TODO.md)


Versions
--------

* April 2018 : 5 , [forking to cpu-audio, WebComponent version](https://github.com/dascritch/ondemiroir-audio-tag/issues/7#issuecomment-382043789)
* August 2017 : 4 , i18n, modularization, clone
* August 2015 : 3 , forking to ondemiroir-audio-tag, for launching [CPU radio show](http://cpu.pm)
* October 2014 : Final version of timecodehash
* September 2014 : 2 , correcting to standard separator
* September 2014 : 1 , public announcing
* July 2014 : 1.a , public release
* June 2014 : 0.2 , proof of concept
* October 2012 : first version, trashed


Credits
-------

Thank you to my lovely friends :
* [Thomas Parisot](https://oncletom.io/) for suggestions
* [Loïc Gerbaud](https://github.com/chibani) for corrections
* [Guillaume Lemoine and Phonitive](http://www.phonitive.fr/) for helping
* [Benoît Salles](https://twitter.com/infestedgrunt) for testing
- [@mariejulien](https://twitter.com/mariejulien/status/1047827583126183937) about [CONTRIBUTING.md](https://github.com/dascritch/cpu-audio/blob/master/CONTRIBUTING.md)

Really sorry, [NerOcrO](https://github.com/NerOcrO)


Keeping in touch
----------------

* professional <http://dascritch.com>
* blog <http://dascritch.net>
* twitter : [@dascritch](https://twitter.com/dascritch)

<!-- {% include footer.html %} -->
