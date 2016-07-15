$(function () {
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
                            x: newDate.getTime(),
                            y: dataArr.SharePrice[i].Price
                        });
                    }
                    if (val == 2 && newDate.getFullYear() == date.getFullYear()) {
                        result.push({
                            x: newDate.getTime(),
                            y: dataArr.SharePrice[i].Price
                        });
                    }
                    if (val == 3 ) {
                        result.push({
                            x: newDate.getTime(),
                            y: dataArr.SharePrice[i].Price
                        });
                    }

                }
                return result;
            };

            function renderSharePriceChart (render_param){
                ctx = document.getElementById("share-price-chart");
                var defaultArr = getDataForSharePrice(render_param);
                // keysSorted = Object.keys(defaultArr).sort(function(a,b){return defaultArr[a]-defaultArr[b]});
                var sortedObject = defaultArr.slice(0);
                sortedObject.sort(function(a,b) {
                    return a.x - b.x;
                });
                var data = {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Share price',
                            data: sortedObject
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
                var SharePriceChart = new Chart(ctx, JSON.parse(JSON.stringify(data)));
            };

            var select_Val = 1;
            renderSharePriceChart(1);
            $('select#chart-Select').change(function(){
                select_Val = $("select#chart-Select").val();
                renderSharePriceChart(select_Val);
            });

 
        }
    });
    $(".main").onepage_scroll();
    // $("#nav").onePageNav({
    //     currentClass: 'current',
    //     changeHash: false,
    //     scrollSpeed: 750
    // });
});