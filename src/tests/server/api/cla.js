// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// models
var User = require('../../../server/documents/user').User;
var CLA = require('../../../server/documents/cla').CLA;

//services
var github = require('../../../server/services/github');
var url = require('../../../server/services/url');
var cla = require('../../../server/services/cla');
var status = require('../../../server/services/status');

// api
var cla_api = require('../../../server/api/cla');

describe('cla:get', function(done) {
    global.config.terms = 'xyz';

    it('should get gist and render it', function(done) {
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            var res;
            if (args.obj === 'gists') {
                assert.deepEqual(args, {obj: 'gists', fun: 'get', arg:{ id:global.config.terms}, token: global.config.server.github.token });
                res = {files:{xyFile:{content:'some content'}}};
            } else {
                assert.equal(args.obj, 'markdown');
                assert.equal(args.fun, 'render');
                assert.equal(args.token, global.config.server.github.token);
                res = {status:200};
            }
            done(null, res);
        });

        var req = {};

        cla_api.get(req, function(error, res) {
            githubStub.restore();
            done();
        });

    });
});

describe('cla:sign', function(done) {
    var req = {
        user: {id:3},
        args:{
            repo: 123,
            owner: {id:1, login:'login'}
        }
    };

    beforeEach(function(){
        sinon.stub(cla, 'check', function(args, done){
            if (args.user === 2) {
                done(null, true);
            } else {
                done(null, false);
            }
        });
        sinon.stub(cla, 'create', function(args, done){
            assert(args);
            done();
        });
    });
    afterEach(function(){
        cla.check.restore();
        cla.create.restore();
    });

    it('should store signed cla data if not signed yet', function(done) {

        var user_find = sinon.stub(User,'findOne', function(args, done){
            done('error', null);
        });

        req.user.id = 3;

        cla_api.sign(req, function(error, res) {
            assert(cla.create.called);
            user_find.restore();
            done();
        });

    });

    it('should do nothing if user has allready signed', function(){

        req.user.id = 2;

        cla_api.sign(req, function(error, res) {
            assert.equal(cla.create.called, false);
        });
    });

    it('should update status of pull request created by user, who signed', function(){
        var user = {
            requests:[{repo:{id:123, name:'xy_repo'}, sha:'guid'}],
            save: function(){}
        };
        var user_find = sinon.stub(User,'findOne', function(args, done){
            done('', user);
        });

        req.user.id = 3;

        cla_api.sign(req, function(error, res) {
            assert.ifError(error);
            assert.ok(res);
            user_find.restore();
        });
    });

    it('should update status even if user has multiple requests', function(){
       var user = {
            requests:[
                {repo:{id:123, name:'xy_repo'}, sha:'guid'},
                {repo:{id:234, name:'ab_repo'}, sha:'guid2'}],
            save: function(){}
        };
        var user_find = sinon.stub(User,'findOne', function(args, done){
            done('', user);
        });
        sinon.stub(status, 'update', function(args, done){
        });

        req.user.id = 3;

        cla_api.sign(req, function(error, res) {
            assert.ifError(error);
            assert.ok(res);
            assert.equal(status.update.callCount, 2);
            user_find.restore();

        });
    });
});
