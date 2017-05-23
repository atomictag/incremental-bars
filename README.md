incremental-bars
=============

incremental-bars provides [incremental-dom](https://github.com/google/incremental-dom) backend backend support to [handlebars](http://www.handlebarsjs.com) templates.

- compile ANY standard Handlebars template to output DOM instead of strings
- patch only the DOM parts that changed upon each render

Rationale
----------

Handlebars templates are awesome and used in countless applications everywhere - but they generate strings, not DOM, and that makes re-rendering fragments fairly expensive and not suitable for in-place DOM patching (like [Virtual Dom](https://github.com/Matt-Esch/virtual-dom), [incremental-dom](https://github.com/google/incremental-dom), React etc.).

There are ways to make Handlebars build DOM rather than strings (e.g. [HtmlBars](https://github.com/tildeio/htmlbars)) but none of the existing approaches seem to be self-contained, backward compatible, fully-featured and simple enough to be easy to integrate with any framework plumbings, while keeping existing templates unchanged. Changing output target appears to be a very complex endevour indeed given the inherent complexity of the Handlebars parser and compiler to support all kind of cool features like helpers, custom block helpers, partials, decorators etc. It turns out it does not have to be all that complex. 

The fact Handlebars is entirely html-agnostic (it does not make any assumption of how the input looks like so it has not clue about tags, attributes etc.) is indeed an advantage. That is, when a string input is fed into Handlebars, the (pre-)compiler splits the input into static strings tokens and moustache handlers and then joins them all together into a "program" which eventually generates a new string when executed. 

The idea is not to make Handlebars understand DOM - which is painful - but parse DOM into a tokenizable set of instructions that can be fed to Handlebars for (pre-)compilation, "executed" during the runtime step when the template is used.

This package is essentially composed of 3 main parts:
- A moustache-aware HTML parser that creates an intermediate representation of the input as a linear sequence of "instructions" for each HTML tag. This intermediate representation is backend-agnostic (incremental-dom, virtual-dom, etc.). 
- An emitter that understands the intermediate representation and is capable of generating instructions for the target backend (incremental-dom, virtual-dom, etc.) from the input sequence. Currently only incremental-dom is supported.
- A Handlebars JavascriptCompiler extension that generates a list of functions to execute at runtime instead if a plain string 

I chose to use [incremental-dom](https://github.com/google/incremental-dom) because it's a beautiful, fast and dead-simple library which has already a notion of "sequence of instructions" which map really well with the above approach (to the extent that the "intermediate representation" is just a little bit more than a list of idom-like meta-instructions).

Installing
----------

    npm install incremental-bars

Usage
-----

TODO

Precompiling Templates
----------------------

TODO

Compatibility
-------------

TODO

### Known Issues

TODO

About
-----

[![oneoverzero GmbH](http://oneoverzero.net/assets/img/logo.png)](http://oneoverzero.net)

### License

incremental-bars is released under the MIT license.

