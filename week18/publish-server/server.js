const http = require('http');
const fs = require('fs');
const unzipper = require('unzipper');

http
  .createServer(function (req, res) {
    console.debug('request received');
    console.log('content-type', req.headers['content-type']);

    // 读完 request 之后再发回响应，否则 pipe 过程没结束，文件收不完整
    req.on('end', () => {
      res.end('success');
    });

    // 输出到文件
    //let outFile = fs.createWriteStream('../server/public/tmp.zip');
    //req.pipe(outFile, { end: true });

    // 输出到 unzipper ，解压出包里的内容
    req.pipe(unzipper.Extract({ path: '../server/public/' }));
  })
  .listen(8082);
