//a.js
var b = require('js/b.js')
var name = 'a.js'

console.log(name)
b.getName()
exports.getName = function() {
	console.log(name)
}