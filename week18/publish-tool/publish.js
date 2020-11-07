const http = require('http');
const fs = require('fs');

const filename = './sample.html';

fs.stat(filename, function (err, stats) {
  const request = http.request(
    {
      //hostname: 'box',
      hostname: 'localhost',
      port: 8082,
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stats.size,
      },
    },
    (res) => {
      console.debug('response status:\n' + res.statusCode);
      res.on('data', (chunk) => {
        console.debug(chunk.toString());
      });
    }
  );

  const file = fs.createReadStream('./sample.html');
  /* file.on('end', () => {
    request.end();
    console.debug('request sent');
  }); */
  // pipe 函数的选项 end: true 是默认值，上面的代码应该是没必要的
  file.pipe(request, { end: true });
});
