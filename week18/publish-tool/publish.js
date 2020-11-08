const http = require('http');
const fs = require('fs');
const archiver = require('archiver');

// fs.stat(filename, function (err, stats) {

const request = http.request(
  {
    //hostname: 'box',
    hostname: 'localhost',
    port: 8082,
    method: 'POST',
    headers: {
      //'Content-Type': 'application/octet-stream',
      'Content-Type': 'application/zip',
      //'Content-Length': stats.size,
    },
  },
  (res) => {
    console.debug('response status:\n' + res.statusCode);
    res.on('data', (chunk) => {
      console.debug(chunk.toString());
    });
  }
);

// 压缩目录内容，作为 readable 流
const archive = archiver('zip', {
  zlib: { level: 9 },
});
archive.directory('./dist/', false);
archive.finalize();

//archive.pipe(fs.createWriteStream('tmp.zip'));

archive.pipe(request);

//});
