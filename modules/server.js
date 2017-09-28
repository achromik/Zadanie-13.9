var http = require('http'),
    colors = require('colors'),
    handlers = require('./handlers');

function start() {
    function onRequest(request, response) {
        console.log('Received request');
        console.log('Request: ' + request.url.red + ' received.');
        response.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});

        switch (request.url) {
            case '/' :
            case '/start' :
                handlers.welcome(request, response);
                break;
            case '/upload' :
                handlers.upload(request, response);
                break;
            case '/show' :
                handlers.show(request, response);
                break;
            default:
                handlers.error(request, response);        
           
        }
    }

    http.createServer(onRequest).listen(9000);

    console.log('Server started'.green);
}    

exports.start = start;