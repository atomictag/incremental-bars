incremental-bars examples
=============

The folder `lib`: contains the build script to precompile templates.
The build script picks all templates in a specified folder and output a script file for inclusion in a HTML page.

Available examples:
- folder `simple`: the simplest possible example. A super minimal starting point to fiddle with with the library.
- folder `basic`: simple examples with purposely trivial templates to familiarize with the library.
- folder `backbone`: simple backbone integration. A "classic" re-render-on-user-input case where incremental-bars is very useful.

NOTE: If templates are changed/added to an example project, run `node build.js` again to re-generate the script with the pre-compiled templates.
