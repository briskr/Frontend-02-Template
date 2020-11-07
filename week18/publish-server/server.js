const http = require('http');
const fs = require('fs');

http
  .createServer(function (req, res) {
    console.log('content-length', req.headers['content-length']);
    const outFile = fs.createWriteStream('../server/public/index.html');
    req.pipe(outFile);
    req.on('end', () => {
      console.log('request finished');
      outFile.end();
    });

    // 保留发送响应
    res.end('success');
  })
  .listen(8082);
