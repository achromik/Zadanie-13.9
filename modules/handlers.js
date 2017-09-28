var fs = require('fs'),
    formidable = require('formidable');


exports.upload = function(request, response) {
    console.log('Start handling upload request.');
    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files) {

        /**** when script is on another partition this line generate: "Error: EXDEV, cross-device link not permitted" */
        //fs.renameSync(files.upload.path, "test.png");
        
        /**** alterante version for line above whit no "Error: EXDEV, cross-device link not permitted"  */
        var readStream = fs.createReadStream(files.upload.path);
        var writeStream = fs.createWriteStream(fields.title.trim() || files.upload.name);
        readStream.pipe(writeStream);
        readStream.on('end', function() {
            fs.unlinkSync(files.upload.path);
        });
        //*** end of alternate version */
        
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('received image:<br>');
        response.write('<img src="/show"/>')
        response.end();
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
    fs.readFile('test.png', 'binary', function(err, file) {
        response.writeHead(200, {'Content-Type' : 'image/png'});
        response.write(file, "binary");
        response.end();
    });
}
