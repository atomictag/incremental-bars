incremental-bars
=============

incremental-bars provides [incremental-dom](https://github.com/google/incremental-dom) backend backend support to [handlebars](http://www.handlebarsjs.com) templates.

- compile ANY standard Handlebars template to output DOM instead of strings
- patch only the DOM parts that changed upon each render
- support all features native to Handlebars
- integrate easily with existing / legacy code

Rationale
----------

Handlebars templates are awesome and used in countless applications everywhere - but they generate strings, not DOM, and that makes re-rendering fragments fairly expensive and not suitable for in-place DOM patching (popularized by [React](https://facebook.github.io/react/), [Virtual Dom](https://github.com/Matt-Esch/virtual-dom), [incremental-dom](https://github.com/google/incremental-dom), etc.).

There are ways to make Handlebars build DOM rather than strings ([HtmlBars](https://github.com/tildeio/htmlbars) is the first that comes to mind). However it is rather hard to find something that:

- supports all cool features native to Handlebars (partials, custom block helpers, decorators etc.)
- it's framework-agnostic and therefore easy to integrate with existing plumbing
- allows reuse of templates that have already been written and deployed
- does not attempt to rewrite the whole Handlebars

The idea is not to make Handlebars understand DOM - which is a complex task and ends up re-writing most of the Handlebars library or making it hard to maintain / upgrade - but rather to let Handlebars do what it does best and simply change the input fed into it and adjust a little its output. The fact Handlebars is entirely html-agnostic (it does not make any assumption of how the input looks like so it has not clue about tags, attributes etc.) is just perfect to achieve this.

This package is essentially composed of 3 main parts:

- A moustache-aware HTML parser/converter that creates an intermediate representation of the input as a linear sequence of "instructions" for each HTML tag. This intermediate representation is backend-agnostic (incremental-dom, virtual-dom, etc.).
- An emitter/transpiler that understands the intermediate representation and is capable of generating instructions for the target backend (incremental-dom, virtual-dom, etc.) from the input sequence in a string format compatible with the way Handlebars tokenizes its input.
- A custom Handlebars JavascriptCompiler extension that generates outputs that can be executed at runtime

[incremental-dom](https://github.com/google/incremental-dom) was chosen because it's a beautiful, fast and dead-simple library which has already a notion of "sequence of instructions" which map really well with the above approach (to the extent that the "intermediate representation" is just a little bit more than a list of idom-like meta-instructions).

> The main purpose of this library is to be used as a build-time tool to generate optimized precompiled templates.
> Although it is perfectly possible to package it to run in a browser, and therefore use it as a runtime compiler,
> expect some inevitable size and performance overhead due to the additional internalization steps required to parse
> and process the HTML input.

Installing
----------

    npm install incremental-bars

Usage
-----

Compiling / precompiling templates using incremental-bars is syntactically identical to their standard Handlebars equivalents.
Only 2 things are necessary:

1. you must `require('incremental-bars')` instead of `require('handlebars')`
2. you must add a `transpilerOptions` hash (described below) to the options passed to `Handlebars.compile` and `Handlebars.precompile`

    var Handlebars = require('incremental-bars');
    var html = '<div>hello: {{ world}} [{{ @backend }}] {{ type }}</world>';
    var templateFn = Handlebars.compile(html, { transpilerOptions : { backend : 'idom' }});
    ...

    // ... if precompiled...
    var templateData = Handlebars.precompile(html, { transpilerOptions : { backend : 'idom' }});

    // NOTE: if no transpilerOptions are passed to compile / precompile, Handlebars behaves as normal (HTML strings are produced):

#### transpilerOptions

Global options, common to all backends:

    backend : [ 'idom' ] (default: undefined) : The transpilation target. Currently only incremental-dom (idom)
    debug   : boolean (default: false) : Enable some extra logging
    skipBlockAttributeMarker : string (default: 'data-partial-id') : name of the attribute that marks an element as parent of a `skip` subtree

incremental-dom backend options:

    hoistedStatics           : object (default undefined) : an object that hoists the statics used in the template. Useful for precompiled templates (see "Precompiling templates")
    generateKeysForStaticEl  : boolean (default false) : Whether keys should be auto-generated for elements with only static properties
    generateKeysForAllEl     : boolean (default true) : Whether keys should be auto-generated for ALL elements. Takes precedence over generateKeysForStaticEl


Precompiling Templates
----------------------

Similarly to its `compile` equivalent, this is essentially the same as calling `Handlebars.precompile` with an extra options hash.

    var Handlebars = require('incremental-bars');
    var html = '<div>hello: {{ world}} [{{ @backend }}] {{ type }}</world>';
    var templateData = Handlebars.precompile(html, { transpilerOptions : { backend : 'idom' }});

A particular interesting option is `hoistedStatics` .... TODO

Compatibility
-------------

Pretty much everything you can do with Handlebars (as of this time of writing at version 4.0.10) you can do with incremental-bars. This includes partials, default and custom block helpers, decorators etc. The core of this library has been tested in production in various projects - including a full productive mobile banking application - without issues.

#### Block helpers returning HTML strings

Bear in mind that helpers returning html strings will no longer work and might actually cause a runtime error depending on where they are used within the html template. This is not a bug, but rather an expected result of the fact helpers are now executed in between incremental dom instructions. I actually never really use helpers to output HTML (which seems an anti-pattern to me), but in case you do, don't despair. You can write backend-independent helpers by emplyoying the following runtime check:

    Handlebars.registerHelper('myHelper', function() {
        var options = arguments[arguments.length - 1];  // Last argument is 'options'
        var backend = options.data && options.data.backend; // 'backend' is set by the incremental-bars runtime
        if(backend === 'idom') { /* incremental-dom version ... */ }
        else { /* default html-string version ... */ }
    });

Because the backend identifier is stored in the `data` object, it is accessibile from within templates as `{{ @backend }}`.

#### Conditional rendering

[Conditional rendering and iterations](http://google.github.io/incremental-dom/#conditional-rendering/array-of-items) pose a challenge to DOM patchers as it is necessary to instruct them on what elements can be recycled and which need to be created from scratch. For example, a simple list like `{ items : [1, 2, 3, 4, 5] }` and the following template:

    {{#each items}}
        <div>{{ this }}</div>
    {{/each}}

will only output `<div>5</div>` as elements are recycled on every cycle. To generate one  `div` per item it is necessary to instruct incremental-dom that each item needs a different element, which requires a unique `key` to be set upon each iteration. This library makes this simple via the `key` attribute, i.e.:

    {{#each items}}
        <div key="{{ @index }}">{{ this }}</div> <!-- note the 'key' attribute! -->
    {{/each}}

correctly generates:

    <div key="0">1</div>
    <div key="1">2</div>
    <div key="2">3</div>
    <div key="3">4</div>
    <div key="4">5</div>

#### Direct DOM manipulation (aja jQuery)

One cool feature about this library, and one that comes literally for free thanks to incremental-dom, is the ability to use JQuery & co. in conjunction with the DOM patching, something that is a big no-no for other virtual-dom implementations. Just be aware that DOM manipulations done by JQuery are not necessarily reset after the template is re-rendered because the elements are not thrashed until really needed (unlike traditional Handlebars which destroys the current DOM sub-tree and builds a new one from scratch upon each render).

#### Nested DOM subtrees

Speaking of JQuery and, in general, frameworks that allow nesting of dynamic elements or independent "views" with their own template / rendering routine (a typical case for example with $el.append(...) or Backbone extensions like [Backbone.Layout](https://github.com/tbranyen/backbone.layoutmanager)), the typical requirement is to keep "alien" DOM elements within a generated subtree when it is re-rendered. However, the default behaviour of incremental-dom would be to get rid of each foreign subtree when a node is patched. This library provides a convention to inform the code generator that a subtree should be left where it is and skipped. The way to do that is with the (configurable) attribute `data-partial-id`, e.g.

    <!-- template "parent" -->
    <div data-partial-id="child"></div>
    ...

Any elements that are appended within `child` are preserved when `parent`is re-rendered, which is a very handy way to nest things together in a sort of "component" fashion. Partials are of course not affected by this as they are natively supported by incremental-bars in the same way they are on standard Handlebars.

### Known Issues

1. Don't do this ugliness (conditionally open tags not always matched by a closing tag):

       {{#if something}}
         <div class="something">
       {{else}}
         <div class="else">
       {{/if}}
         BLAH BLAH BLAH
       </div>

    but do this (or similar) instead:

        <div class="{{#if something}}something{{else}}else{{/if}}">
         BLAH BLAH BLAH
        </div>

2. Moustached attributes like:

        <div {{ attribute }}>
          BLAH BLAH BLAH
        </div>

    must return an attribute NAME, i.e. any string (or any falsy value), therefore values like:

        attribute = 'class="something" style="width:10px"';

    will fail because that is not a valid attribute name.
    It is however totally possible to create an ad-hoc 'attribute' helper that does that directly on the DOM element.
    This is again something I never do as in my opionion returning html artifacts from templates smells of anti-pattern.


Found other problems? Have a request?

File an [issue](https://github.com/atomictag/incremental-bars/issues) and I'll have a look at it.

### Extensions and future work

- Do not run any code related to the static parts on re-render, as outlined [here](https://github.com/tildeio/htmlbars/issues/405#issuecomment-132413502)

- Intelligently re-render only the dynamic parts of the template that are affected by an actual change in the data passed to the template (i.e. execute only the instructions that are strictly needed to resync the output with a change of state)

Most of the above has already been developed and used in a custom variant of this library, but that's not so dependency-free as the parts published here, so it would require investing time that I don't really have to generalize the inner workings.


### License

incremental-bars is released under the MIT license.

About
-----

made with :smiling_imp: by oneoverzero GmbH (OOZ)

[![oneoverzero GmbH](http://oneoverzero.net/assets/img/logo.png)](http://oneoverzero.net)


