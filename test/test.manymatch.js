var Manymatch = require('../Manymatch'),
    util = require('util'),
    assert = require('assert');

describe('Manymatch Tests', function() {
    describe('Constructor', function() {
        it('should return a Manymatch object with 1 minimatch', function() {
            var mm = new Manymatch('/');
            assert.ok(util.isArray(mm.minimatches));
            assert.equal(mm.minimatches.length, 1);
        });
    });
    
    describe('Constructor w\\ no args', function() {
        it('should throw an error', function() {
            assert.throws(function() {
                var mm = new Manymatch();
            }, TypeError);
        });
    });
    
    describe('#match', function() {
        describe('single patterns without negations', function() {
            it('/ should match identical strings with nothing special', function() {
                var mm = new Manymatch('/');
                assert.ok(mm.match('/'));
            });
            
            it('/* should match files and folders in the root directory but no more', function() {
                var mm = new Manymatch('/*');
                assert.ok(mm.match('/1'));
                assert.ok(mm.match('/something'));
                assert.ok(mm.match('/testing123.js'));
                assert.ok(!mm.match('/1/2'));
            });
            
            it('/** should match any path', function() {
                var mm = new Manymatch('/**');
                assert.ok(mm.match('/1'));
                assert.ok(mm.match('/something'));
                assert.ok(mm.match('/testing123.js'));
                assert.ok(mm.match('/1/2'));
                assert.ok(mm.match('/my/really/really/long/path/file.js'));
                assert.ok(mm.match('/'));
            });
            
            it('/app/**/public/** should match starting at app going through public', function() {
                var mm = new Manymatch('/app/**/public/**');
                assert.ok(mm.match('/app/public/file.js'));
                assert.ok(mm.match('/app/1/2/public/file.js'));
                assert.ok(mm.match('/app/1/2/public/3/4/file.js'));
                assert.ok(!mm.match('/app/file.js'));
                assert.ok(!mm.match('/public/file.js'));
            });
        });
        
        describe('multiple patterns without negations', function() {
            it('[ /*, /public/**] should match root files or throughout public dir', function() {
                var mm = new Manymatch(['/*', '/public/**']);
                assert.equal(mm.minimatches.length, 2);
                assert.ok(mm.match('/root.html'));
                assert.ok(mm.match('/public/file.js'));
                assert.ok(mm.match('/public/3/4/file.js'));
                assert.ok(!mm.match('/app/public/3/4/file.js'));
            });
        });
        
        describe('multiple patterns with negations', function() {
            it('[ /**, !/private/**] should not match anything in private dir', function() {
                var mm = new Manymatch(['/**', '!/private/**']);
                assert.equal(mm.minimatches.length, 2);
                assert.ok(mm.match('/public/test.html'));
                assert.ok(!mm.match('/private/test.html'));
                assert.ok(mm.match('/root'));
            });
            
            it('[ /**, !/private/**, /private/specialcase] should allow specialcase', function() {
                var mm = new Manymatch(['/**', '!/private/**', '/private/specialcase.css']);
                assert.equal(mm.minimatches.length, 3);
                assert.ok(mm.match('/public/test.html'));
                assert.ok(!mm.match('/private/test.html'));
                assert.ok(mm.match('/private/specialcase.css'));
            });
        });
    });
});