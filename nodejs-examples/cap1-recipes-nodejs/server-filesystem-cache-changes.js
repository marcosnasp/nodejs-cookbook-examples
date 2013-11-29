

var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js' : 'text/javascript',
	'.css' : 'text/css',
	'.html' : 'text/html'
};

var cache = {};
var cacheAndDeliver = function(f, cb) {
	fs.stat(f, function(err, stats) {

		var lastChanged = Date.parse(stats.mtime),
	    isUpdated = (cache[f]) && lastChanged  > cache[f].timestamp;

		if(!cache[f] || isUpdated) {
			fs.readFile(f, function(err, data) {
				console.log('loading ' + f + ' from file');
				if(!err) {
					cache[f] = {content : data, timestamp : Date.now()};
				}
				cb(err, data);
			});
			return;
		}
		console.log('loading ' + f + ' from cache');
		cb(null, cache[f].content);	
	});
};

http.createServer(function(request, response) {
	var lookup = path.basename(decodeURI(request.url)) || 'index.html',
	f = 'content/' + lookup;

	fs.exists(f, function(exists) {
		if(exists) {
			cacheAndDeliver(f, function(err, data) {
				if(err) {
					response.writeHead(500);
					response.end("Server Error!");
					return;
				}

				var headers = {"Content-type" : mimeTypes[path.extname(f)]};
				response.writeHead(200, headers);
				response.end(data);
			});
			return;
		}
		response.writeHead(404); //no such file found!
    	response.end('Page Not Found!');
	});

}).listen(8080);