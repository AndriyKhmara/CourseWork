'use strict'
var http = require('http'), express = require('express');
var bodyParser = require("body-parser");
var jointStockCompany = require('./models/jointStockCompany');
var app = express();

var indexPage = require('./views/indexPage');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


// app.get('/', function (req, res) {
//     res.send(indexPage.getPage());
// });

app.get('/getAllData', function (req, res) {
    res.send(jointStockCompany.getAllData());
});
app.get('/getSharePriceData', function (req, res) {
    res.send(jointStockCompany.getSharePriceData());
});

app.get('/getNetProfitChart', function (req, res) {
    res.send(indexPage.getNetProfitChartData());
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

app.post('/login', function (req, res) {
    res.send(jointStockCompany.loginUser(req.body)) ;
});


http.createServer(app).listen(3000, function () {
    console.log('App listening on port 3000!');
})
