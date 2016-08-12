$(function () {
    window.info_pageJS = (function () {
        $('#notification').hide();
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
        var params = getURLparams(string);
        $('#user_name').html('Change state of the user - ' + '<strong>' + params.userName + '<strong>');

        var logout = function () {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user_name');
            setTimeout(function(){window.location.href = 'index.html'}, 50);
        };
        
        var changeStateUser = function () {
            var comment = $('textarea[name="comment"]').val();

            var state = $( "#state_val" ).val();
            
            $.ajax('/changeStateUser', {
                method: 'POST',
                data: {
                    user_name:params.userName,
                    state : state,
                    comment: comment,
                    token: sessionStorage.getItem('token')
                }
            }).done(function (data) {
                window.location.href = 'private.html';                
            });
            window.location.href = 'private.html';
        };

        return {
            logout:logout,
            changeStateUser:changeStateUser            
        }
    })();
});