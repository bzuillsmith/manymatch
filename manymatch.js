
var Minimatch =  require('minimatch').Minimatch,
    util = require('util');

/**
 * Creates a Manymatch instance that contains a series of regexes produced
 * from the given patterns.
 * @param {array} patterns An array of string patterns (minimatch patterns).
 * Patterns will be processed in order. Patterns starting with
 * `!` will only negate the results from the patterns before it,
 * so for `[ '!/mydir/1', '/mydir/*']`, the first pattern will effectively
 * be ignored and everything in mydir/ will be matched.
 */
var Manymatch = function Manymatch (patterns) {
    if(typeof patterns === 'string')
        patterns = [patterns];
    else if(!util.isArray(patterns)){
        throw new TypeError();
    }

    var i, pattern;
        
    this.minimatches = [];
    for(i=0; i<patterns.length; i++){
        pattern = patterns[i];
        if(pattern.charAt(0) === '!' && this.minimatches.length === 0) {
            continue; //ignore pattern because first ones should not start with `!`
        }
        this.minimatches.push(new Minimatch(pattern));
    }
};

/**
 * Matches a string against a Manymatch (a series of `minimatch` patterns).
 * The matching will happen in sequence. Patterns beginning with `!` are 
 * negations. Negations will only negate possibilities from previous patterns.
 * @param {string} value the string to test against the minimatch patterns
 */
Manymatch.prototype.match = function(value) {
    if(typeof value !== 'string')
        throw new TypeError();
    var isMatch = false;
    this.minimatches.forEach(function(minimatch, index, array) {
        if(minimatch.negate) {
            if(!isMatch) return;    // ignore this one because no match was found before this negation
            if(!minimatch.match(value)) isMatch = false; // no match means the path is negated
        } else
            if(minimatch.match(value)) isMatch = true;
    });
    return isMatch;
};

module.exports = Manymatch;
