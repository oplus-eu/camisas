import http from 'http';
const server = http.createServer((req, res) => {
  res.end('ok');
});
server.listen(3001, () => {
  console.log('Test server ready on 3001');
});
// Keep it alive
setInterval(() => {}, 1000);
