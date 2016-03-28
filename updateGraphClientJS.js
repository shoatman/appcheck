var fs = require('fs');
var CodeGen = require('swagger-js-codegen').CodeGen;
 
var file = 'AzureADSwagger.json';
var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
var nodejsSourceCode = CodeGen.getNodeCode({ className: 'graph', swagger: swagger });

fs.writeFileSync('graph.js',nodejsSourceCode);
