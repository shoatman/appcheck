#!/usr/bin/env node --harmony

/**
 * Module dependencies.
 */

var Q = require('q');
var request = require('request');
var prompt = require('prompt');
var Url = require('url');
var crypto = require('crypto');
var qs = require('querystring');
var program = require('commander');
var fs = require('fs');
var os = require('os');
var aadGraph = require('./graph');
var colors = require('colors');
var cliff = require('cliff');
var AuthenticationContext = require('adal-node').AuthenticationContext;


var tokenFileName = 'aadappheck.json';
var domain = 'https://graph.windows.net';
var authorityUrl = 'https://login.windows.net/common';
var resource = '00000002-0000-0000-c000-000000000000';
var clientId = 'f4c23407-9821-405f-912b-e07ea6a29f7b';
var redirectUri = 'http://localhost/appcheck';
var templateAuthzUrl = authorityUrl + 
                        '/oauth2/authorize?response_type=code&client_id=' +
                        clientId + 
                        '&redirect_uri=' + 
                        redirectUri + 
                        '&state=<state>&resource=' + 
                        resource;

var templateAuthzUrlWOState = authorityUrl + 
                        '/oauth2/authorize?response_type=code&client_id=<clientId>' +
                        '&redirect_uri=<redirectUri>' + 
                        '&resource=' +
                        resource;

function createLoginUrl(){

  var deferred = Q.defer();

  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

    program.authState = token;
    var loginUrl = templateAuthzUrl.replace('<state>', token);
    deferred.resolve(loginUrl);
    
  });

  return deferred.promise;
}

function getToken(){

  var homeDir = os.tmpdir();
  var file = homeDir + tokenFileName;

  var deferred = Q.defer();

  fs.stat(file, function(err, stats){
    if(err){
      deferred.reject(err);
    }else{
      var token = fs.readFileSync(file, 'utf8');
      deferred.resolve(JSON.parse(token));    

    }
  });

  return deferred.promise;
  
}

program
  .version('0.0.1')
  .command('login')
  .description('Login to analyze your apps')
  .action(function (){
    createLoginUrl().then(function(url){
      console.log('Please paste following URL into your browser:'.green);
      console.log('============================================'.yellow);
      console.log(url);
      console.log('============================================'.yellow);
      console.log('If necessary login and consent to the appcheck application.  When you get a 404... Not Found....'.green);
      console.log('Copy the URL from your browser and paste below.  It should look something like: localhost/appcheck?code='.green);
      console.log('============================================'.yellow);
      prompt.start();
      prompt.get(['url'], function(err, result){
        var authorizationCodeUrl = result.url;

        var authUrl = Url.parse(authorizationCodeUrl, true);
   
        if(program.authState != authUrl.query.state){
          console.log('State did not match.  Somthing is fishy...Aborting.  You are not logged in.'.red);
          return;
        }

        var authenticationContext = new AuthenticationContext(authorityUrl);

        authenticationContext.acquireTokenWithAuthorizationCode(
          authUrl.query.code,
          redirectUri,
          resource,
          clientId, 
          '',
          function(err, response) {
            var errorMessage = '';
            if (err) {
              errorMessage = 'error: ' + err.message + '\n';
              console.log(errorMessage);
              return;
            }
            var homeDir = os.tmpdir();
            var file = homeDir + tokenFileName;
            fs.writeFileSync(file, JSON.stringify(response));
            console.log('Great success you are logged in'.green);
          }
        );

      });
      
    });
  });

program
  .command('logout')
  .description('Logout and delete tokens')
  .action(function(){
    
    getToken().then(function(token){
      var homeDir = os.tmpdir();
      var file = homeDir + tokenFileName;

      fs.unlinkSync(file);
      console.log('Great success you are logged out.'.green);
    }).catch(function(err){
      console.log('You are not even logged in yet... slow your roll'.green);
    });
    
  });

program
  .command('dump')
  .description('dump current state')
  .action(function (){
    getToken().then(function(token){
      console.log(cliff.inspect(token));
    }).catch(function(err){
      console.log('Nothing to dump'.green);
    });
    
  });

program
  .command('export')
  .description('exports an application to json')
  .option('-a, --appId <appId>', 'Your application or client Id')
  .action(function(options){
    getToken().then(function(token){
      var graph = new aadGraph.AADGraph({'domain': domain });

      var params = {};
      params.tenantId = token.tenantId;
      params.Authorization = 'Bearer ' + token.accessToken;
      
      params['$filter'] = "appId eq '" + options.appId + "'";
      params['apiVersion'] = "1.6";

      graph.GetApplications(params).then(function(result){
        console.log(cliff.inspect(result.body.value));
      }).catch(function(err){
        console.log(err);
        console.log('We were not able to find that app that you were looking for'.red);
      });      
    }).catch(function(err){
      console.log('This command requires you to login.  Usage: aadappcheck login'.red);
    });

  });

program
  .command('healthcheck')
  .description('Get an overview of the app and your consent information relative to the app.')
  .option('-a, --appId <appId>', 'Your application or client Id')
  .action(function(options){
    getToken().then(function(token){
      var graph = new aadGraph.AADGraph({'domain': domain });

      var params = {};
      params.tenantId = token.tenantId;
      params.Authorization = 'Bearer ' + token.accessToken;
      
      params['$filter'] = "appId eq '" + options.appId + "'";
      params['apiVersion'] = "1.6";

      graph.GetApplications(params).then(function(result){
        console.log('We found your app.  Next we will look for you'.green);
        if(result.body.value.length == 0){
          console.log('App not found'.red);
          return;
        }
        var appObject = result.body.value[0];

        var userParams = {};
        userParams.userId = token.userId;
        userParams.tenantId = token.tenantId;
        userParams.Authorization = 'Bearer ' + token.accessToken;
        userParams.apiVersion = '1.6';
        graph.GetUser(userParams).then(function(result){
          var userObject = result.value;
          if(appObject.publicClient){
            console.log('We found you. You app is a public client... so nothing else to check.'.green);
            console.log('Healthcheck complete.');
            return;
          }else{
            console.log('We found you.  Your app is a confidential client... hence we will look up your service principal next.'.green);
          }

          spParams = {};
          spParams.Authorization = 'Bearer ' + token.accessToken;
          spParams.apiVersion = '1.6';

        }).catch(function(err){
          console.log(err);
          console.log('We were not able to find you in the directory'.red);
          return;
        });

      }).catch(function(err){
        console.log(err);
        console.log('We were not able to find that app that you were looking for'.red);
        return;
      });      
    }).catch(function(err){
      console.log('This command requires you to login.  Usage: aadappcheck login'.red);
      return;
    });
  });

program
  .command('authZUris')
  .description('Write common authorization request URL variants to the console')
  .option('-a, --appId [appId]', 'Your application or client Id')
  .option('-r, --redirectUri [redirectUri]', 'The redirect URI registered with you app')
  .action(function(options){

    var urlBase = '';
    if(options.redirectUri){
      urlBase = templateAuthzUrlWOState.replace('<redirectUri>', options.redirectUri);
    }else{
      //Let's default to this app
      urlBase = templateAuthzUrlWOState.replace('<redirectUri>', redirectUri);
      console.log('You did not supply a redirect URI.  The redirect URI of appcheck will be used instead.'.yellow);
    }

    if(options.appId){
      urlBase = urlBase.replace('<clientId>', options.appId);
    }else{
      urlBase = urlBase.replace('<clientId>', clientId);
      console.log('You did not supply and app/client id.  The client id of appcheck will be used instead.'.yellow);
    }

    console.log('The following are useful variants of authorization requests for your application.');
    console.log('Note: The state parameter which is recommend as been left out.');
    console.log('');
    console.log('=================================================='.yellow);
    console.log('BASIC:'.green);
    console.log('=================================================='.yellow);
    console.log(urlBase);
    console.log('');
    
    console.log('=================================================='.yellow);
    console.log('PROMPT CONSENT or RECONSENT (if permissions for the app have changed -> &prompt=consent)'.green);
    console.log('=================================================='.yellow);
    console.log(urlBase + '&prompt=consent');
    console.log('');

    console.log('=================================================='.yellow);
    console.log('PROMPT FOR ADMIN CONSENT or RECONSENT (if permissions for the app have changed) &prompt=admin_consent'.green);
    console.log('=================================================='.yellow);
    console.log(urlBase + '&prompt=admin_consent');
    console.log('');

    console.log('=================================================='.yellow);
    console.log('REQUIRE USER Authentication &prompt=login'.green);
    console.log('=================================================='.yellow);
    console.log(urlBase + '&prompt=login');
    console.log('');
    
    console.log('=================================================='.yellow);
    console.log('ONLY WORK ACCOUNTS PLEASE &msafed=0'.green);
    console.log('=================================================='.yellow);
    console.log(urlBase + '&msafed=0');
    console.log('');
    
    console.log('=================================================='.yellow);
    console.log('TELL AAD the UserName to pre-fill &login_hint=[username]'.green);
    console.log('=================================================='.yellow);
    console.log(urlBase + '&login_hint=someuser');
    console.log('');

    console.log('=================================================='.yellow);
    console.log('TELL AAD the domain of the user &domain_hint=[microsoft.com]'.green);
    console.log('=================================================='.yellow);
    console.log(urlBase + '&domain_hint=microsoft.com');
    
  });
  
program.parse(process.argv);
