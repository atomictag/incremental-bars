(function(Hbs, Idom) {

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
           _1614377996 : ["class","content"],
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
    Hbs.templates["template"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_o("div", "idom-3", __$._1614377996) , _o("h3", "idom-4", null) , _t("Simple template") , _c("h3") , _o("div", "idom-5", null) , _o("strong", "idom-6", null) , _t("Hello "
    + alias4(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper)))
    + "") , _c("strong") , _c("div") , _o("div", "idom-7", null) , _o("p", "idom-8", null) , _t("The simplest template ever!") , _v("br", "idom-9", null) , _t("Feel free to modify the file ") , _o("code", "idom-10", null) , _t("templates/template.html") , _c("code") , _t(" and experiment.") , _c("p") , _o("p", "idom-11", null) , _t("After you modify the template, run again the ") , _o("code", "idom-12", null) , _t("node build.js") , _c("code") , _t(" script and reload the page.") , _c("p") , _o("pre", "idom-13", null) , _t("\n            And here\n                we have\n                    some things "
    + alias4(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper)))
    + " ") , _c("pre") , _c("div") , _c("div") , _v("hr", "idom-14", null));
},"useData":true});



})(window.Handlebars);