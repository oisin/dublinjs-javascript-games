var connect = require('connect');
var app = connect()
  .use(connect.static(__dirname + '/content'))
  .listen(3000);
