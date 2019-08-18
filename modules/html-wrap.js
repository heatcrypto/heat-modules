/**
 * Author: dennis@heatledger.com 2019
 * 
 * Build utility that reads the contents of one bundle.js and embeds that
 * into an html file named after the blockchain and package version. * 
 * Package version and name are obtained from package.json.
 */
var fs = require('fs');
var path = require('path');
var bundleFilePath = path.join(process.cwd(), 'bundle.es5.js');
var pkgJson = require(path.join(process.cwd(), 'package.json'));
var moduleName = pkgJson.name;
var moduleVersion = pkgJson.version;
var outputFile = path.join(process.cwd(), `${moduleName}.${moduleVersion}.html`);
// var outputFileMin = path.join(process.cwd(), `${moduleName}.${moduleVersion}.min.html`);
// var UglifyJS = require("uglify-js");

fs.readFile(bundleFilePath, 'utf8', function(err, contents) {
  if (err) {
    console.error(err)
  }
  else {
    var htmlContents = wrapJsCode(contents);
    fs.writeFile(outputFile, htmlContents, { encoding: 'utf8' }, (err) => {
      if (err) console.log(err);
    });
  }
});

function wrapJsCode(jsCode) {
  // Note that we include an UTF8 BOM at the start or risk failure 
  // on certain chars loaded on Android
  return `\ufeff<!DOCTYPE html>
<html>
<body>${moduleName}@${moduleVersion}</body>
<head>
<script type="text/javascript">
console = console || {log:function(){},error:function(){}};
${jsCode}
;console.log("Success loading js lib for ${moduleName}@${moduleVersion}");
</script>
</head>
</html>`
}

console.log('Bundle: '+moduleName);
console.log('Version: '+moduleVersion);
