# appcheck

## Introduction
CLI Utilitiy for working with AAD Application Objects.  Use this command line program for:
* Exporting application object
* Getting a list of OIDC authz URIs with various parameters to affect sign in behavior
* Check the health of your app: Service prinicpal exists; Consent record matches requested permissions; etc...
* Get a list of current owners
* Add/Remove Owners
* Manage credentials....
* Revoke consent
* Create an application (TBD)

## Pre-requisites
* node.js
* An azure active directory instance

## Usage
appcheck --help

appcheck login
appcheck logout
appcheck dump (writes token if logged in)
appcheck authZUris -a [app/clientid] -r [redirectUri]
appcheck healthcheck -a [app/clientid]
appcheck export -a [app/clientid]

## Next up
appcheck owners
appcheck owners add -u [userid]
appcheck owners remove -u [userid]

appcheck passwordCredentials
appcheck passwordCredentials add -p [password] -m [memo]
appcheck passwordCrednetials remove -o [objectId]

etc....

## Notes:

None of this would be easy without having been able to auto-generate the wrapper for AAD Graph using the swagger file attached.  You'll see that swagger-js-codegen is a dependency.  A very handy tool.

cheers

shane
