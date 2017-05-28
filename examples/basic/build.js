require('../lib/precompile')({
    rootPath          : __dirname,      // Absolute path or the root folder from where src and dest are resolved
    srcDir            : 'templates',    // Folder where template sources live, relative to rootPath. This is not recursive.
    destDir           : 'scripts',      // Folder where to put the generated precompileds script, relative to rootPath
    outputFileName    : 'templates.js', // Name of the output file script, generated in the destDir folder
});