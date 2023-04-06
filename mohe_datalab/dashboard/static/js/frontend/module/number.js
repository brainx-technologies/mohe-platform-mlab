DashboardModules.number = function (moduleId) {
    var selector = '#module-' + moduleId + " .body";
    var apiUrl = '/api/frontend/number/' + moduleId + '/';
    var updateInterval = 5000;

    function update() {
        $.get(apiUrl, function (data) {
            var html = data.period;

            if (data.compare && data.period > 0) {

                var diff = Math.round((data.period - data.compare) / data.period * 100);
                
                if (diff > 0) {
                    diff = '+' + diff;
                }
                else if (diff == 0) {
                    diff = "&plusmn;0";
                }
                
                html += ' <small>(' + diff + '%)</small>';
            }
            $(selector).html(html);
            window.setTimeout(update, updateInterval);
        });
    }

    update();
};
