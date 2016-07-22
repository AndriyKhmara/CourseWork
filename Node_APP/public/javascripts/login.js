$(function () {
    window.loginJS = (function () {
        var string = window.location.href;        
        $('#info-section').hide();
        var getURLparams = function (url) {
            var params = {};
            var param_array = window.location.href.split('?')[1].split('&');
            for(var i in param_array){
                x = param_array[i].split('=');
                params[x[0]] = x[1];
            }
            return params;
        }



        var getCheckout = function () {

            $('.notification').hide();

            var select_val = getURLparams(string).selectVal;

            var customer_name = $('#reg-user').val();
            var customer_pw = $('#reg-pass').val();
            var customer_re_pw = $('#reg-re-pass').val();
            var customer_email = $('#reg-email').val();

            var log_name = $('#login-user').val();
            var log_pw = $('#login-pass').val();
            var log_check = $('#login-check').val();

            // console.log(log_name);
            // console.log(log_pw);
            // console.log(log_check);
            //
            // console.log(customer_pw);
            // console.log(customer_re_pw);

            if (select_val) {
                if (!log_name && !log_pw) {
                    //TODO: Email validation need to be added 
                    if (customer_pw !== customer_re_pw) {
                        console.log('entered here');
                        $('.notification').show();
                        $('.notification').html('Entered pasword do not match');
                    } else {
                        var record = {
                            customer_name:customer_name,
                            customer_pw:customer_pw,
                            customer_email:customer_email,
                            select_val:select_val
                        };
                        $.ajax('/regCheckout', {
                            method: 'POST',
                            data: record
                        }).done(successMessage);
                    }
                }
            }   else {
                
            }
            
        };
        
        var loginUser = function () {
            $('.notification').hide();
            $('.render-old-user').hide();
            var user_name = $('#login-user').val();
            var user_pw = $('#login-pass').val();            
            $.ajax('/login', {
                method: 'POST',
                data: {
                    login: user_name,
                    pw: user_pw
                }
            }).done(function (data) {
                if (data.succsess) {
                    console.log(data);
                    userInfoRender(data.data, data.dataOld, data.earnhistory, data.state);
                }  else {
                    faildMessage();
                }
            });
        };
        
        var userInfoRender = function (data, dataOld, earnHistory, state) { //users state: 0 - new user, 1 - older than 1 month, 3 - master
            $('#info-section').show();
            $('#login-section').hide();
            $('#render-earn-history').hide();
            $('#totel-earned').hide();
            

            if (state == 0) {
                var sT = '<tr>' +
                    '<td>Name</td>' +
                    '<td>Email</td>' +
                    '<td>Proportion</td>' +
                    '<td>Count</td>' +
                    '<td>Costs</td>' +
                    '<td>State</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + data[0].name + '</td>' +
                    '<td>' + data[0].email + '</td>' +
                    '<td>' + data[0].proportionOfShares + '</td>' +
                    '<td>' + data[0].count + '</td>' +
                    '<td>' + data[0].costs + '</td>' +
                    '<td>' + data[0].state + '</td></tr>';
                $('#render-table').html(sT);    
            } else if (state == 3) {
                var sT = '<tr>' +
                    '<td>Name</td>' +
                    '<td>Email</td>' +
                    '<td>Proportion</td>' +
                    '<td>Count</td>' +
                    '<td>Costs</td>' +
                    '<td>State</td>' +
                    '<td>Change state</td>' +
                    '</tr>';
                    for (var i = 0; i < data.length; i++) {
                        sT += '<tr>' +
                            '<td>' + data[i].name + '</td>' +
                            '<td>' + data[i].email + '</td>' +
                            '<td>' + data[i].proportionOfShares + '</td>' +
                            '<td>' + data[i].count + '</td>' +
                            '<td>' + data[i].costs.toFixed(2) + '</td>' +
                            '<td>' + data[i].state + '</td>' +
                            '<td><div><button type="button" class="btn btn-success">Change</button></div></td></tr>';
                    }
                $('#render-table').html(sT);
                $('.render-old-user').show();
                var userOldInfo = '<tr>' +
                    '<td>Name</td>' +
                    '<td>Email</td>' +
                    '<td>Proportion</td>' +
                    '<td>Count</td>' +
                    '<td>Costs</td>' +
                    '</tr>';
                for (var i = 0; i < dataOld.length; i++) {
                    userOldInfo += '<tr>' +
                        '<td><p class="credits"><a href="#" class="toogle-name">' + dataOld[i].name + '</a></p></td>' +
                        '<td>' + dataOld[i].email + '</td>' +
                        '<td>' + dataOld[i].proportionOfShares + '</td>' +
                        '<td>' + dataOld[i].count + '</td>' +
                        '<td>' + dataOld[i].costs.toFixed(2) + '</td>' +
                        '</tr>';
                }
                $('#render-old-user').html(userOldInfo);

                $('a.toogle-name').click(function(e) {
                    var name = $(e.target).text();
                    var sum = 0;
                    var sT = '<div class="table-responsive">' +
                        '<table class="table table-striped" id="render-old-user">' +
                        '<tr>' +
                            '<td>Date</td>' +
                            '<td>Earned sum</td>'+
                        '</tr>';
                    for (var i = 0; i < earnHistory.length; i++) {
                        if (earnHistory[i].firstName == name){
                            sT +=   '<tr>' +
                                        '<td>' + earnHistory[i].date + '</td>' +
                                        '<td>' + earnHistory[i].earnedSum + '</td>' +
                                    '</tr>';
                            sum += earnHistory[i].earnedSum;
                        }
                    }
                    sT += '</table></div>';
                    $('#render-earn-history').html(sT);
                    $('#totel-earned').html('Total earned: ' + sum.toFixed(2));
                    $('#render-earn-history').toggle();
                    $('#totel-earned').toggle();

                });
            }
            
        };

        var successMessage = function (data) {
            $('.notification').show();
            $('.notification').html('Your order succsessfully added ! Now u can login with your creds and look for order');
            setTimeout(function(){window.location.href = 'index.html'}, 5000);
        };
        
        var faildMessage = function () {
            $('.notification').show();
            $('.notification').html('Your login or password are invalid !');
        };
        
        return {
            getCheckout:getCheckout,
            loginUser:loginUser
        }
    })();
});