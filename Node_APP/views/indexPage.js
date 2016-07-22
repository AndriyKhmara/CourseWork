var jointStockCompany = require('./../models/JointStockCompany');

module.exports = (function () {

    var dataArr = jointStockCompany.getAllData();    

    var getPage = function () {
        return '<!DOCTYPE html><html>' +
            getPageHead() +
            '<div id="slider"></div>' + 
            getShareHoldersTable() +
            getNetProfitCompany() +
            getSharePrice() +
            getNetProfitChartScript() +
            '</div></div>' +
            '<script>  $( function() { ' +
            '$( "#slider" ).slider();' +
            '} );' + 
            '</script>' +
            '</body></html>';
    };

    var getPageHead = function () {
        return '<head>' +
            '<meta charset="utf-8"/>' +
            '<title>Joint-Stock Company</title>' +
            '<script type="text/javascript", src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js"></script>' +
            '<script type="text/javascript", src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>' +
            '<script type="text/javascript", src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.min.js"></script>' +
            '<link rel="stylesheet" href="http://localhost:3000/css/bootstrap.min.css"/>' +
            '<link rel="stylesheet" href="http://localhost:3000/css/onepage-scroll.css"/>' +
            '<link rel="stylesheet" href="http://localhost:3000/css/style.css"/>' +
            '</head><body><div class="container"><div class="row">'
    };



    var getNetProfitCompany = function () {        
        return  '<section class="net-profit main">' +
                    '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
                        '<h2>Net Profit of Company</h2>' +
                        '<canvas id="net-profit-chart">' +
                    '</div>' +
                '</section>';
    };
    
    var getNetProfitChartData = function () {
        var netProfitData = [];
        for (var i = 0; i < dataArr.NetProfit.length; i++) {
            var newDate = (new Date((dataArr.NetProfit[i].date).replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1'))).getTime();
            netProfitData.push({
                x: newDate,
                y: dataArr.NetProfit[i].Profit
            });
        }
        var data = {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Net profit',
                    data: netProfitData
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        };
        return data;
    };

    var getSharePrice = function () {
        return  '<section class="share-price main">' +
                    '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
                        '<h2>Share price</h2>' +
                        '<select id="chart-Select" name="chart_select">' + 
                            '<option value="1">Share price for last month</option>' +
                            '<option value="2">AVG share price for last year</option>' +
                            '<option value="3">The share price over the entire period</option>' +
                        '</select>' +                        
                        '<canvas id="share-price-chart">' +
                    '</div>' +
                '</section>';
    };

    var getSharePriceChartData = function () {
        var netProfitData = [];
        for (var i = 0; i < dataArr.NetProfit.length; i++) {
            netProfitData.push({
                x: dataArr.SharePrice[i].date,
                y: dataArr.SharePrice[i].Price
            });
        }
        var data = {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Share price',
                    data: netProfitData
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        };
        console.log(netProfitData);
        return data;
    };



    var getNetProfitChartScript = function () {
        return [
            '<script>',
                'var ctx = document.getElementById("net-profit-chart");',
                'var myChart = new Chart(ctx, JSON.parse(\'' + JSON.stringify(getNetProfitChartData()) + '\'));',
                // 'ctx = document.getElementById("share-price-chart");',
                // 'var SharePriceChart = new Chart(ctx, JSON.parse(\'' + JSON.stringify(getSharePriceChartData()) + '\'));',
            '</script>',
            '<script type="text/javascript", src="http://localhost:3000/javascripts/jquery.onepage-scroll.js"></script>',
            '<script type="text/javascript", src="http://localhost:3000/javascripts/main_ajax.js"></script>'
        ].join('');
    };

    return {
        getPage: getPage,
        getNetProfitChartData:getNetProfitChartData
    }
})();