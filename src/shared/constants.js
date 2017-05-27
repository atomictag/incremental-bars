
module.exports = {
    ANY_MOUSTACHE_RE                     : /\{{2,4}~?(?:\n|\r|.)*?~?\}{2,4}/gmi, // match any moustache
    //
    BLOCK_MOUSTACHE_RE                   : /(\{{2,3}~?[\s]*(?:#|\/|>|else|\*|\^)(?:\n|\r|.)*?~?\}{2,3})/gm, // match open-close-else moustache
    BLOCK_MOUSTACHE_START_RE             : /(\{{2,3}~?[\s]*(?:#)(?:\n|\r|.)*?~?\}{2,3})/gm,                 // match open moustache
    BLOCK_MOUSTACHE_ELSE_RE              : /(\{{2,3}~?[\s]*(?:else|\^)(?:\n|\r|.)*?~?\}{2,3})/gm,           // match else moustache
    BLOCK_MOUSTACHE_END_RE               : /(\{{2,3}~?[\s]*(?:\/)(?:\n|\r|.)*?~?\}{2,3})/gm,                // match close moustache
    COMMENT_MOUSTACHE_RE                 : /(\{{2}~?!(?:.)*?~?\}{2})/g,                                     // match all comments moustache
    COMMENT_BLOCK_MOUSTACHE_RE           : /(\{{2}~?!(?:--)?(?:\n|\r|.)*?(?:--)~?\}{2})/gm,                 // match all comments moustache
    TRIM_LEFT_RE                         : /\s*(\{{2,3})\s*~/gm,                                            // {{~ and {{{~
    TRIM_RIGHT_RE                        : /~\s*(\}{2,3})\s*/gm,                                            // ~}} and ~}}}
    //
    moustachePlaceholderPrefix           : 'moustache-',
    moustachePlaceholderBlockPrefix      : 'moustache-block-',
    moustachePlaceholderBlockStartPrefix : 'moustache-block-start-',
    moustachePlaceholderBlockElsePrefix  : 'moustache-block-else-',
    moustachePlaceholderBlockEndPrefix   : 'moustache-block-end-',
    moustachePlaceholderSuffix           : '-x',
    //
    ANY_MOUSTACHE_PLACEHOLDER_RE         : /(\s?moustache\-.*?\-x\s?)/gi,
    BLOCK_MOUSTACHE_PLACEHOLDER_RE       : /(\s?moustache\-block.*?-x\s?)/gi
}