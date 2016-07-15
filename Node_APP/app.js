'use strict'
var http = require('http'), express = require('express');
var bodyParser = require("body-parser");
var jointStockCompany = require('./models/jointStockCompany');
var app = express();

var indexPage = require('./views/indexPage');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', function (req, res) {
    res.send(indexPage.getPage());
});

app.get('/getAllData', function (req, res) {
    res.send(jointStockCompany.getAllData());
});

app.get('/getEarnHistory', function (req, res) {
    res.send(jointStockCompany.createEarhHistory());
});

http.createServer(app).listen(3000, function () {
    console.log('App listening on port 3000!');
})
