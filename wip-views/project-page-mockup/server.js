var express = require('express');
var nunjucks = require ('nunjucks');
var app = express();

app.listen(8000);

nunjucks.configure('views', {
  express:app,
  autoescape:false
});



app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('base.html');
});
