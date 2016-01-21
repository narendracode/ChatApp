var superagent = require('superagent');
var assert = require('assert');
var expect = require('expect.js');
var jsdom = require('mocha-jsdom');

describe('Express rest API test', function() {
    jsdom();
    var user;
    var token;
    var blog_id;
    var signupUrl = 'http://127.0.0.1:3000/auth/signup';
    var loginUrl = 'http://127.0.0.1:3000/auth/login';
    var logoutUrl = 'http://127.0.0.1:3000/auth/logout';
    var blogBaseUrl = 'http://127.0.0.1:3000/blog';

    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    function parseToken(token){
        var user = {};
        if(token){
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;  
    }


    describe('TEST', function () {
        it('#SIGNUP', function (done) {
            superagent.post(signupUrl)
                .send({
                email : 'test@test.com',
                password : 'testPassword',
                name : 'tester'
            })
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.type).to.eql(true);
                token = res.body.token;
                user = parseToken(token);
                expect(user.email).to.eql('test@test.com');
                expect(user.role).to.eql('user');
                expect(user.name).to.eql('tester');
                done();
            })
        });

        it('#LOGIN', function (done) {
            superagent
                .post(loginUrl)
                .send({
                email : 'test@test.com',
                password : 'testPassword'
            })
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.type).to.eql(true);
                token = res.body.token;
                user = parseToken(token);
                expect(user.email).to.eql('test@test.com');
                expect(user.role).to.eql('user');
                expect(user.name).to.eql('tester');
                done();
            })
        });

        it('#BLOG-CREATE', function (done) {
            superagent
                .post(blogBaseUrl)
                .send({
                content : "test content",
                    title : "test title"
                })
                .set('Authorization', 'bearer '+token)
                .end(function(e,res){
                expect(e).to.eql(null);
                blog_id = res.body._id;
                expect(res.body.title).to.eql("test title");
                expect(res.body.content).to.eql("test content");
                expect(res.body.created_by.email).to.eql("test@test.com");
                expect(res.body.created_by.name).to.eql("tester");
                done();
            })
        });

        it('#GET ALL BLOGS', function (done) {
            superagent
                .get(blogBaseUrl)
                .send({

                })
                .set('Authorization', 'bearer '+token)
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.length).to.eql(1);
                expect(res.body[0].title).to.eql("test title");
                expect(res.body[0].content).to.eql("test content");
                expect(res.body[0].created_by.email).to.eql("test@test.com");
                expect(res.body[0].created_by.name).to.eql("tester");
                done();
            })
        });
        
        it('#GET BLOG BY ID', function (done) {
            superagent
                .get(blogBaseUrl+'/'+blog_id)
                .send({
                 })
                .set('Authorization', 'bearer '+token)
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.title).to.eql("test title");
                expect(res.body.content).to.eql("test content");
                expect(res.body.created_by.email).to.eql("test@test.com");
                expect(res.body.created_by.name).to.eql("tester");
                done();
            })
        });
        

        it('#UPDATE BLOG BY ID', function (done) {
            superagent
                .put(blogBaseUrl+'/'+blog_id)
                .send({
                    content : "content updated",
                    title : "test title updated"
                })
                .set('Authorization', 'bearer '+token)
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.title).to.eql("test title updated");
                expect(res.body.content).to.eql("content updated");
                expect(res.body.created_by.email).to.eql("test@test.com");
                expect(res.body.created_by.name).to.eql("tester");
                done();
            })
        });

        
        it('#DELETE BLOG BY ID', function (done) {
            superagent
                .get(blogBaseUrl+'/'+blog_id)
                .send({
                
                })
                .set('Authorization', 'bearer '+token)
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.title).to.eql("test title updated");
                expect(res.body.content).to.eql("content updated");
                expect(res.body.created_by.email).to.eql("test@test.com");
                expect(res.body.created_by.name).to.eql("tester");
                done();
            })
        });
        
        it('#DELETE USER', function (done) {
            superagent
                .del(signupUrl)
                .send({
                email : 'test@test.com'
            })
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.type).to.eql(true);
                expect(res.body.data).to.eql('user deleted successfully with email test@test.com');
                done();
            })
        });
    });
});



