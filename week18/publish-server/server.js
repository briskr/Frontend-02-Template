let http = require('http');

http
  .createServer(function (req, res) {
    console.log(req.url);
    console.log('Headers:');
    console.log(req.headers);
    console.log();
    req.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    req.on('end', (chunk) => {
      res.end('success');
    });
  })
  .listen(8082);
