var express = require('express');

var app = express();
app.use(require('./server/serverApplication'));

app.listen(5000);