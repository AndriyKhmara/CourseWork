'use strict'
var http = require('http'), express = require('express');
var bodyParser = require("body-parser");
var jointStockCompany = require('./models/jointStockCompany');
var app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));




app.get('/getAllData', function (req, res) {
    res.send(jointStockCompany.getAllData());
});
app.get('/getSharePriceData', function (req, res) {
    res.send(jointStockCompany.getSharePriceData());
});

app.get('/getEarnHistory', function (req, res) {
    res.send(jointStockCompany.createEarhHistory());
});

app.get('/buyStock', function (req, res) {
    res.send(jointStockCompany.createEarhHistory());
});

app.post('/regCheckout', function (req, res) {
    res.send(jointStockCompany.regCheckout(req.body)) ;
});

app.post('/authentificate', function (req, res) {
    res.send(jointStockCompany.authentificate(req.body)) ;
});

app.post('/private', function (req, res) {
    res.send(jointStockCompany.private(req.body)) ;
});
app.post('/postSharePriceData', function (req, res) {
    res.send(jointStockCompany.postSharePriceData(req.body)) ;
});

app.post('/changeStateUser', function (req, res) {
    res.send(jointStockCompany.changeStateUser(req.body)) ;
});

app.post('/sendMessage', function (req, res) {
    res.send(jointStockCompany.sendMessage(req.body)) ;
});

http.createServer(app).listen(3000, function () {
    console.log('App listening on port 3000!');
});
