// Requer o modulo npm: hotnode 
// exemplo com path multinivel

var http = require('http');
var url = require('url');

var pages = [
	{id: '1', route : '/', output : 'Woohoo!'},
	{id: '2', route : '/about/this', output: 'multilevel routing with node'},
	{id: '3', route : '/about/node', output: 'Evented I/O for V8 Javascript'},
	{id: '4', route : '/another page', output: function() { return 'Here \'s ' + this.route}}
];	

http.createServer(function (request, response) {
	var id = url.parse(decodeURI(request.url), true).query.id;

	if(id) {
		pages.forEach(function(page) {
			if(page.id === id) {
				response.writeHead(200, {'Content-Type' : 'text/html'});
				response.end(typeof page.output === 'function' ? page.output() : page.output);				
			}
		});
	}

	if(!response.finished) {
		response.writeHead(404);
		response.end('Page not found');
	}
}).listen(8080);