(function(Hbs) {

    // Precompiled templates are collected in Handlebars.template
    Hbs.templates = Hbs.templates || {};

    // Handlebars.template override. Required so the backend type becomes
    // available to templates and helpers as html and options.data.backend

    var original_template = Hbs.template;
    Hbs.template = function template_instrumented(spec) {
        var templateFn     = original_template(spec);
        if(templateFn) {
            var fn = templateFn, backend = spec.compiler[2] || "html";
            templateFn = function(context, options) {
                options              = options || {};
                options.data         = options.data || {};
                options.data.backend = backend;
                return fn(context, options);
            };
            // Backend also available as a property of the template function
            templateFn.backend = backend;
        }
        return templateFn;
    };

    // Generated statics block

    var __$ = {
           __name : "__$",
           _S : " ",
           _1554569446 : ["type","text","name","userInput"],
    };

    // Generated function map
    var _o = IncrementalDOM.elementOpen, 
        _v = IncrementalDOM.elementVoid, 
        _c = IncrementalDOM.elementClose, 
        _t = IncrementalDOM.text, 
        _os = IncrementalDOM.elementOpenStart, 
        _oe = IncrementalDOM.elementOpenEnd, 
        _at = IncrementalDOM.attr, 
        _s = IncrementalDOM.skip;


    // ================== Generated precompiled templates ==================

    /* ------------------ template [ template ] ------------------ */
    Hbs.templates["template"] = Hbs.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return (_t(" You typed: ") & _o("strong", "idom-13", null) & _t(""
    + ((helper = (helper = helpers.userInput || (depth0 != null ? depth0.userInput : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"userInput","hash":{},"data":data}) : helper))
    + "") & _c("strong"));
},"3":function(container,depth0,helpers,partials,data) {
    return (_t(" Please type something! "));
},"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return (_o("div", "idom-6", null) & _t(__$._S) & _o("h3", "idom-7", null) & _t("Simple Backbone Integration") & _c("h3") & _t(__$._S) & _o("div", "idom-8", null) & _t(" Input some text in the input field. When the input change the whole View is re-rendered. ") & _c("div") & _t(__$._S) & _o("div", "idom-9", null) & _t(__$._S) & _o("p", "idom-10", null) & _t(__$._S) & _v("input", "idom-11", __$._1554569446, "value", ""
    + ((helper = (helper = helpers.userInput || (depth0 != null ? depth0.userInput : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"userInput","hash":{},"data":data}) : helper))
    + "") & _t(__$._S) & _c("p") & _t(__$._S) & _o("p", "idom-12", null))
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.userInput : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + (_t(__$._S) & _c("p") & _t(__$._S) & _c("div") & _t(__$._S) & _c("div"));
},"useData":true});



})(window.Handlebars);