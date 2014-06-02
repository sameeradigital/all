var express = require('express');

var app = express();
app.use(require('./server/application'));

app.listen(5000);