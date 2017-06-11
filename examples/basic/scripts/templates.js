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
           _1614377996 : ["class","content"],
           _2650412886 : ["class","content__title"],
           _3222510870 : ["class","content__body"],
           _458214356 : ["data-partial-id","my_partial_holder"],
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

    /* ------------------ template [ _template-partial ] ------------------ */
    Hbs.templates["_template-partial"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_o("div", "idom-3", null) & _t(__$._S) & _o("strong", "idom-4", null) & _t("I am a partial in this "
    + ((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper))
    + " and my backend is \""
    + ((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper))
    + "\"") & _c("strong") & _t(__$._S) & _c("div"));
},"useData":true});

    /* ------------------ template [ template-1 ] ------------------ */
    Hbs.templates["template-1"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return (_o("div", "idom-6", __$._1614377996) & _t(__$._S) & _o("div", "idom-7", __$._2650412886) & _t(__$._S) & _o("h3", "idom-8", null) & _t("template-1 (context)") & _c("h3") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-9", __$._3222510870) & _t(__$._S) & _o("div", "idom-10", null) & _t("hello: "
    + ((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"world","hash":{},"data":data}) : helper))
    + "") & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-11", __$._458214356) & _s() & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _v("hr", "idom-12", null));
},"useData":true});

    /* ------------------ template [ template-2 ] ------------------ */
    Hbs.templates["template-2"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_o("div", "idom-15", __$._1614377996) & _t(__$._S) & _o("div", "idom-16", __$._2650412886) & _t(__$._S) & _o("h3", "idom-17", null) & _t("template-2 (context + data)") & _c("h3") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-18", __$._3222510870) & _t(__$._S) & _o("div", "idom-19", null) & _t("hello: "
    + ((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper))
    + ". My backend is "
    + ((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper))
    + "") & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-20", __$._458214356) & _s() & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _v("hr", "idom-21", null));
},"useData":true});

    /* ------------------ template [ template-3 ] ------------------ */
    Hbs.templates["template-3"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_o("div", "idom-25", __$._1614377996) & _t(__$._S) & _o("div", "idom-26", __$._2650412886) & _t(__$._S) & _o("h3", "idom-27", null) & _t("template-3 (context + data + partial)") & _c("h3") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-28", __$._3222510870) & _t(__$._S) & _o("div", "idom-29", null) & _t("hello: "
    + ((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper))
    + ". My backend is "
    + ((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper))
    + "") & _c("div"))
    + ((stack1 = container.invokePartial(partials["_template-partial"],depth0,{"name":"_template-partial","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + (_t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-30", __$._458214356) & _s() & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _v("hr", "idom-31", null));
},"usePartial":true,"useData":true});

    /* ------------------ template [ template-4 ] ------------------ */
    Hbs.templates["template-4"] = Hbs.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_t(__$._S) & _o("li", ""
    + ((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper))
    + "", null, "key", ""
    + ((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper))
    + "", "style", ""
    + ((stack1 = helpers["if"].call(alias1,1,{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "") & _t(" "
    + ((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper))
    + " "
    + container.lambda(depth0, depth0)
    + " "))
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S))
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S) & _c("li"));
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "color:"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.index),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "";
},"3":function(container,depth0,helpers,partials,data) {
    return "navy";
},"5":function(container,depth0,helpers,partials,data) {
    return "red";
},"7":function(container,depth0,helpers,partials,data) {
    return (_t("(first)"));
},"9":function(container,depth0,helpers,partials,data) {
    return (_t("(last)"));
},"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_o("div", "idom-47", __$._1614377996) & _t(__$._S) & _o("div", "idom-48", __$._2650412886) & _t(__$._S) & _o("h3", "idom-49", null) & _t("template-4 (context + data + partial + #each + #if)") & _c("h3") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-50", __$._3222510870) & _t(__$._S) & _o("div", "idom-51", null) & _t("hello: "
    + ((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper))
    + ". My backend is "
    + ((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper))
    + "") & _c("div"))
    + ((stack1 = container.invokePartial(partials["_template-partial"],depth0,{"name":"_template-partial","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + (_t(__$._S) & _o("div", "idom-52", null) & _t(__$._S) & _o("ul", "idom-53", null) & _t(__$._S))
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S) & _c("ul") & _t(__$._S) & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-54", __$._458214356) & _s() & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _v("hr", "idom-55", null));
},"usePartial":true,"useData":true});

    /* ------------------ template [ template-5 ] ------------------ */
    Hbs.templates["template-5"] = Hbs.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_t(__$._S) & _o("li", ""
    + ((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper))
    + "", null, "key", ""
    + ((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper))
    + "", "style", ""
    + ((stack1 = helpers["if"].call(alias1,1,{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "") & _t(" "
    + (helpers.customHelper || (depth0 && depth0.customHelper) || alias2).call(alias1,(data && data.index),{"name":"customHelper","hash":{},"data":data})
    + " "
    + container.lambda(depth0, depth0)
    + " "))
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S))
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S) & _c("li"));
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "color:"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.index),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "";
},"3":function(container,depth0,helpers,partials,data) {
    return "navy";
},"5":function(container,depth0,helpers,partials,data) {
    return "red";
},"7":function(container,depth0,helpers,partials,data) {
    return (_t("(first)"));
},"9":function(container,depth0,helpers,partials,data) {
    return (_t("(last)"));
},"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_o("div", "idom-71", __$._1614377996) & _t(__$._S) & _o("div", "idom-72", __$._2650412886) & _t(__$._S) & _o("h3", "idom-73", null) & _t("template-5 (context + data + partial + #each + #if + customHelper)") & _c("h3") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-74", __$._3222510870) & _t(__$._S) & _o("div", "idom-75", null) & _t("hello: "
    + ((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper))
    + ". My backend is "
    + ((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper))
    + "") & _c("div"))
    + ((stack1 = container.invokePartial(partials["_template-partial"],depth0,{"name":"_template-partial","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + (_t(__$._S) & _o("div", "idom-76", null) & _t(__$._S) & _o("ul", "idom-77", null) & _t(__$._S))
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S) & _c("ul") & _t(__$._S) & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-78", __$._458214356) & _s() & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _v("hr", "idom-79", null));
},"usePartial":true,"useData":true});

    /* ------------------ template [ template-6 ] ------------------ */
    Hbs.templates["template-6"] = Hbs.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_t(__$._S) & _o("li", ""
    + ((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper))
    + "", null, "key", ""
    + ((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper))
    + "", "style", ""
    + ((stack1 = helpers["if"].call(alias1,1,{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "") & _t(" "
    + (helpers.customHelper || (depth0 && depth0.customHelper) || alias2).call(alias1,(data && data.index),{"name":"customHelper","hash":{},"data":data})
    + " "
    + container.lambda(depth0, depth0)
    + " "))
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S))
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S) & _c("li"));
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "color:"
    + ((stack1 = (helpers.customBlockHelper || (depth0 && depth0.customBlockHelper) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.index),{"name":"customBlockHelper","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "";
},"3":function(container,depth0,helpers,partials,data) {
    return "red";
},"5":function(container,depth0,helpers,partials,data) {
    return "navy";
},"7":function(container,depth0,helpers,partials,data) {
    return (_t("(first)"));
},"9":function(container,depth0,helpers,partials,data) {
    return (_t("(last)"));
},"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return (_o("div", "idom-95", __$._1614377996) & _t(__$._S) & _o("div", "idom-96", __$._2650412886) & _t(__$._S) & _o("h3", "idom-97", null) & _t("template-6 (context + data + partial + #each + #if + customHelper + customBlockHelper)") & _c("h3") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-98", __$._3222510870) & _t(__$._S) & _o("div", "idom-99", null) & _t("hello: "
    + ((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper))
    + ". My backend is "
    + ((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper))
    + "") & _c("div"))
    + ((stack1 = container.invokePartial(partials["_template-partial"],depth0,{"name":"_template-partial","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + (_t(__$._S) & _o("div", "idom-100", null) & _t(__$._S) & _o("ul", "idom-101", null) & _t(__$._S))
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S) & _c("ul") & _t(__$._S) & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _o("div", "idom-102", __$._458214356) & _s() & _c("div") & _t(__$._S) & _c("div") & _t(__$._S) & _v("hr", "idom-103", null));
},"usePartial":true,"useData":true});


    // ================== Auto-register partials ==================
    Hbs.registerPartial("_template-partial", Hbs.templates["_template-partial"] );

})(window.Handlebars);