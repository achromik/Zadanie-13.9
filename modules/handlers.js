var fs = require('fs'),
    formidable = require('formidable');

var fileName,
    //path for uploading files
    filePath = './upload/';

exports.upload = function(request, response) {
    console.log('Start handling upload request.');
    var form = new formidable.IncomingForm();
    
    //for multiples upload files TODO 
    form.multiples = true;

    //check if uploading folder exist
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    
    form.parse(request, function(err, fields, files) {
        
        if(files.upload === undefined) {
            console.log('No form sended!'.red);
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.write('<h2>You don\'t send any form!!</h2>');
            response.write('<h2>For uplaoding files go <a href="/">here</a></h2>');
            response.end();
        } else {
            for( var i =0; i < files.upload.length; i++) {
                if (files.upload[i].size) {
                    var readStream = fs.createReadStream(files.upload[i].path);
                    var writeStream = fs.createWriteStream(filePath + files.upload[i].name);
                    readStream.pipe(writeStream);    
                }       
            }
            
            readStream.on('end', function() {
                for( var i =0; i < files.upload.length; i++) {
                    fs.unlinkSync(files.upload[i].path);
                }
            });

            fileName = files.upload[Math.floor(Math.random()*files.upload.length)].name;
            fs.readFile('templates/uploaded-start.html', function(err, html) { 
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write(html + files.upload.length);
                
            });
            fs.readFile('templates/uploaded-end.html', function(err, html) { 
                
                response.write(html);
                response.end();
            });
        }
    });
}

exports.welcome = function(request, response) {
    console.log('Start handling welcome request.');
    fs.readFile('templates/start.html', function(err, html) {
        response.writeHead(200, {'Content-Type' : "text/html; charset=utf-8"});
        response.write(html);
        response.end();
    });
}

exports.error = function(request, response) {
    console.log('I don\'t know what to do!?');
    response.writeHead(404, {'Content-Type' : 'text/html'});
    response.write('404 :(');
    response.end();
}


exports.show = function(request, response) {
    fs.readFile(filePath + fileName, 'binary', function(err, file) {
        response.writeHead(200, {'Content-Type' : 'image/png'});
        response.write(file, "binary");
        response.end();
    });
}

exports.style = function(reguest, response) {
    fs.readFile('templates/style.css', function(err, style) {
        response.writeHead(200, {'Content-Type' : "text/css"});
        response.write(style);
        response.end();
    });
}
