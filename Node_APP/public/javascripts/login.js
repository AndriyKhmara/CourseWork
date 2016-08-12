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
        };



        var getCheckout = function () {

            $('.notification').hide();

            var select_val = getURLparams(string).selectVal;

            var customer_name = $('#reg-user').val();
            var customer_lastName = $('#reg-lastName').val();
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
                        $('.notification').show();
                        $('.notification').html('Entered pasword do not match');
                    } else {
                        var record = {
                            customer_name:customer_name,
                            customer_lastName:customer_lastName,
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
            $.ajax('/authentificate', {
                method: 'POST',
                data: {
                    login: user_name,
                    pw: user_pw
                }
            }).done(function (data) {
                if (data.succsess) {
                    //TODO: create new function for render data
                    // userInfoRender(data.data, data.dataOld, data.earnhistory, data.state);
                    sessionStorage.setItem('token', data.userToken);
                    sessionStorage.setItem('user_name', data.userName);
                    successLogin();
                }  else {
                    faildMessage();
                }
            });
        };
        
        $('#login-pass').keypress(function(e) {
            if(e.which == 13) {
                loginUser();
            }
        });

        var successLogin = function (data) {
            $('.notification').show();
            $('.notification').html('Login success!');
            setTimeout(function(){window.location.href = 'index.html'}, 1000);
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