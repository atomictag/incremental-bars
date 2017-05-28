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

    /* ------------------ template [ template-3 ] ------------------ */
    Hbs.templates["template-3"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_o("div", "idom-4", __$._1614377996) , _t("\n") , _o("div", "idom-5", __$._2650412886) , _t("\n") , _o("h3", "idom-6", null) , _t("template-3 (context + data + partial)") , _c("h3") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-7", __$._3222510870) , _t("\n") , _o("div", "idom-8", null) , _t("hello: "
    + alias4(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper)))
    + ". My backend is "
    + alias4(((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper)))
    + "") , _c("div"))
    + ((stack1 = container.invokePartial(partials["_template-partial"],depth0,{"name":"_template-partial","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + (_t("\n") , _c("div") , _t("\n") , _o("div", "idom-9", __$._458214356) , _s() , _c("div") , _t("\n") , _c("div") , _t("\n") , _v("hr", "idom-10", null));
},"usePartial":true,"useData":true});

    /* ------------------ template [ template-1 ] ------------------ */
    Hbs.templates["template-1"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return (_o("div", "idom-12", __$._1614377996) , _t("\n") , _o("div", "idom-13", __$._2650412886) , _t("\n") , _o("h3", "idom-14", null) , _t("template-1 (context)") , _c("h3") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-15", __$._3222510870) , _t("\n") , _o("div", "idom-16", null) , _t("hello: "
    + container.escapeExpression(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"world","hash":{},"data":data}) : helper)))
    + "") , _c("div") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-17", __$._458214356) , _s() , _c("div") , _t("\n") , _c("div") , _t("\n") , _v("hr", "idom-18", null));
},"useData":true});

    /* ------------------ template [ _template-partial ] ------------------ */
    Hbs.templates["_template-partial"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_o("div", "idom-21", null) , _t("\n") , _o("strong", "idom-22", null) , _t("I am a partial in this "
    + alias4(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper)))
    + " and by backend is \""
    + alias4(((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper)))
    + "\"") , _c("strong") , _t("\n") , _c("div"));
},"useData":true});

    /* ------------------ template [ template-4 ] ------------------ */
    Hbs.templates["template-4"] = Hbs.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_t("\n") , _o("li", ""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "", null, "key", ""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "", "style", ""
    + ((stack1 = helpers["if"].call(alias1,1,{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "") , _t("\n                        "
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + " "
    + alias4(container.lambda(depth0, depth0))
    + " "))
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S))
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t("\n") , _c("li"));
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
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_o("div", "idom-38", __$._1614377996) , _t("\n") , _o("div", "idom-39", __$._2650412886) , _t("\n") , _o("h3", "idom-40", null) , _t("template-4 (context + data + partial + #each + #if)") , _c("h3") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-41", __$._3222510870) , _t("\n") , _o("div", "idom-42", null) , _t("hello: "
    + alias4(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper)))
    + ". My backend is "
    + alias4(((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper)))
    + "") , _c("div"))
    + ((stack1 = container.invokePartial(partials["_template-partial"],depth0,{"name":"_template-partial","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + (_t("\n") , _o("div", "idom-43", null) , _t("\n") , _o("ul", "idom-44", null) , _t("\n                "))
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t("\n") , _c("ul") , _t("\n") , _c("div") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-45", __$._458214356) , _s() , _c("div") , _t("\n") , _c("div") , _t("\n") , _v("hr", "idom-46", null));
},"usePartial":true,"useData":true});

    /* ------------------ template [ template-5 ] ------------------ */
    Hbs.templates["template-5"] = Hbs.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_t("\n") , _o("li", ""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "", null, "key", ""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "", "style", ""
    + ((stack1 = helpers["if"].call(alias1,1,{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "") , _t("\n                        "
    + alias4((helpers.customHelper || (depth0 && depth0.customHelper) || alias2).call(alias1,(data && data.index),{"name":"customHelper","hash":{},"data":data}))
    + " "
    + alias4(container.lambda(depth0, depth0))
    + " "))
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S))
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t("\n") , _c("li"));
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
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_o("div", "idom-62", __$._1614377996) , _t("\n") , _o("div", "idom-63", __$._2650412886) , _t("\n") , _o("h3", "idom-64", null) , _t("template-5 (context + data + partial + #each + #if + customHelper)") , _c("h3") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-65", __$._3222510870) , _t("\n") , _o("div", "idom-66", null) , _t("hello: "
    + alias4(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper)))
    + ". My backend is "
    + alias4(((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper)))
    + "") , _c("div"))
    + ((stack1 = container.invokePartial(partials["_template-partial"],depth0,{"name":"_template-partial","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + (_t("\n") , _o("div", "idom-67", null) , _t("\n") , _o("ul", "idom-68", null) , _t("\n                "))
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t("\n") , _c("ul") , _t("\n") , _c("div") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-69", __$._458214356) , _s() , _c("div") , _t("\n") , _c("div") , _t("\n") , _v("hr", "idom-70", null));
},"usePartial":true,"useData":true});

    /* ------------------ template [ template-2 ] ------------------ */
    Hbs.templates["template-2"] = Hbs.template({"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_o("div", "idom-73", __$._1614377996) , _t("\n") , _o("div", "idom-74", __$._2650412886) , _t("\n") , _o("h3", "idom-75", null) , _t("template-2 (context + data)") , _c("h3") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-76", __$._3222510870) , _t("\n") , _o("div", "idom-77", null) , _t("hello: "
    + alias4(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper)))
    + ". My backend is "
    + alias4(((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper)))
    + "") , _c("div") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-78", __$._458214356) , _s() , _c("div") , _t("\n") , _c("div") , _t("\n") , _v("hr", "idom-79", null));
},"useData":true});

    /* ------------------ template [ template-6 ] ------------------ */
    Hbs.templates["template-6"] = Hbs.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_t("\n") , _o("li", ""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "", null, "key", ""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "", "style", ""
    + ((stack1 = helpers["if"].call(alias1,1,{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "") , _t("\n                        "
    + alias4((helpers.customHelper || (depth0 && depth0.customHelper) || alias2).call(alias1,(data && data.index),{"name":"customHelper","hash":{},"data":data}))
    + " "
    + alias4(container.lambda(depth0, depth0))
    + " "))
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t(__$._S))
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t("\n") , _c("li"));
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "color:"
    + ((stack1 = (helpers.customBlockHelper || (depth0 && depth0.customBlockHelper) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.index),{"name":"customBlockHelper","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + ";";
},"3":function(container,depth0,helpers,partials,data) {
    return "red";
},"5":function(container,depth0,helpers,partials,data) {
    return "navy";
},"7":function(container,depth0,helpers,partials,data) {
    return (_t("(first)"));
},"9":function(container,depth0,helpers,partials,data) {
    return (_t("(last)"));
},"compiler":[7,">= 4.0.0","idom"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return (_o("div", "idom-95", __$._1614377996) , _t("\n") , _o("div", "idom-96", __$._2650412886) , _t("\n") , _o("h3", "idom-97", null) , _t("template-6 (context + data + partial + #each + #if + customHelper + customBlockHelper)") , _c("h3") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-98", __$._3222510870) , _t("\n") , _o("div", "idom-99", null) , _t("hello: "
    + alias4(((helper = (helper = helpers.world || (depth0 != null ? depth0.world : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"world","hash":{},"data":data}) : helper)))
    + ". My backend is "
    + alias4(((helper = (helper = helpers.backend || (data && data.backend)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backend","hash":{},"data":data}) : helper)))
    + "") , _c("div"))
    + ((stack1 = container.invokePartial(partials["_template-partial"],depth0,{"name":"_template-partial","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + (_t("\n") , _o("div", "idom-100", null) , _t("\n") , _o("ul", "idom-101", null) , _t("\n                "))
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + (_t("\n") , _c("ul") , _t("\n") , _c("div") , _t("\n") , _c("div") , _t("\n") , _o("div", "idom-102", __$._458214356) , _s() , _c("div") , _t("\n") , _c("div") , _t("\n") , _v("hr", "idom-103", null));
},"usePartial":true,"useData":true});


    // ================== Auto-register partials ==================
    Hbs.registerPartial("_template-partial", Hbs.templates["_template-partial"] );

})(window.Handlebars);