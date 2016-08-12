var fs = require('fs');
var logger = require('./../services/logger.js');

module.exports = (function () {
    var dbFilePath = './data/data.json';
    var order_Path = './data/order_data.json';
    var user_Path = './data/users.json';
    var change_state_history_Path = './data/change_state_history.json';
    var messages = './data/messages.json';

    var sessions = [];
    
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
        } else {
            
        }
        return result;
    };

    var prepareRecordOrder = function (data) {
        var result = {
            id : checkoutData.length + 1,
            customer_name       : data.customer_name,
            customer_lastName   : data.customer_lastName,
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
            customer_lastName   : data.customer_lastName,
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

    var writeMessagesData = function (data) {
        try {
            fs.writeFileSync(
                messages,
                JSON.stringify(data),
                { flag: 'w+' }
            );
            messagesData = readData(messages);
        } catch(e) {
            logger.logError('Failed saving data to file, data: ' +
                JSON.stringify(record));
            return false;
        }
        return true;
    };

    var writeStateHistory = function (data) {
        try {
            fs.writeFileSync(
                change_state_history_Path,
                JSON.stringify(data),
                { flag: 'w+' }
            );
            state_hisoty = readData(change_state_history_Path);
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

    var writeDBData = function (data) {
        try {
            fs.writeFileSync(
                dbFilePath,
                JSON.stringify(data),
                { flag: 'w+' }
            );
            dataArr = readData(dbFilePath);
        } catch(e) {
            logger.logError('Failed saving data to file, data: ' +
                JSON.stringify(record));
            return false;
        }
        return true;
    };
    
    var getCountFreeStock = function (val) {
        var count = 0;
        for (var i = 0; i < dataArr.cerification.length; i++) {
            count += dataArr.cerification[i].Count;            
        }
        return (val * (100 - count) / 100);
    }
    
    var regCheckout = function (preRecord) {
        //TODO: validate params
        // if (!validateParams(record)) {
        //     logger.logError("Wrong params: " + JSON.stringify(record));
        //     return null;
        // }
        var record = {
            customer_name:preRecord.customer_name,
            customer_lastName:preRecord.customer_lastName,
            customer_pw:preRecord.customer_pw,
            customer_email:preRecord.customer_email,
            select_val:getCountFreeStock(preRecord.select_val)
        }

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
    
    var getDataForRenderPrivate = function (user) {
        if (user == "master") {
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
                    var date = new Date();
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
        } else {
            return {
                result      : [],
                resultOld   : [],
                earnHistory: []
            }
        }
        
    };

    var authorization = function (token){
        var successLogin = false;
        var userName = "";
        for (var i = 0; i < sessions.length; i++) {            
            if (sessions[i].token === token) {            
                successLogin = true;
                userName = sessions[i].user_name; 
            }
        }
        return {
            status:successLogin,
            userName:userName
        };
    };
    
    var private = function (token){
            var islogin = authorization(token.token);
            if (islogin.status) {                
                return getPrivateInformation(islogin.userName);                
            }            
    };
        
    
    
    var getStateByName = function (name) {
        for (var i = 0; i < userData.length; i++) {
            if (userData[i].customer_name === name) {
                console.log(userData[i].state);
                return userData[i].state; 
                
            }
        }
    };

    var getPrivateInformation = function (user_name){
        var result = [];
        for(var i = 0; i < userData.length; i++) {

            if (user_name == 'master') { //root user    
                var renderData = getDataForRenderPrivate("master"); 
                return {
                    succsess : true,
                    state    : 3,
                    data     : renderData.result,
                    dataOld  : renderData.resultOld,
                    earnhistory:renderData.earnHistory                    
                }
            } else if (getStateByName(user_name) == 0) {   //state = 0 - means that login user that jast buy shares and didn't get any profit yet
                result.push(getDataForNewUser(user_name));
                return {
                    succsess    : true,
                    state       : userData[i].state,
                    data        : result,
                    dataOld     : [],
                    earnhistory : []

                }
            } else if (getStateByName(user_name) == 1){
                return {
                    succsess : true,
                    state    : userData[i].state,
                    data     : getDataForRenderPrivate(user_name).result,
                    dataOld  : [],
                    earnhistory:getDataForRenderPrivate(user_name).earnHistory
                }
            }    
        }
        
    };
    
    var authentificate = function (user) {
        var date = new Date();
        for (var i = 0; i < userData.length; i++) {
            
            if (userData[i].customer_name == user.login && userData[i].customer_pw == user.pw) {                
                var result = [];
                var resultOld = [];
                var token = generateToken();
                sessions.push({
                    user_name: user.login,
                    token:token
                });                        
                return {
                    succsess : true,
                    userName: user.login,
                    userToken: token
                }
            }             
        }
        return {
            succsess : false,
            state    : 5            
        }, logger.logError(date + " login faild by " + user.login);
        
    };

    var generateToken = function () {
        var letter = "xcv,m39SFGDSFgxvj;lm32523j$@#%#$%SDGsVlakvjm,nv36";
        var token = '';
        for (var i = 0; i < 32; ++i) {
            token += letter[Math.floor(Math.random() * (letter.length)) + 1];
        }
        return token;
    };  
    
    var postSharePriceData = function (data) {
        var islogin = authorization(data.token);
        if (islogin.status && islogin.userName == "master") {            
            var newArr = dataArr;
            newArr.SharePrice.push({
                "id" : newArr.SharePrice.length + 1,   
                "date":data.shareDate,
                "Price":parseFloat(data.sharePrice)
            });
            
            writeDBData(newArr);
        }
        
    };
    
    var getShareHolderID = function () {
        var id = 0;
        
        for (var i = 0; i < dataArr.cerification.length; i++) {
            if (dataArr.cerification[i].ShareHolder[0].id > id) {
                id = dataArr.cerification[i].ShareHolder[0].id;
            }
        }
        return (id + 1);
    };
    
    var getCurrDate = function () {
        var curDate = new Date;
        var date = curDate.getFullYear() + '-' + curDate.getMonth()+1 + ' - ' + curDate.getDay();
        return date;
    };
    
    var getLastName = function (name) {
        for (var i = 0; i < userData.length; i++) {            
            if (userData[i].customer_name == name) {
                console.log(userData[i].customer_lastName);
                return userData[i].customer_lastName;
            }
        }  
    };
    
    var changeStateUser = function (data) {
        var islogin = authorization(data.token);
        if (islogin.status && islogin.userName == "master") {
            delete data.token;
            data.date = new Date();
            state_hisoty.push(data);
            writeStateHistory(state_hisoty);
            
            var select_val = 0;
            console.log(data.state);
            if (data.state == 1) {
                for (var i = 0; i < checkoutData.length; i++) {
                    if (checkoutData[i].customer_name == data.user_name) {
                        select_val = checkoutData[i].select_val; 
                        checkoutData.splice(i, 1);
                        i--;
                    }
                }
                writeOrderData(checkoutData);
                checkoutData = readData(order_Path);
                
                for (var i = 0; i < userData.length; i++) {
                    if (userData[i].customer_name == data.user_name) {
                        userData[i].state = 1;
                    }
                }
                writeUserData(userData);
                userData = readData(user_Path);
                
                
                dataArr.cerification.push({
                    "id": dataArr.cerification.length + 1,
                    "date": getCurrDate(),
                    "certNumber": dataArr.cerification.length + 1,
                    "Count": parseInt(select_val),
                    "ShareHolder": [
                        {
                            "id": getShareHolderID(),
                            "firstName": data.user_name,
                            "lastName": getLastName(data.user_name),
                            "dividents": 0
                        }
                    ]
                });
                                
                writeDBData(dataArr);
                dataArr = readData(dbFilePath);

            } else if (data.state == 4) {
                for (var i = 0; i < checkoutData.length; i++) {
                    if (checkoutData[i].customer_name == data.user_name) {
                        checkoutData.splice(i, 1);
                        i--;
                    }
                }
                writeOrderData(checkoutData);
                checkoutData = readData(order_Path);

                for (var i = 0; i < userData.length; i++) {
                    if (userData[i].customer_name == data.user_name) {
                        userData.splice(i, 1);
                        i--;
                    }
                }
                writeUserData(userData);
                userData = readData(user_Path);
            }
            
            return true;
        }
    };
    
    var sendMessage = function (data) {
        messagesData.push(data);
        writeMessagesData(messagesData);
        messagesData = readData(messages);
    };

    var checkoutData = readData(order_Path);
    var userData = readData(user_Path);
    var dataArr = readData(dbFilePath);    
    var state_hisoty = readData(change_state_history_Path);
    var messagesData = readData(messages);
    return {
        readData: readData,
        getAllData : getAllData,
        createEarhHistory:createEarhHistory,
        regCheckout:regCheckout,
        authentificate:authentificate,
        private:private,
        postSharePriceData:postSharePriceData,
        changeStateUser:changeStateUser,
        sendMessage:sendMessage
    }
})();