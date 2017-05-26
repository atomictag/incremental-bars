var DEFAULT_BACKEND = 'html';
var Runtime = function(Handlebars) {
  if(!Handlebars || typeof Handlebars.template !== 'function') {
      throw new Error('Invalid Handlebars')
  }
  var original_template = Handlebars.template;
  Handlebars.template = function template_instrumented(spec) {
      var templateFn     = original_template(spec);
      if(templateFn) {
         var fn = templateFn, backend = spec.compiler[2] || DEFAULT_BACKEND;
         // Ensure data.backend is always set
         templateFn = function(context, options) {
             options              = options || {};
             options.data         = options.data || {};
             options.data.backend = backend;
             return fn(context, options);
         };
         // Also set backend on the template function itself
         templateFn.backend = backend;
      }
      return templateFn;
  }
  return Handlebars;
};
Runtime.DEFAULT_BACKEND = DEFAULT_BACKEND;
module.exports = Runtime;