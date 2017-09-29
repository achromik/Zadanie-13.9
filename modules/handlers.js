var fs = require('fs'),
    formidable = require('formidable');

var fileName,
    //path for uploading files
    filePath = './upload/';

exports.upload = function(request, response) {
    console.log('Start handling upload request.');
    var form = new formidable.IncomingForm();
    form.multiples = true;

    //check if uploading folder exist
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    
    form.parse(request, function(err, fields, files) {
        if(files.upload.size) {

            //set file name 
            fileName = fields.fileName.trim() || files.upload.name;
            //validate fileName 
            fileName = fileName.replace(/[\s]/g, '_').replace(/[\\/:*?<>|]/g, '');

            /**** when script is on another partition this line generate: "Error: EXDEV, cross-device link not permitted" */
            // fs.renameSync(files.upload.path, "test.png");
            
            /**** alterante version for line above whit no "Error: EXDEV, cross-device link not permitted"  */
            var readStream = fs.createReadStream(files.upload.path);
            var writeStream = fs.createWriteStream(filePath + fileName);
            readStream.pipe(writeStream);

            //when uploadin delete temporary file 
            readStream.on('end', function() {
                fs.unlinkSync(files.upload.path);
            });
            //*** end of alternate version */
            
            fs.readFile('templates/uploaded.html', function(err, html) { 
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write(html);
                response.end();
            });
        } else {
            console.log('File size ZERO or no file!'.red);
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.write('File size ZERO or no file!');
            response.end()
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
