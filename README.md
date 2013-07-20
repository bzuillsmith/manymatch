manymatch
=========

A glob matcher for node wrapped around minimatch that matches a string against a series of glob patterns.

    var Manymatch = require('manymatch');
    var manymatch = new Manymatch(['/**','!/private/**']);
    console.log(manymatch.match('/public/my/url')); // true
    console.log(manymatch.match('/private/restricted.html')); // false

I haven't gotten to the documentation yet. I built this to make it easy to work with url matching for server constraints but because it's a super thin layer on top of minimatch, it has a lot more capability. For now, take a look at the https://github.com/bzuillsmith/manymatch/test/test.manymatch.js for some examples.

Thanks to Isaac Schlueter for the great minimatch module! https://github.com/isaacs/minimatch/
