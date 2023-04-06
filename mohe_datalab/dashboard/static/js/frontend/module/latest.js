var GREEN = "#4dbe4d";
var ORANGE = "#f4b05d";


DashboardModules.latest = function (moduleId) {
    var results = $('#module-' + moduleId + ' .results');
    var parameters = $('#module-' + moduleId + ' .parameters');
    var empty = $('#module-' + moduleId + ' .empty');
    var apiUrl = '/api/frontend/latest/' + moduleId + '/';
    var updateInterval = 5000;

    var latest = 0;

    resultOverlay.enableMap();

    var update = function () {
        $.get(apiUrl, function (data) {
            window.setTimeout(update, updateInterval);

            if (data.result.length == 0) {
                results.hide();
                parameters.hide();
                empty.show();
                return;
            }
            results.show();
            parameters.show();
            empty.hide();

            if (data.result[0].id == latest) {
                return;
            }

            latest = data.result[0].id;

            results.html('');

            data.result.forEach(function (item) {
                var date = new Date(item.date).toLocaleString();

                var div = $('<div></div>', {'class': 'result'}).css({display: 'none'});

                var h4 = $('<h4></h4>').text("#" + item.id + " " + item.title).appendTo(div);
                $("<p></p>").text(item.kplex).appendTo(div);
                var p = $('<p></p>').appendTo(div);
                var span = $('<span></span>', {'class': 'status status-' + item.status}).text(item.status_text).appendTo(p);
                $('<span></span>').text(date).appendTo(p);

                results.append(div);

                div.click(function () {
                    results.find('.active').removeClass('active');
                    div.addClass('active');
                    details(item);
                });

                div.fadeIn();

                if (item.id == latest) {
                    div.addClass('active');
                    details(item);
                }
            });
        });
    };

    var details = function (item) {
        parameters.html('');
        var h3 = $('<h3></h3>').text('#' + item.id).appendTo(parameters);
        h3.click(function () { resultOverlay.update(item); });

        $('<h4></h4>').text('Parameters').appendTo(parameters);

        item.tests.forEach(function (test) {
            var div = $('<div></div>').css({fontSize: 'smaller'}).appendTo(parameters);
            $('<span></span>', {'class': 'dot dot-' + test.status}).appendTo(div);
            $('<span></span>').text(test.name).appendTo(div);
        });
    };

    update();
};



