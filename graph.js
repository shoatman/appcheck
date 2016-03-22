/*jshint -W069 */
/**
 * Identity and access management services
 * @class AADGraph
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var AADGraph = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function AADGraph(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
    }

    /**
     * Retrieves a list of users in Azure Active Directory based on provided oData query paramters including: $filter, $orderby, $top
     * @method
     * @name AADGraph#GetUsers
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} $filter - The oData v3.0 filter statement.  Controls which objects are returned.
     * @param {integer} $top - The maximum number of records to return.
     * @param {string} $orderby - The oData v3.0 orderby statement.  Controls the order in which the results are returned.
     * 
     */
    AADGraph.prototype.GetUsers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters['$filter'] !== undefined) {
            queryParameters['$filter'] = parameters['$filter'];
        }

        if (parameters['$top'] !== undefined) {
            queryParameters['$top'] = parameters['$top'];
        }

        if (parameters['$orderby'] !== undefined) {
            queryParameters['$orderby'] = parameters['$orderby'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Creates a new user in Azure Active Directory.
     * @method
     * @name AADGraph#CreateUser
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {} user - New user
     * 
     */
    AADGraph.prototype.CreateUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['user'] !== undefined) {
            body = parameters['user'];
        }

        if (parameters['user'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: user'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retreives a specific user (user object) from Azure Active Directory by objectId or UPN.
     * @method
     * @name AADGraph#GetUser
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Updates a user (user object) identified by objectId or UPN in Azure Active Directory
     * @method
     * @name AADGraph#UpdateUser
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * @param {} user - user with updated fields
     * 
     */
    AADGraph.prototype.UpdateUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['user'] !== undefined) {
            body = parameters['user'];
        }

        if (parameters['user'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: user'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'PATCH',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Deletes a user (user object) identified by objectId or UPN in Azure Active Directory
     * @method
     * @name AADGraph#DeleteUser
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.DeleteUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves the manager of a user from Azure Active Directory.  A manager can be a user or contact object.
     * @method
     * @name AADGraph#GetUserManager
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserManager = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/manager';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Updates the user's manager in Azure Active Directory.  A manager can be a user or contact object.
     * @method
     * @name AADGraph#UpdateUserManager
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * @param {} link - a link to a specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.UpdateUserManager = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/$links/manager';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['link'] !== undefined) {
            body = parameters['link'];
        }

        if (parameters['link'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: link'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'PUT',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Deletes the user's manager in Azure Active Directory.  A manager can be a user or contact object.
     * @method
     * @name AADGraph#DeleteUserManager
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.DeleteUserManager = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/$links/manager';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the user's direct reports.  Direct reports are users who have their manager attribute set to the current user.
     * @method
     * @name AADGraph#GetUserDirectReports
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserDirectReports = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/directReports';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a list of groups and directory roles that the user is a member of.
     * @method
     * @name AADGraph#GetUserMemberships
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserMemberships = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/memberOf';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get registered devices owned by the user.
     * @method
     * @name AADGraph#GetUserOwnedDevices
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserOwnedDevices = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/ownedDevices';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get registered devices registered by the user.
     * @method
     * @name AADGraph#GetUserRegisteredDevices
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserRegisteredDevices = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/registeredDevices';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the list of the oAuth2PermissionGrants that the user granted applications.  These permissions are typically granted when an application asked for a specific permission to a resource that the user has discretion over.
     * @method
     * @name AADGraph#GetUserOAuth2PermissionGrants
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserOAuth2PermissionGrants = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/oauth2PermissionGrants';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get objects created by the user.
     * @method
     * @name AADGraph#GetUserCreatedObjects
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserCreatedObjects = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/createdObjects';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get objects owned by the user.
     * @method
     * @name AADGraph#GetUserOwnedObjects
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserOwnedObjects = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/ownedObjects';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get user application role assignments.
     * @method
     * @name AADGraph#GetUserAppRoleAssignments
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserAppRoleAssignments = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/appRoleAssignments';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Assign a user to an application role.  If no roles exist use guid.empty (all 0000)
     * @method
     * @name AADGraph#CreateUserAppRoleAssignment
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * @param {} appRoleAssignment - New app role assignment
     * 
     */
    AADGraph.prototype.CreateUserAppRoleAssignment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/appRoleAssignments';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['appRoleAssignment'] !== undefined) {
            body = parameters['appRoleAssignment'];
        }

        if (parameters['appRoleAssignment'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appRoleAssignment'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete a user application role assignment.
     * @method
     * @name AADGraph#DeleteUserAppRoleAssignment
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * @param {string} objectId - The unique identifier of the object specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.DeleteUserAppRoleAssignment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/appRoleAssignments/{objectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        path = path.replace('{objectId}', parameters['objectId']);

        if (parameters['objectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: objectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get user extension properties
     * @method
     * @name AADGraph#GetUserExtensionProperties
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * 
     */
    AADGraph.prototype.GetUserExtensionProperties = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/extensionProperties';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add and remove one or more licenses for a Microsoft online service to the list of assigned licenses for the user.
     * @method
     * @name AADGraph#SetUserLicenses
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * @param {} licensesParam - A list of licenses to be assigned and those to be removed.
     * 
     */
    AADGraph.prototype.SetUserLicenses = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/assignLicense';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['licensesParam'] !== undefined) {
            body = parameters['licensesParam'];
        }

        if (parameters['licensesParam'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: licensesParam'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * From a list of groups Ids select those that the user is a member of.
     * @method
     * @name AADGraph#SelectAzureADGroupIdsUserIsMemberOf
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} userId - The unique identifier of a user in Azure Active Directory (UPN or ObjectId)
     * @param {} checkMemberGroupsParam - A list of groups object ids.
     * 
     */
    AADGraph.prototype.SelectAzureADGroupIdsUserIsMemberOf = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/users/{userId}/checkMemberGroups';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['checkMemberGroupsParam'] !== undefined) {
            body = parameters['checkMemberGroupsParam'];
        }

        if (parameters['checkMemberGroupsParam'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: checkMemberGroupsParam'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves a list of subscribed skus (subscriptions) to Microsoft services.
     * @method
     * @name AADGraph#GetSubscribedSkus
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * 
     */
    AADGraph.prototype.GetSubscribedSkus = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/subscribedSkus';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves the details of a tenant in Azure Active Directory
     * @method
     * @name AADGraph#GetTenantDetails
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * 
     */
    AADGraph.prototype.GetTenantDetails = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/tenantDetails';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves the list of trusted certificate authorities for a tenant in Azure Active Directory
     * @method
     * @name AADGraph#GetTrustedCertificateAuthorities
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * 
     */
    AADGraph.prototype.GetTrustedCertificateAuthorities = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/tenantDetails/{tenantId}/trustedCAsForPasswordlessAuth';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Creates a new trusted certificate authority in Azure Active Directory.
     * @method
     * @name AADGraph#CreateAzureADTrustedCertificateAuthority
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {} certificateAuthority - New trusted certificate authority
     * 
     */
    AADGraph.prototype.CreateAzureADTrustedCertificateAuthority = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/tenantDetails/{tenantId}/trustedCAsForPasswordlessAuth';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['certificateAuthority'] !== undefined) {
            body = parameters['certificateAuthority'];
        }

        if (parameters['certificateAuthority'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: certificateAuthority'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves a list of directory role templates in Azure Active Directory
     * @method
     * @name AADGraph#GetDirectoryRoleTemplates
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * 
     */
    AADGraph.prototype.GetDirectoryRoleTemplates = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/directoryRoleTemplate';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves a list of director roles in Azure Active Directory based on provided oData query paramters including: $filter, $orderby, $top
     * @method
     * @name AADGraph#GetDirectoryRoles
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * 
     */
    AADGraph.prototype.GetDirectoryRoles = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/directoryRoles';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Activates an existing directory role in Azure Active Directory.
     * @method
     * @name AADGraph#ActivateDirectoryRole
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {} directoryRole - Azure active directory role.  Only the roleTemplateId is required.
     * 
     */
    AADGraph.prototype.ActivateDirectoryRole = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/directoryRoles';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['directoryRole'] !== undefined) {
            body = parameters['directoryRole'];
        }

        if (parameters['directoryRole'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: directoryRole'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retreives a specific directory role (directory role object) from Azure Active Directory by objectId.
     * @method
     * @name AADGraph#GetDirectoryRole
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} directoryRoleId - The unique identifier of a directory role in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetDirectoryRole = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/directoryRole/{directoryRoleId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{directoryRoleId}', parameters['directoryRoleId']);

        if (parameters['directoryRoleId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: directoryRoleId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the members of a directory role.
     * @method
     * @name AADGraph#GetAzureADDirectoryRoleMembers
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} directoryRoleId - The unique identifier of a directory role in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetAzureADDirectoryRoleMembers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/directoryRole/{directoryRoleId}/members';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{directoryRoleId}', parameters['directoryRoleId']);

        if (parameters['directoryRoleId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: directoryRoleId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add a member to a directory role.  (User, Group, Contact)
     * @method
     * @name AADGraph#AddDirectoryRoleMember
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} directoryRoleId - The unique identifier of a directory role in Azure Active Directory (ObjectId)
     * @param {} link - a link to a specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.AddDirectoryRoleMember = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/directoryRole/{directoryRoleId}/$links/members';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{directoryRoleId}', parameters['directoryRoleId']);

        if (parameters['directoryRoleId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: directoryRoleId'));
            return deferred.promise;
        }

        if (parameters['link'] !== undefined) {
            body = parameters['link'];
        }

        if (parameters['link'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: link'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Removes a specific member of a directory role.
     * @method
     * @name AADGraph#RemoveDirectoryMember
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} directoryRoleId - The unique identifier of a directory role in Azure Active Directory (ObjectId)
     * @param {string} objectId - The unique identifier of the object specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.RemoveDirectoryMember = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/directoryRole/{directoryRoleId}/$links/members/{objectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{directoryRoleId}', parameters['directoryRoleId']);

        if (parameters['directoryRoleId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: directoryRoleId'));
            return deferred.promise;
        }

        path = path.replace('{objectId}', parameters['objectId']);

        if (parameters['objectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: objectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves a list of contacts in Azure Active Directory based on provided oData query paramters including: $filter, $orderby, $top
     * @method
     * @name AADGraph#GetContacts
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} $filter - The oData v3.0 filter statement.  Controls which objects are returned.
     * @param {integer} $top - The maximum number of records to return.
     * @param {string} $orderby - The oData v3.0 orderby statement.  Controls the order in which the results are returned.
     * 
     */
    AADGraph.prototype.GetContacts = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters['$filter'] !== undefined) {
            queryParameters['$filter'] = parameters['$filter'];
        }

        if (parameters['$top'] !== undefined) {
            queryParameters['$top'] = parameters['$top'];
        }

        if (parameters['$orderby'] !== undefined) {
            queryParameters['$orderby'] = parameters['$orderby'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Creates a new contact in Azure Active Directory.
     * @method
     * @name AADGraph#CreateContact
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {} contact - New contact
     * 
     */
    AADGraph.prototype.CreateContact = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['contact'] !== undefined) {
            body = parameters['contact'];
        }

        if (parameters['contact'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contact'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retreives a specific contact (contact object) from Azure Active Directory by objectId.
     * @method
     * @name AADGraph#GetContact
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetContact = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Updates a contact (contact object) identified by objectId
     * @method
     * @name AADGraph#UpdateContact
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * @param {} contact - contact with updated fields
     * 
     */
    AADGraph.prototype.UpdateContact = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters['contact'] !== undefined) {
            body = parameters['contact'];
        }

        if (parameters['contact'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contact'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'PATCH',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Deletes a contact (contact object) identified by objectId
     * @method
     * @name AADGraph#DeleteContact
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.DeleteContact = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves the manager of a contact from Azure Active Directory.  A manager can be a user or contact object.
     * @method
     * @name AADGraph#GetContactManager
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetContactManager = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}/manager';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Updates the contact's manager in Azure Active Directory.  A manager can be a user or contact object.
     * @method
     * @name AADGraph#UpdateContactManager
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * @param {} link - a link to a specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.UpdateContactManager = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}/$links/manager';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters['link'] !== undefined) {
            body = parameters['link'];
        }

        if (parameters['link'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: link'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'PUT',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Deletes the contact's manager in Azure Active Directory.  A manager can be a user or contact object.
     * @method
     * @name AADGraph#DeleteContactManager
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.DeleteContactManager = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}/$links/manager';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the contact's direct reports.  Direct reports are users who have their manager attribute set to the current contact.
     * @method
     * @name AADGraph#GetContactDirectReports
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetContactDirectReports = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}/directReports';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a list of groups and directory roles that the contact is a member of.
     * @method
     * @name AADGraph#GetContactMemberships
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetContactMemberships = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}/memberOf';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * From a list of groups Ids select those that the contact is a member of.
     * @method
     * @name AADGraph#SelectAzureADGroupIdsContactIsMemberOf
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} contactId - The unique identifier of a contact in Azure Active Directory (ObjectId)
     * @param {} checkMemberGroupsParam - A list of groups object ids.
     * 
     */
    AADGraph.prototype.SelectAzureADGroupIdsContactIsMemberOf = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/contacts/{contactId}/checkMemberGroups';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{contactId}', parameters['contactId']);

        if (parameters['contactId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: contactId'));
            return deferred.promise;
        }

        if (parameters['checkMemberGroupsParam'] !== undefined) {
            body = parameters['checkMemberGroupsParam'];
        }

        if (parameters['checkMemberGroupsParam'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: checkMemberGroupsParam'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retrieves a list of devices in Azure Active Directory based on provided oData query paramters including: $filter, $orderby, $top
     * @method
     * @name AADGraph#GetDevices
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} $filter - The oData v3.0 filter statement.  Controls which objects are returned.
     * @param {integer} $top - The maximum number of records to return.
     * @param {string} $orderby - The oData v3.0 orderby statement.  Controls the order in which the results are returned.
     * 
     */
    AADGraph.prototype.GetDevices = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/devices';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters['$filter'] !== undefined) {
            queryParameters['$filter'] = parameters['$filter'];
        }

        if (parameters['$top'] !== undefined) {
            queryParameters['$top'] = parameters['$top'];
        }

        if (parameters['$orderby'] !== undefined) {
            queryParameters['$orderby'] = parameters['$orderby'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Creates a new device in Azure Active Directory.
     * @method
     * @name AADGraph#CreateDevice
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {} device - New device
     * 
     */
    AADGraph.prototype.CreateDevice = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/devices';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['device'] !== undefined) {
            body = parameters['device'];
        }

        if (parameters['device'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: device'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Retreives a specific device (device object) from Azure Active Directory by objectId.
     * @method
     * @name AADGraph#GetDevice
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} deviceId - The unique identifier of a device in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetDevice = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/devices/{deviceId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{deviceId}', parameters['deviceId']);

        if (parameters['deviceId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Updates a device (device object) identified by objectId
     * @method
     * @name AADGraph#UpdateDevice
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} deviceId - The unique identifier of a device in Azure Active Directory (ObjectId)
     * @param {} device - device with updated fields
     * 
     */
    AADGraph.prototype.UpdateDevice = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/devices/{deviceId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{deviceId}', parameters['deviceId']);

        if (parameters['deviceId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }

        if (parameters['device'] !== undefined) {
            body = parameters['device'];
        }

        if (parameters['device'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: device'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'PATCH',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Deletes a device (device object) identified by objectId
     * @method
     * @name AADGraph#DeleteDevice
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} deviceId - The unique identifier of a device in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.DeleteDevice = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/devices/{deviceId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{deviceId}', parameters['deviceId']);

        if (parameters['deviceId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: deviceId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the list of oAuth2PermissionGrants granted by users within the directory.  These permissions are typically granted when an application asked for a specific permission to a resource that the user has discretion over.
     * @method
     * @name AADGraph#GetOAuth2PermissionGrants
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * 
     */
    AADGraph.prototype.GetOAuth2PermissionGrants = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/oauth2PermissionGrants';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete an oAuth2PermissionGrant.  These permissions are typically granted when an application asked for a specific permission to a resource that the user has discretion over.
     * @method
     * @name AADGraph#DeleteOAuth2PermissionGrant
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} oAuth2PermissionGrantId - The unique identifier of an oAuth2PermissionGrant in Azure Active Directory
     * 
     */
    AADGraph.prototype.DeleteOAuth2PermissionGrant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/oauth2PermissionGrants/{oAuth2PermissionGrantId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{oAuth2PermissionGrantId}', parameters['oAuth2PermissionGrantId']);

        if (parameters['oAuth2PermissionGrantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: oAuth2PermissionGrantId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a list of all groups within the directory.
     * @method
     * @name AADGraph#GetGroups
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} $filter - The oData v3.0 filter statement.  Controls which objects are returned.
     * @param {integer} $top - The maximum number of records to return.
     * @param {string} $orderby - The oData v3.0 orderby statement.  Controls the order in which the results are returned.
     * 
     */
    AADGraph.prototype.GetGroups = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters['$filter'] !== undefined) {
            queryParameters['$filter'] = parameters['$filter'];
        }

        if (parameters['$top'] !== undefined) {
            queryParameters['$top'] = parameters['$top'];
        }

        if (parameters['$orderby'] !== undefined) {
            queryParameters['$orderby'] = parameters['$orderby'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Create a new group in Azure Active Directory.
     * @method
     * @name AADGraph#CreateGroup
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {} group - New group
     * 
     */
    AADGraph.prototype.CreateGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['group'] !== undefined) {
            body = parameters['group'];
        }

        if (parameters['group'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: group'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a group by objectId from Azure Active Directory
     * @method
     * @name AADGraph#GetGroup
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete a group by objectId.
     * @method
     * @name AADGraph#DeleteGroup
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.DeleteGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Updates a group (group object) identified by objectId in Azure Active Directory
     * @method
     * @name AADGraph#UpdateGroup
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * @param {} group - group with updated fields
     * 
     */
    AADGraph.prototype.UpdateGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['group'] !== undefined) {
            body = parameters['group'];
        }

        if (parameters['group'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: group'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'PATCH',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the owners of a group.
     * @method
     * @name AADGraph#GetGroupOwners
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetGroupOwners = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}/owners';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add an owner to a group.
     * @method
     * @name AADGraph#AddGroupOwner
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * @param {} link - a link to a specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.AddGroupOwner = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}/$links/owners';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['link'] !== undefined) {
            body = parameters['link'];
        }

        if (parameters['link'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: link'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Removes an owner from a group.
     * @method
     * @name AADGraph#RemoveGroupOwner
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * @param {string} objectId - The unique identifier of the object specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.RemoveGroupOwner = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}/$links/owners/{objectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{objectId}', parameters['objectId']);

        if (parameters['objectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: objectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get group application role assignments.
     * @method
     * @name AADGraph#GetGroupAppRoleAssignments
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetGroupAppRoleAssignments = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}/appRoleAssignments';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Assign a groups of users to an application role.  If no roles exist use guid.empty (all 0000)
     * @method
     * @name AADGraph#CreateGroupAppRoleAssignment
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * @param {} appRoleAssignment - New app role assignment
     * 
     */
    AADGraph.prototype.CreateGroupAppRoleAssignment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}/appRoleAssignments';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['appRoleAssignment'] !== undefined) {
            body = parameters['appRoleAssignment'];
        }

        if (parameters['appRoleAssignment'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appRoleAssignment'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete a group application role assignment.
     * @method
     * @name AADGraph#DeleteGroupAppRoleAssignment
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * @param {string} objectId - The unique identifier of the object specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.DeleteGroupAppRoleAssignment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}/appRoleAssignments/{objectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{objectId}', parameters['objectId']);

        if (parameters['objectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: objectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get group extension properties
     * @method
     * @name AADGraph#GetGroupExtensionProperties
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * 
     */
    AADGraph.prototype.GetGroupExtensionProperties = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}/extensionProperties';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * From a list of groups Ids select those that the group is a member of.
     * @method
     * @name AADGraph#SelectAzureADGroupIdsGroupIsMemberOf
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} groupId - The unique identifier of a group in Azure Active Directory (ObjectId)
     * @param {} checkMemberGroupsParam - A list of groups object ids.
     * 
     */
    AADGraph.prototype.SelectAzureADGroupIdsGroupIsMemberOf = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/groups/{groupId}/checkMemberGroups';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['checkMemberGroupsParam'] !== undefined) {
            body = parameters['checkMemberGroupsParam'];
        }

        if (parameters['checkMemberGroupsParam'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: checkMemberGroupsParam'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a list of all applications within the directory.
     * @method
     * @name AADGraph#GetApplications
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} $filter - The oData v3.0 filter statement.  Controls which objects are returned.
     * @param {integer} $top - The maximum number of records to return.
     * @param {string} $orderby - The oData v3.0 orderby statement.  Controls the order in which the results are returned.
     * 
     */
    AADGraph.prototype.GetApplications = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters['$filter'] !== undefined) {
            queryParameters['$filter'] = parameters['$filter'];
        }

        if (parameters['$top'] !== undefined) {
            queryParameters['$top'] = parameters['$top'];
        }

        if (parameters['$orderby'] !== undefined) {
            queryParameters['$orderby'] = parameters['$orderby'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Create a new application in Azure Active Directory.
     * @method
     * @name AADGraph#CreateApplication
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {} application - New application
     * 
     */
    AADGraph.prototype.CreateApplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['application'] !== undefined) {
            body = parameters['application'];
        }

        if (parameters['application'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: application'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get an application by objectId from Azure Active Directory
     * @method
     * @name AADGraph#GetApplication
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetApplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete an application by objectId.
     * @method
     * @name AADGraph#DeleteApplication
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.DeleteApplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Updates an application (application object) identified by objectId in Azure Active Directory
     * @method
     * @name AADGraph#UpdateApplication
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {} application - application with updated fields
     * 
     */
    AADGraph.prototype.UpdateApplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        if (parameters['application'] !== undefined) {
            body = parameters['application'];
        }

        if (parameters['application'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: application'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'PATCH',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get group extension properties
     * @method
     * @name AADGraph#GetApplicationExtensionProperties
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetApplicationExtensionProperties = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}/extensionProperties';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get application extension property
     * @method
     * @name AADGraph#CreateApplicationExtensionProperty
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {} extensionProperty - New extension property
     * 
     */
    AADGraph.prototype.CreateApplicationExtensionProperty = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}/extensionProperties';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        if (parameters['extensionProperty'] !== undefined) {
            body = parameters['extensionProperty'];
        }

        if (parameters['extensionProperty'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: extensionProperty'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete an application extension property.
     * @method
     * @name AADGraph#DeleteApplicationExtensionProperty
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {string} objectId - The unique identifier of the object specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.DeleteApplicationExtensionProperty = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}/extensionProperties/{objectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        path = path.replace('{objectId}', parameters['objectId']);

        if (parameters['objectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: objectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the owners of an application.
     * @method
     * @name AADGraph#GetApplicationOwners
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetApplicationOwners = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}/owners';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add an owner to an application.
     * @method
     * @name AADGraph#AddApplicationOwner
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {} link - a link to a specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.AddApplicationOwner = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}/$links/owners';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        if (parameters['link'] !== undefined) {
            body = parameters['link'];
        }

        if (parameters['link'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: link'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Removes an owner from an application.
     * @method
     * @name AADGraph#RemoveApplicationOwner
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} appObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {string} objectId - The unique identifier of the object specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.RemoveApplicationOwner = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/applications/{appObjectId}/$links/owners/{objectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{appObjectId}', parameters['appObjectId']);

        if (parameters['appObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appObjectId'));
            return deferred.promise;
        }

        path = path.replace('{objectId}', parameters['objectId']);

        if (parameters['objectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: objectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a list of all applications within the directory.
     * @method
     * @name AADGraph#GetServicePrincipals
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} $filter - The oData v3.0 filter statement.  Controls which objects are returned.
     * @param {integer} $top - The maximum number of records to return.
     * @param {string} $orderby - The oData v3.0 orderby statement.  Controls the order in which the results are returned.
     * 
     */
    AADGraph.prototype.GetServicePrincipals = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        if (parameters['$filter'] !== undefined) {
            queryParameters['$filter'] = parameters['$filter'];
        }

        if (parameters['$top'] !== undefined) {
            queryParameters['$top'] = parameters['$top'];
        }

        if (parameters['$orderby'] !== undefined) {
            queryParameters['$orderby'] = parameters['$orderby'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Create a new application in Azure Active Directory.
     * @method
     * @name AADGraph#CreateServicePrincipal
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {} group - New service principal
     * 
     */
    AADGraph.prototype.CreateServicePrincipal = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['group'] !== undefined) {
            body = parameters['group'];
        }

        if (parameters['group'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: group'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a service principal by objectId from Azure Active Directory
     * @method
     * @name AADGraph#GetServicePrincipal
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetServicePrincipal = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete an application by objectId.
     * @method
     * @name AADGraph#DeleteServicePrincipal
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.DeleteServicePrincipal = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Updates a service principal (service principal object) identified by objectId in Azure Active Directory
     * @method
     * @name AADGraph#UpdateServicePrincipal
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {} group - service principal with updated fields
     * 
     */
    AADGraph.prototype.UpdateServicePrincipal = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters['group'] !== undefined) {
            body = parameters['group'];
        }

        if (parameters['group'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: group'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'PATCH',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get service principal extension properties
     * @method
     * @name AADGraph#GetServicePrincipalExtensionProperties
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetServicePrincipalExtensionProperties = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/extensionProperties';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the owners of a service principal.
     * @method
     * @name AADGraph#GetServicePrincipalOwners
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetServicePrincipalOwners = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/owners';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add an owner to a service principal.
     * @method
     * @name AADGraph#AddServicePrincipalOwner
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {} link - a link to a specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.AddServicePrincipalOwner = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/$links/owners';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters['link'] !== undefined) {
            body = parameters['link'];
        }

        if (parameters['link'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: link'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Removes an owner from a service principal.
     * @method
     * @name AADGraph#RemoveServicePrincipalOwner
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {string} objectId - The unique identifier of the object specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.RemoveServicePrincipalOwner = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/$links/owners/{objectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        path = path.replace('{objectId}', parameters['objectId']);

        if (parameters['objectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: objectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a list of groups and directory roles that the service principal is a member of.
     * @method
     * @name AADGraph#GetServicePrincipalMemberships
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetServicePrincipalMemberships = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/memberOf';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get the list of the oAuth2PermissionGrants that the user granted this service principal.  These permissions are typically granted when an application asked for a specific permission to a resource that the user has discretion over.
     * @method
     * @name AADGraph#GetServicePrincipalOAuth2PermissionGrants
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetServicePrincipalOAuth2PermissionGrants = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/oauth2PermissionGrants';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get objects created by the service principal.
     * @method
     * @name AADGraph#GetServicePrincipalCreatedObjects
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetServicePrincipalCreatedObjects = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/createdObjects';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get objects owned by the service principal.
     * @method
     * @name AADGraph#GetServicePrincipalOwnedObjects
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetServicePrincipalOwnedObjects = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/ownedObjects';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get user application role assignments.  Yes service principals can be assigned to application roles.
     * @method
     * @name AADGraph#GetServicePrincipalAppRoleAssignments
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} $skiptoken - Skiptoken use to page forward through a large result set..
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * 
     */
    AADGraph.prototype.GetServicePrincipalAppRoleAssignments = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/appRoleAssignments';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        if (parameters['$skiptoken'] !== undefined) {
            queryParameters['$skiptoken'] = parameters['$skiptoken'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Assign a service principal to an application role.  If no roles exist use guid.empty (all 0000)
     * @method
     * @name AADGraph#CreateServicePrincipalAppRoleAssignment
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {} appRoleAssignment - New app role assignment
     * 
     */
    AADGraph.prototype.CreateServicePrincipalAppRoleAssignment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/appRoleAssignments';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters['appRoleAssignment'] !== undefined) {
            body = parameters['appRoleAssignment'];
        }

        if (parameters['appRoleAssignment'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: appRoleAssignment'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete a service principal application role assignment.
     * @method
     * @name AADGraph#DeleteServicePrincipalAppRoleAssignment
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {string} objectId - The unique identifier of the object specific Azure Active Directory object
     * 
     */
    AADGraph.prototype.DeleteServicePrincipalAppRoleAssignment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/appRoleAssignments/{objectId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        path = path.replace('{objectId}', parameters['objectId']);

        if (parameters['objectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: objectId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'DELETE',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * From a list of groups Ids select those that the service principal is a member of.
     * @method
     * @name AADGraph#SelectAzureADGroupIdsServicePrincipalIsMemberOf
     * @param {string} tenantId - The ID of the tenant of instance of Azure Active Directory
     * @param {string} Authorization - Contains the bearer token used to authorize access to the API.
     * @param {string} apiVersion - Specifies the version of the API that you would like to use.
     * @param {string} spObjectId - THe unique idenfier of an application in Azure Active Directory
     * @param {} checkMemberGroupsParam - A list of groups object ids.
     * 
     */
    AADGraph.prototype.SelectAzureADGroupIdsServicePrincipalIsMemberOf = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/{tenantId}/servicePrincipals/{spObjectId}/checkMemberGroups';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tenantId'));
            return deferred.promise;
        }

        if (parameters['Authorization'] !== undefined) {
            headers['Authorization'] = parameters['Authorization'];
        }

        if (parameters['Authorization'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: Authorization'));
            return deferred.promise;
        }

        if (parameters['apiVersion'] !== undefined) {
            queryParameters['api-version'] = parameters['apiVersion'];
        }

        path = path.replace('{spObjectId}', parameters['spObjectId']);

        if (parameters['spObjectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: spObjectId'));
            return deferred.promise;
        }

        if (parameters['checkMemberGroupsParam'] !== undefined) {
            body = parameters['checkMemberGroupsParam'];
        }

        if (parameters['checkMemberGroupsParam'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: checkMemberGroupsParam'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };

    return AADGraph;
})();

exports.AADGraph = AADGraph;