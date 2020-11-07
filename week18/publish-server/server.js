const http = require('http');
const fs = require('fs');

http
  .createServer(function (req, res) {
    console.log(req.headers);

    const outFile = fs.createWriteStream('../server/public/index.html');

    req.on('data', (chunk) => {
      console.log(chunk.toString());
      outFile.write(chunk);
    });
    req.on('end', () => {
      outFile.end();
      res.end('success');
    });
  })
  .listen(8082);
