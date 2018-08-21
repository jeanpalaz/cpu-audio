How-to install
--------------

Simply put `<link rel="import" href="./cpu-audio.html" type="text/html">` in the head of your html page. (eventually include webcomponentjs for polyfill).

Insert this CSS snippet for browsers not able to use WebComponents :

```css
    audio[controls] {
        display : block;
        width : 100%;
    }
```

Then encapsulate `<audio control>` with `<cpu-audio>` to compose an specialy crafted UI. Some attributes enhance the component :

* `title="<string>"` : name of the audio 
* `poster="<url>"` : cover image, squarred ratio prefered
* `canonical="<url>"` : link to the original page of the sound
* `mode="<string>"` : kind of presentation (default, compact, button, hidden)
* `twitter="@<account>"` : twitter handle for social partage (fallback on the declared one in your page)

Example : 

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="cpu-audio.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<cpu-audio 
    title="Au carnaval avec Samba Résille (2003)"
    poster="https://dascritch.net/vrac/.blog2/entendu/.1404-SambaResille_m.jpg"
    canonical="https://dascritch.net/post/2014/04/08/Au-Carnaval-avec-Samba-R%C3%A9sille"
    twitter="@dascritch"
    >
    <audio controls id="audiodemo">
        <source src="https://dascritch.net/vrac/sonores/1404-SambaResille2003.mp3" type="audio/ogg">
        <source src="https://dascritch.net/vrac/sonores/podcast/1404-SambaResille2003.mp3" type="audio/mpeg">
    </audio>
</cpu-audio>
<p>
Jump at <a href="#audiodemo&amp;t=5m">5 minutes</a> in the sound
</p>

```


Cloned player : You can invoke a global media controller by creating a `<cpu-controller>` without `<audio>` tag.

Chapters : You can add a chapters track into the `<audio>`, : `<track kind="chapters" src="chapters.vtt" default>`. Note that `default` attribute **is really needed**.


Permitted hash notations
------------------------

Original purpose of [“timecodehash” is to link any media element of any webpage to a specific moment](https://github.com/dascritch/timecodehash). It uses the [W3C standard Media Fragments](https://www.w3.org/TR/media-frags/) notation, extending the URL. 

For the timecode, you can use :

* `page.html#tagID&t=7442` : seconds without unit ;
* `page.html#tagID&t=02:04:02` : colon (“professional”) timecode as `02:04:02` (2 hours, 4 minutes and 2 seconds) ;
* `page.html#tagID&t=2h4m2s` : human-readable units, sub-units availables : `s`econds, `m`inutes, `h`ours and `d`ays

Note : if a timecode without named anchor is given, as in `href="#&t=2h4m2s"`, the very first `<audio controls>` element of the document will be started and placed at this time.


Personnalizatios via CSS variables
----------------------------------

variable | description | default value 
--|--|--
`--cpu-background` | Interface's background, except playing or in error | #555
`--cpu-height` | Height of the buttons | 64px (32px under 640px width)
`--cpu-font-family` | Interface font families | Lato, "Open Sans", "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif
`--cpu-font-size` | Interface font size | 15px
`--cpu-color` | Interface's color, except playing | #ddd
`--cpu-playing-background` | Interface's background while playing | #444
`--cpu-playing-color` | Interface's color while playing | #fff
`--cpu-error-background` | Interface's background when there is a media error | #a00
`--cpu-error-color` | Interface's color when there is a media error | #ff7
`--cpu-popup-background` | Background for the time pointer | #aaa
`--cpu-popup-color` | Text color for the time pointer | #333
`--cpu-elapse-width` | Time indicator width | 185px (160px under 640px width, 80px under 480px, 0 under 320px)