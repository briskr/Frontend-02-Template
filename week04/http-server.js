const http = require('http');

const port = 8088;
http
  .createServer((request, response) => {
    let reqData = [];
    request
      .on('error', (err) => {
        console.error(err);
      })
      .on('data', (chunk) => {
        //console.debug('chunk', chunk.toString());
        reqData.push(chunk);
      })
      .on('end', () => {
        const reqText = Buffer.concat(reqData).toString();
        console.log('body:', reqText);

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(`<html lang='en'>
<head>
  <meta charset="UTF-8"/>
  <title>Document</title>
  <style>
  body div #myid {
    width: 100px;
    background-color: #ff5000;
  }
  </style>
</head>
<body class='dark'>
  <p>Hello, World</p>
  <img id=myid/>
  <img />
</body>
</html>`);
      });
  })
  .listen(port);

console.log(`Server listening on localhost:${port}... (press Ctrl-C to exit)`);
