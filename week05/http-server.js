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
#container {
  width: 500px;
  height: 300px;
  display: flex;
}
#container #myid {
  width: 200px;
}
#container .c1 {
  flex: 1;
}
  </style>
</head>
<body>
  <div id="container">
    <div id="myid"/>
    <div class="c1" />
  </div>
</body>
</html>`);
      });
  })
  .listen(port);

console.log(`Server listening on localhost:${port}... (press Ctrl-C to exit)`);
