var fs = require('fs');

module.exports = (function () {
    var dbFilePath = './data/data.json';

    var readData = function (path) {
        try {
            var result = fs.readFileSync(path, 'utf8');
            return JSON.parse(result);
        } catch (e) {
            return [];
        }
    };

    var getAllData = function () {
        var data = readData(dbFilePath);
        return data;
    };
    var dataArr = readData(dbFilePath);
    
    var getNetProfit = function (date){
        var result = 0;        
        for (var i = 0; i < dataArr.NetProfit.length; i++) {
            var newNetProfitDate = (new Date((dataArr.NetProfit[i].date).replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1')));
            if (date.getMonth() == newNetProfitDate.getMonth()) {
                result = dataArr.NetProfit[i].Profit;
            }
        }
        return result;
    };
    
    var createEarhHistory = function (){
        var result = [];        
        for (var i = 0; i < dataArr.cerification.length; i++) {
            for (var j = 0; j < dataArr.cerification[i].ShareHolder.length; j++) {
                var date = new Date();
                var newCertDate = (new Date((dataArr.cerification[i].date).replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1')));
                
                while (date.getMonth() >= newCertDate.getMonth()) {
                    result.push ({
                        firstName:    dataArr.cerification[i].ShareHolder[j].firstName,
                        lastName:     dataArr.cerification[i].ShareHolder[j].lastName,
                        date:               newCertDate.getFullYear() + '-' + (newCertDate.getMonth() + 1)  + '-' + '01',
                        earnedSum:          (getNetProfit(newCertDate) * dataArr.cerification[i].Count / 100) - dataArr.cerification[i].ShareHolder[j].dividents
                    });
                    newCertDate.setMonth(newCertDate.getMonth() + 1);
                }
            }
        }
        console.log('Earn history')
        console.log(result);
        return result;
    };

    return {
        readData: readData,
        getAllData : getAllData,
        createEarhHistory:createEarhHistory
    }
})();