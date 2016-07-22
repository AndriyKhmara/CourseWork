var fs = require('fs');
var logger = require('./../services/logger.js');

module.exports = (function () {
    var dbFilePath = './data/data.json';
    var order_Path = './data/order_data.json';
    var user_Path = './data/users.json';

    var readData = function (path) {
        try {
            var result = fs.readFileSync(path, 'utf8');
            return JSON.parse(result);
        } catch (e) {
            logger.logError("Can't read from file " + path);
            return [];
        }
    };
    
    var regCheckout = function (params) {        
        return 'success ' + params.select_val;
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
    
    var createEarhHistory = function (user){
        var result = [];        
        if (user == 'all') {
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
        }
        return result;
    };

    var prepareRecordOrder = function (data) {
        var result = {
            id : checkoutData.length + 1,
            customer_name       : data.customer_name,            
            customer_email      : data.customer_email,
            select_val          : data.select_val,
            state               : "under consideration"
        };
        
        return result;
    };
    var prepareRecordUser = function (data) {
        var result = {
            id : userData.length + 1,
            customer_name       : data.customer_name,
            customer_pw         : data.customer_pw,
            customer_email      : data.customer_email,
            state               : 0
        };

        return result;
    };
    //TODO: Make one function for write data with params
    var writeOrderData = function (data) {
        try {
            fs.writeFileSync(
                order_Path,
                JSON.stringify(data),
                { flag: 'w+' }
            );            
            checkoutData = readData(order_Path);
        } catch(e) {
            logger.logError('Failed saving data to file, data: ' +
                JSON.stringify(record));
            return false;
        }
        return true;
    };
    var writeUserData = function (data) {
        try {
            fs.writeFileSync(
                user_Path,
                JSON.stringify(data),
                { flag: 'w+' }
            );
            userData = readData(user_Path);
        } catch(e) {
            logger.logError('Failed saving data to file, data: ' +
                JSON.stringify(record));
            return false;
        }
        return true;
    };
    
    var regCheckout = function (record) {
        //TODO: validate params
        // if (!validateParams(record)) {
        //     logger.logError("Wrong params: " + JSON.stringify(record));
        //     return null;
        // }
        checkoutData.push(prepareRecordOrder(record));
        userData.push(prepareRecordUser(record));
        writeOrderData(checkoutData);
        writeUserData(userData); 
        var result = getDataForNewUser(record.customer_name);
        return {
            succsess : true,
            data     : result
        }
    };

    var getAVGcost = function (date) {
        var sum = 0;
        var count = 0;
        for (var j = 0; j < dataArr.SharePrice.length; j++) {
            var selectDate = (new Date((dataArr.SharePrice[j].date).replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1')));
            if (date.getMonth() == selectDate.getMonth()) {
                sum += dataArr.SharePrice[j].Price;
                count++;
            }
        }
        return sum / count;
    };

    var getDataForNewUser = function (name) {
        var result = {};
        var date = new Date();

        for (var i = 0; i < checkoutData.length; i++) {
            if (name == checkoutData[i].customer_name) {
                result.name = checkoutData[i].customer_name;
                result.email = checkoutData[i].customer_email;
                result.proportionOfShares = checkoutData[i].select_val;
                result.count = checkoutData[i].select_val * dataArr.companyShareCount / 100;
                result.costs = checkoutData[i].select_val * dataArr.companyShareCount / 100 * getAVGcost(date);
                result.state = checkoutData[i].state;
            }
        }

        return result;
    };
    
    var getDataForMaster = function () {
        var result = [];
        var resultOld = [];

        for (var i = 0; i < userData.length; i++) {
            if (userData[i].state == 0){
                
                result.push(getDataForNewUser(userData[i].customer_name));
            } else if (userData[i].state == 1){
                var proportionOfShares = 1;
                for (var j = 0; j < dataArr.cerification.length; j++) {
                    for (var k = 0; k < dataArr.cerification[j].ShareHolder.length; k++) {                                          
                        if (dataArr.cerification[j].ShareHolder[k].firstName == userData[i].customer_name) {                            
                            proportionOfShares = dataArr.cerification[j].Count;                            
                        }
                    }
                }
                var date = new Date;
                var count = proportionOfShares * dataArr.companyShareCount / 100;
                var costs = count * getAVGcost(date);
                
                resultOld.push({
                    name                : userData[i].customer_name,
                    email               : userData[i].customer_email,
                    proportionOfShares  : proportionOfShares,
                    count               : count ,
                    costs               : costs,
                    state               : 1

                });
            }
        }
        


        return {
            result      : result,
            resultOld   : resultOld,
            earnHistory: createEarhHistory('all')
        }
    };
    
    var loginUser = function (user) {
        var date = new Date();
        for (var i = 0; i < userData.length; i++) {
            
            if (userData[i].customer_name == user.login && userData[i].customer_pw == user.pw) {                
                var result = [];
                var resultOld = [];
                if (userData[i].customer_name == 'master') { //root user                    
                    return {
                        succsess : true,
                        state    : 3,
                        data     : getDataForMaster().result,
                        dataOld  : getDataForMaster().resultOld,
                        earnhistory:getDataForMaster().earnHistory
                    }
                } else if (userData[i].state == 0) {   //state = 0 - means that login user that jast buy shares and didn't get any profit yet
                    result.push(getDataForNewUser(user.login));
                    return {
                        succsess    : true,
                        state       : userData[i].state,
                        data        : result,
                        dataOld     : [],
                        earnhistory : []
                        
                    }
                } else { //login other users

                }                
                
                
            }             
        }
        return {
            succsess : false,
            state    : 5,
            data     : []
        }, logger.logError(date + " login faild by " + user.login);
        
    };

    var checkoutData = readData(order_Path);
    var userData = readData(user_Path);
    var dataArr = readData(dbFilePath);    
    return {
        readData: readData,
        getAllData : getAllData,
        createEarhHistory:createEarhHistory,
        regCheckout:regCheckout,
        loginUser:loginUser
    }
})();