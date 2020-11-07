const http = require('http');
const fs = require('fs');

const request = http.request(
  {
    hostname: 'box',
    port: 8082,
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
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
file.on('data', (chunk) => {
  console.log('on data');
  console.log(chunk.toString());
  request.write(chunk);
});
file.on('end', (chunk) => {
  console.log('read finished');
  request.end(chunk);
});
