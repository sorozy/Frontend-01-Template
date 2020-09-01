const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');

let fileName = './package';

let redirectUri = encodeURIComponent('http://localhost:8081/auth');
child_process.exec(`cmd /c start https://github.com/login/oauth/authorize?client_id=Iv1.a626c41089306117&redirect_uri=${redirectUri}&scope=read%3Auser&state=123abc`);

const server = http.createServer((req, res) => {
    let token = req.url.match(/token=([^&]+)/)[1];
    console.log('real publish!!');

    const options = {
        host: 'localhost',
        port: 8081,
        path: '/?filename=package.zip',
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
    
    var archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
    });
    
    archive.directory(fileName, false);
    
    const request = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    });
    
    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    
    archive.pipe(request);
    
    archive.on('end', () => {
        request.end();
        console.log('publish success!!');
        server.close();
    });
    
    archive.finalize();
});

server.listen(8080);
