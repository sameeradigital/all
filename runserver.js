var express = require('express');

var app = express();
app.use(require('./src/server/application'));

app.listen(5000);