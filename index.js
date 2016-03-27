#!/usr/bin/env node --harmony

/**
 * Module dependencies.
 */

var Q = require('q');
var jws = require('jws');
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

//The actual global administrator role name....
var companyAdministratorDisplayName = 'Company Administrator';


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
  .version('0.0.1')
  .command('loginDumpToken')
  .description('Login to your app and dump the resulting token to the console')
  .option('-a, --appId <appId>', 'Your application or client Id')
  .option('-r, --redirectUri <redirectUri>', 'The redirect URI registered with you app')
  .option('-s, --secret [secret]', 'The secret for your web app or if you prefer confidential client')
  .option('-R, --resource [resource]', 'The resource id or ids that your web application would like to access')
  .action(function (options){
    
      var urlBase = authorityUrl + 
                      '/oauth2/authorize?response_type=code&client_id=<clientId>' +
                      '&redirect_uri=<redirectUri>' + 
                      '&resource=<resource>'

      urlBase = urlBase.replace('<clientId>', options.appId);
      urlBase = urlBase.replace('<redirectUri>', options.redirectUri);

      if(options.resource){
        resource = options.resource;
      }

      var secret = '';
      if(options.secret){
        secret = options.secret;
      }

      urlBase = urlBase.replace('<resource>', resource);

      console.log('Please paste following URL into your browser:'.green);
      console.log('============================================'.yellow);
      console.log(urlBase);
      console.log('============================================'.yellow);
      console.log('If necessary login and consent to the appcheck application.  When you get a 404... Not Found....'.green);
      console.log('Copy the resulting URL from your browser and paste below'.green);
      console.log('Note: The browser will redirect if there is something to redirect to... so stop your web server.'.green);
      console.log('============================================'.yellow);
      prompt.start();
      prompt.get(['url'], function(err, result){
        var authorizationCodeUrl = result.url;

        var authUrl = Url.parse(authorizationCodeUrl, true);
   
        var authenticationContext = new AuthenticationContext(authorityUrl);

        authenticationContext.acquireTokenWithAuthorizationCode(
          authUrl.query.code,
          options.redirectUri,
          resource,
          options.appId, 
          secret,
          function(err, response) {
            var errorMessage = '';
            if (err) {
              errorMessage = 'error: ' + err.message + '\n';
              console.log(errorMessage);
              return;
            }
            
            opts = {};
            var decoded = jws.decode(response.accessToken, opts);

            if(!decoded){
              console.log('Error decoding your access token.'.red);
              return;
            }

            console.log('Here is the content of your access token'.green);
            console.log(cliff.inspect(decoded.payload));

            
          }
        );

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

function GetSPOAuth2PermissionGrants(graph, token, spObjectId, adminConsent){

  var params = {};

  params.tenantId = token.tenantId;
  params.spObjectId = spObjectId;
  params.Authorization = 'Bearer ' + token.accessToken;
  params.apiVersion = "1.6";
  
  return graph.GetServicePrincipalOAuth2PermissionGrants(params);
}

function GetUserOAuth2PermissionGrants(graph, token){
  var params = {};

  params.tenantId = token.tenantId;
  params.userId = token.userId;
  params.Authorization = 'Bearer ' + token.accessToken;
  params.apiVersion = "1.6";
  
  return graph.GetUserOAuth2PermissionGrants(params);
}

function GetApplication(graph, token, appId){

  var params = {};
  params.tenantId = token.tenantId;
  params.Authorization = 'Bearer ' + token.accessToken;
  
  params['$filter'] = "appId eq '" + appId+ "'";
  params['apiVersion'] = "1.6";

  return graph.GetApplications(params);
}

function GetServicePrincipal(graph, token, appId){
  var params = {};
  params.Authorization = 'Bearer ' + token.accessToken;
  params.tenantId = token.tenantId;
  params.apiVersion = '1.6';
  params['$filter'] = "appId eq '" + appId + "'";

  return graph.GetServicePrincipals(params);
}


function GetUser(graph, token){
  var params = {};
  params.userId = token.userId;
  params.tenantId = token.tenantId;
  params.Authorization = 'Bearer ' + token.accessToken;
  params.apiVersion = '1.6';

  return graph.GetUser(params);
}

function GetDirectoryRoles(graph, token){
  var params = {};
  params.tenantId = token.tenantId;
  params.Authorization = 'Bearer ' + token.accessToken;
  params.apiVersion = '1.6';
  // I want to do this... but no... this filter isn't supported
  //params['$filter'] = "displayName eq 'Company Administrator'";

  return graph.GetDirectoryRoles(params);
}

function filterIsApp(spObjectId){
  return function(value){
    return value.clientId == spObjectId;
  }
}


function filterIsUser(userObjectId){
  return function(value){
    return value.principalId == userObjectId;
  }
}

function filterIsAdminConsented(value){
  return value.consentType == "AllPrincipals";
}

program
  .command('healthcheck')
  .description('Get an overview of the app and your consent information relative to the app.')
  .option('-a, --appId <appId>', 'Your application or client Id')
  .action(function(options){
    getToken().then(function(token){
      var graph = new aadGraph.AADGraph({'domain': domain });

      var appObject = null;
      var spObject = null;
      var userObject = null;
      var directoryRoles = null;
      var grants = null;

      var resourceApps = null;

      var getObjectCalls = [GetApplication(graph, token, options.appId), 
                            GetUser(graph, token), 
                            GetServicePrincipal(graph, token, options.appId),
                            GetDirectoryRoles(graph, token)];

      Q.allSettled(getObjectCalls).spread(function(application, user, servicePrincipal, dirRoles){
        
        //App Object
        if(application.state === "fulfilled"){
          if(application.value.body.value.length == 0){
            console.log('Application object not found'.yellow);
          }else{
            appObject = application.value.body.value[0];
         
            console.log('Here is the application object'.green);
            console.log(cliff.inspect(appObject));
          }
        }

        //User Object
        if(user.state === "fulfilled"){
          userObject = user.value.body;
          console.log('We found you as well.'.green);
        }

        //Service Principal
        if(servicePrincipal.state === "fulfilled"){
          if(servicePrincipal.value.body.value.length == 0){
            console.log('Service principal not found'.yellow);
          }else{

            spObject = servicePrincipal.value.body.value[0];
            
            console.log('Here is the service princpal object'.green);
            console.log(cliff.inspect(spObject));

          }
        }

        if(dirRoles.state === "fulfilled"){
          //These shoudl always be found... add error handling later if it looks like it's ncessary
          directoryRoles = dirRoles.value.body.value;
        }


      }).then(function(){

        //Additional Requests based on availability/state of the app/sp
        var additionalRequests = [];

        if(spObject){
          additionalRequests.push(GetSPOAuth2PermissionGrants(graph, token, spObject.objectId, true));
        }

        if(directoryRoles){
          //Let's see if the currnet user is an administrator...
          
        }

        if(appObject){
          //let's get the SPs for the app publisappObject.requiredResourceAccesshe required resources (The apps publishing the APIs were going to call)
          for (var i = 0; i < appObject.requiredResourceAccess.length; i++) {
            additionalRequests.push(GetServicePrincipal(graph, token, appObject.requiredResourceAccess[i].resourceAppId));
          };
        }

        //***** SHOULD ADD A DIRECTORY ROLE CHECK FOR THE CURRENT USER

        Q.allSettled(additionalRequests).spread(function(){


          var arg1 = arguments[0];
          if(arg1.state === "fulfilled"){
            grants = arg1.value.body.value;
          }



        }).then(function(){

          if(grants){


            var userGrants = grants.filter(filterIsUser(userObject.objectId));
            console.log('Here are the oAuth2Permissions you granted this app'.green);
            console.log(cliff.inspect(userGrants));

            var adminGrants = grants.filter(filterIsAdminConsented);
            console.log('Here are the oAuth2Permissions you or another admin consented to onbehalf of all users'.green);
            console.log(cliff.inspect(adminGrants));
          }

        });
        

        

      });

    }).catch(function(err){
      console.log(err);
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
