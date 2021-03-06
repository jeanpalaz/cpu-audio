If you are not a developer
--------------------------

- My english is a pity. You may help me to correct it.
- You may test on some platforms. Mainly MacOS, iOS and Edge; and see some problems when comparing to Firefox or Chrome.
- You can re-read my doc, and ask me some precisions.
- You may be have a disability and you're using some accessibility tools… You're super useful ! I surely missed something important for you.
- Perhaps you can help me on the design or the logos.
- Install in your own website, test, note the bugs, [report them in the issues section of the repo](https://github.com/dascritch/cpu-audio/issues). If you're not enough GitHub savvy, you can [write me via this page](https://cpu.dascritch.net/pages/CPU-Audio-Player)


If you are a developer
----------------------

Check first in [TODO.md](TODO.md) which lists some priorities and objectives.

I usually [create bugs](https://github.com/dascritch/cpu-audio/issues) and refers to them in my commits. Most of the time.

I'm sorry but due to draft rewrites and refactoring, I've lost most of the git history. Git blaming won't help for the code before September 2018.


Tests
-----

As I'm not perfect, some tests were written for non-regressions, conformity and check feature support by browsers. Please contribute also in tests, we really need a rock solid players with a few regressions as possible.

 * [Browser compliance, feature detections and implementation tests](./tests-browser.html)
 * [Minimum services available even without webcomponent part, as hash links](./tests-minimal.html)
 * [Graphic interface and webcomponents-dependant features](./tests-interface.html)


Hygiene
-------

- Always prefer any W3C standards instead of create something.
- Think about clean code, small parts, expressive variables and functions
- Try to write a test, even for the UI. I know, the last part is hard, but it helps so much
- Categorize the tests
- Document everything, even dead-ends. Someone can find interestings your regrets.


Development
-----------

To make the `dist/` files, use `./make.sh`

You will need :
- sed
- tr
- [Google closure compiler](https://github.com/google/closure-compiler/wiki/Binary-Downloads) (an so, Java, sigh). Don't forget to keep it up to date.

<!-- {% include footer.html %} -->
