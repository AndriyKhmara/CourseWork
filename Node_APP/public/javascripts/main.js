$(function () {
    window.JointStock = (function () {


        //***************
        //Checkout send
        //***************
        
        var sendCheckout = function () {
            var select_val = $( "#slider-range-min" ).slider( "value");
            window.location.href = "login.html?selectVal=" + select_val;
        };

        //TODO: Take only the data needed, not getAllData
        $.ajax({
            type: 'GET',
            url: '/getAllData',
            success: function (dataFromPage) {
                dataArr = dataFromPage;

                function getDataForSharePrice (val){
                    var result = [];
                    var date = new Date();

                    for (var i = 0; i < dataArr.SharePrice.length; i++) {
                        var newDate = (new Date((dataArr.SharePrice[i].date).replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1')));

                        if (val == 1 && newDate.getMonth() == (date.getMonth())) {
                            result.push({
                                x: dataArr.SharePrice[i].date,
                                y: dataArr.SharePrice[i].Price
                            });
                        }
                        if (val == 2 && newDate.getFullYear() == date.getFullYear()) {
                            result.push({
                                x: dataArr.SharePrice[i].date,
                                y: dataArr.SharePrice[i].Price
                            });
                        }
                        if (val == 3 ) {
                            result.push({
                                x: dataArr.SharePrice[i].date,
                                y: dataArr.SharePrice[i].Price
                            });
                        }

                    }
                    return result;
                }


                var getShareHoldersTable = function () {
                    var stringData = '';
                    for (var i = 0; i < dataArr.cerification.length; i++) {
                        stringData += "<tr class='share-holders-table-data'>" +
                            "<td>" + dataArr.cerification[i].ShareHolder[0].firstName + "</td>" +
                            "<td>" + dataArr.cerification[i].ShareHolder[0].lastName + "</td>" +
                            "<td>" + dataArr.cerification[i].date + "</td>" +
                            "<td>" + Math.round(dataArr.companyShareCount / 100 * dataArr.cerification[i].Count ) + "</td>" +
                            "<td>" + dataArr.cerification[i].Count + '\%' +  "</td>" +
                            "<td>" + Math.round(dataArr.cerification[i].Count / 100 * 321132)+ "</td>" +
                            "</tr>";
                    }

                    return  '<section class="share-holders">' +
                                '<h2>Share Holders</h2>' +
                                "<table class='share-holders-table'>" +
                                    "<tr class='share-holders-table-title'>" +
                                    "<td>First Name</td><td>Last Name</td><td>Date of purchases</td>" +
                                    "<td>Count of shares</td><td>Share</td><td>Last month earned</td></tr>" +
                                    stringData +
                                "</table>" +
                            '</section>';

                };

                var getNetProfitChartData = function () {
                    var netProfitDate = [];
                    var netProfitData = [];
                    for (var i = 0; i < dataArr.NetProfit.length; i++) {
                        netProfitDate.push(dataArr.NetProfit[i].date);
                        netProfitData.push(dataArr.NetProfit[i].Profit);
                    }

                    var data = {

                        title: {
                            text: 'Net profit',
                            margin: 50
                        },
                        xAxis: {
                            categories: netProfitDate
                        },

                        series: [{
                            name: "Net  frofit",
                            data: netProfitData
                        }],

                        navigation: {
                            menuItemStyle: {
                                fontWeight: 'normal',
                                background: 'none'
                            },
                            menuItemHoverStyle: {
                                fontWeight: 'bold',
                                background: 'none',
                                color: 'black'
                            }
                        }
                    };

                    return data;
                };


                //TODO: Make date labels readable
                function renderSharePriceChart (render_param){
                    var defaultArr = getDataForSharePrice(render_param);
                    var sortedObject = defaultArr.slice(0);
                    sortedObject.sort(function(a,b) {
                        return a.x - b.x;
                    });
                    var charePriceData = [];
                    var charePriceDate = [];
                    for (var i = 0; i < sortedObject.length; i++) {
                        charePriceDate.push(sortedObject[i].x);
                        charePriceData.push(sortedObject[i].y);
                    }
                    
                    var data = {

                        title: {
                            text: 'Share price',
                            margin: 50
                        },
                        xAxis: {
                            categories: charePriceDate
                        },

                        series: [{
                            name: "Share price",
                            data: charePriceData
                        }],

                        navigation: {
                            menuItemStyle: {
                                fontWeight: 'normal',
                                background: 'none'
                            },
                            menuItemHoverStyle: {
                                fontWeight: 'bold',
                                background: 'none',
                                color: 'black'
                            }
                        }
                    };
                    return data;
                }

                        //***************
                        //Render charts
                        //***************



                $('#net-profit-chart').highcharts(getNetProfitChartData());


                
                var select_Val = 1;

                $('#share-price-chart').highcharts(renderSharePriceChart(1));

                $('select#chart-Select').change(function(){
                    select_Val = $("select#chart-Select").val();
                    $('#share-price-chart').highcharts(renderSharePriceChart(select_Val));
                });
                // getChart();

                        //***************
                        //Share holders table
                        //***************

                $('div.share-holders').html(getShareHoldersTable());

                        //***************
                        //Buy stock block
                        //***************


                var getBuyStockData = function (data) {
                    var result = [];
                    var sumStocks = 0;
                    for (var i = 0; i < data.cerification.length; i++) {
                        sumStocks += data.cerification[i].Count;
                    }

                    var date = new Date();
                    var stockPrice = 0;
                    for (var i = 0; i < data.SharePrice.length; i++) {
                        var newDate = (new Date((dataArr.SharePrice[i].date).replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1')));
                        if (date.getMonth() == newDate.getMonth()) {
                            stockPrice = dataArr.SharePrice[i].Price
                        }
                    }
                    result.push({
                        count: 100 - sumStocks,
                        lastCost: stockPrice,
                        totalCount: dataArr.companyShareCount
                    });

                    return result;
                };

                var stockBuyData = getBuyStockData(dataArr);

                $( "#slider-range-min" ).slider({
                    range: "min",
                    value: 50,
                    min: 0,
                    max: 100,
                    slide: function( event, ui ) {                        
                        $( "#amount" ).val( "$" + Math.round((parseInt(ui.value) / 100 * stockBuyData[0].count /100 * stockBuyData[0].totalCount * stockBuyData[0].lastCost)));
                        $(".a, .b, .c, .d").width(ui.value + "%");
                        $('#test1').html(Math.round(parseInt(ui.value) / 100 * stockBuyData[0].count /100 * stockBuyData[0].totalCount) + ' - Count of stocks ');
                        $('#test2').html(stockBuyData[0].lastCost + ' - Stock price');
                    }
                });
                $(".ui-slider-handle").text("<>");
                $('#test1').html(Math.round(parseInt($( "#slider-range-min" ).slider( "value")) / 100 * stockBuyData[0].count /100 * stockBuyData[0].totalCount) + ' - Count of stocks');
                $('#test2').html(stockBuyData[0].lastCost + ' - Stock price');
                $( "#amount" ).val( "Total price: $" + Math.round(($( "#slider-range-min" ).slider( "value"))/100 * stockBuyData[0].count /100 * stockBuyData[0].totalCount * stockBuyData[0].lastCost));

                // ********************
                // render buttons block
                // ********************




                if (sessionStorage.getItem("token")) {
                    $('#cabiten-btn').css({"display":"block"});
                    $('#logout-btn').css({"display":"block"});
                    $('#singUp-btn').hide();
                }



            }
        });

        var sendMessage = function () {
            var first_name = $('input[name="first_name"]').val();
            var last_name = $('input[name="last_name"]').val();
            var email = $('input[name="email"]').val();
            var phone = $('input[name="phone"]').val();
            var address = $('input[name="address"]').val();
            var city = $('input[name="city"]').val();
            var comment = $('input[name="comment"]').val();
            var date = new Date();
            $.ajax('/sendMessage', {
                method: 'POST',
                data: {
                    date:date,
                    first_name:first_name,
                    last_name:last_name,
                    email:email,
                    phone:phone,
                    address:address,
                    city:city,
                    comment:comment                    
                }
            }).done(function (data) {});
        };
        
        var logout = function () {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user_name');
            setTimeout(function(){window.location.href = 'index.html'}, 50);
        };
        
        
        //TODO: one page scroll have conflict with bootstrap
        //$(".main").onepage_scroll();
        return {
            sendCheckout:sendCheckout,
            logout:logout,
            sendMessage:sendMessage
    }        
    })();
});