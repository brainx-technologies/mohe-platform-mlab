// ALERTS

(function () {
    var apiUrl = '/api/frontend/alert/count/';
    var updateInterval = 5000;

    var checkForAlerts = function () {
        $.get(apiUrl, function (data) {
            if (data.new == 0) {
                $('#alert-count').hide();
            } else {
                $('#alert-count').text(data.new);
                $('#alert-count').fadeIn();
            }
        });
    };

    $(document).ready(function () {
        window.setInterval(checkForAlerts, updateInterval);
    });

    $('[data-toggle=tooltip]').tooltip({container: 'body'})
}());


