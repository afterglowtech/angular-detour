var express = require('express');
var app = express();


app.use('/js', express.static(__dirname + '/js'));
app.use('/dist', express.static(__dirname + '/../../dist'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/partials', express.static(__dirname + '/partials'));

app.get('/svc/getRoute', function(req, res, next) {
  res.sendfile('sample-routes.json');
});

app.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: __dirname });
});

app.listen(3006); //the port you want to use
