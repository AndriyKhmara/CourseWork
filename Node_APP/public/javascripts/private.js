$(function () {
    window.privateJS = (function () {
        $('#notification').hide();
        $('#share-price-block').hide;

        $.ajax('/private', {
            method: 'POST',
            data: {
                token: sessionStorage.getItem('token')
            }
        }).done(function (data) {            
            userInfoRender(data.data, data.dataOld, data.earnhistory, data.state);
        }).fail(function (error) {
            // TODO:repaire failed bunner;
            faildMessage('Session is time out or login failed');
        });
        var userInfoRender = function (data, dataOld, earnHistory, state) { //users state: 0 - new user, 1 - older than 1 month, 3 - master, 4 - delete user, 5 - didn't authenticate
            $('#info-section').show();
            $('#render-earn-history').hide();
            $('#totel-earned').hide();
            $('.render-old-user').hide();
            $('#contact_form').hide();


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
                /*
                *   TODO: WTF is this
                * */
                $('#contact_form').show();
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = date.getDay()+5;
                if (day < 10) {
                    day = "" + 0 + day;
                }
                if (month < 10) {
                    month = "" + 0 + month;
                }
                var newDate = year + '-' + month + '-' + day;
                
                $("#share-Date").attr({
                    "min" : newDate
                });
                $('#share-price-block').show();
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
                        '<td>' + data[i].costs + '</td>' +
                        '<td>' + data[i].state + '</td>' +
                        '<td><div><a href="../info_page.html?userName=' + data[i].name + '"><button type="button" class="btn btn-success">Change</button></a></div></td></tr>';

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
                        '<td>' + dataOld[i].costs + '</td>' +
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
                    $('#totel-earned').html('Total earned: ' + sum);
                    $('#render-earn-history').toggle();
                    $('#totel-earned').toggle();

                });
            }
            else if (state == 1) {
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
            }
        };


        var sendSharePriceInformation = function () {
            var sharePrice = $('#share-Price').val();
            var shareDate = $('#share-Date').val();
            $.ajax('/postSharePriceData', {
                method: 'POST',
                data: {
                    sharePrice:sharePrice,
                    shareDate:shareDate,
                    token:sessionStorage.getItem('token')
                }
            }).done(function (data) {
                
            });
        };

        var deleteUser = function () {
            $('#notification').show();            
            $('#notification-text').html("Sorry, this function didn't work yet");
        }

        var faildMessage = function (error) {
            $('#notification').show();
            $('#notification').html('Session is time out or login failed');
        };
        
        var logout = function () {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user_name');
            setTimeout(function(){window.location.href = 'index.html'}, 50);
        };
        return {
            logout:logout,
            deleteUser:deleteUser,
            sendSharePriceInformation:sendSharePriceInformation
        }
    })();
});