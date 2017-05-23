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

Pretty much everything you can do with Handlebars (as of this time of writing at version 4.0.10) you can do with incremental-bars. This includes partials, default and custom block helpers, decorators etc. The core of this library has been tested in production in various projects - including a full productive mobile banking application - without issues.

Bear in mind that helpers returning html strings will no longer work and might actually cause a runtime error depending on where they are used within the html template. This is not a bug, but rather an expected result of the fact helpers are now executed in between incremental dom instructions. I actually never really use helpers to output HTML (which seems an anti-pattern to me), but in case you do, don't despair. You can write backend-independent helpers by emplyoying the following runtime check:
    
    Handlebars.registerHelper('myHelper', function() {
        var options = arguments[arguments.length - 1];  // Last argument is 'options'
        var backend = block.data && block.data.backend; // 'backend' is set by the incremental-bars runtime
        if(backend === 'idom') { /* incremental-dom version ... */ }
        else { /* default html-string version ... */ }
    });

Also, [conditional rendering and iterations](http://google.github.io/incremental-dom/#conditional-rendering/array-of-items) pose a challenge to DOM patchers as it is necessary to instruct them on what elements can be recycled and which need to be created from scratch. For example, a simple list like `{ items : [1, 2, 3, 4, 5] }` and the following template:

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

One cool feature about this library, and one that comes literally for free thanks to incremental-dom, is the ability to use JQuery & co. in conjunction with the DOM patching, something that is a big no-no for other virtual-dom implementations. Just be aware that DOM manipulations done by JQuery are not necessarily reset after the template is re-rendered because the elements are not thrashed until really needed (unlike traditional Handlebars which destroys the current DOM sub-tree and builds a new one from scratch upon each render).

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

The version of this library that [we](http://oneoverzero.net) use in production supports a number of additional functionality that are a bit hard to explain and even harder to publish in open source without investing time that we don't really have. In random order:

- Extension of the incremental-dom API to get a handle of the 'current' element from within a helper (which is not so easy to get hold of from a template). Useful for a huge number of things.

- Based on the above instrumentation, various helpers to animate elements, especially a really cool helper to recycle and re-order the elements of lists where the items change position

- Atomic changes. Say you have a huge template and a button the state of which can change from enabled/disabled depending on some value that can change. Of course the whole template can be re-rendered and, by design, incremental-dom only apply changes to the parts of the DOM that need to change. Still it's a waste to execute the whole list of instructions and helpers just to add/remove an attribute in a very specific place. To address this we have introduced state-awareness in the templates so that something like the following:

      /* ... huge html here ... */
      
      <button {{#unless @state.canSubmit}}disabled{{/unless}}>...</button>
      
      /* ... more html here ... */
      
      <footer class="{{#if @state.canSubmit}}hide{{/if}}>...</footer>

      /* ... more html here ... */
      
 Now, when the "state" of the view hosting the template changes and "canSubmit" becomes true, ONLY the instructions that are needed to re-render the button and the footer are executed and the corresponding elements updated. All automatic, nothing to worry or care about. Support for this is already built-in in this library, but the runtime part has not been published and it would be fairly complicated to. Just be aware this is something that can be done in a smart way supporting nested properties, multiple concurrent state changes etc. - always minimizing the number of "blocks" that need to be re-patched. Pretty cool when you see it in action.

### License

incremental-bars is released under the MIT license.

About
-----

incremental-dom is developed by oneoverzero GmbH (OOZ)

[![oneoverzero GmbH](http://oneoverzero.net/assets/img/logo.png)](http://oneoverzero.net)


