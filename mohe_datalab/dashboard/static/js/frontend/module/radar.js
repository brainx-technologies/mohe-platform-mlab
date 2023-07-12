DashboardModules.radar = function (moduleId) {
    let mapId = 'radar-' + moduleId;
    let listId = '#module-' + moduleId + ' .result-list'
    let detailId = '#module-' + moduleId + ' .result-detail'
    let apiUrl = '/api/frontend/radar/' + moduleId + '/';

    let updateInterval = 10000;
    let results = null;
    let latest = 0;
    let map = null;
    let marker = null;
    var clicked = false;

    var container = $("#" + mapId);

    var lat = parseFloat(container.data("lat"));
    var lng = parseFloat(container.data("lng"));
    var zoom = parseInt(container.data("zoom"));

    var init = function () {
        map = new google.maps.Map(document.getElementById(mapId), {
            center: { lat: lat, lng: lng },
            zoom: zoom,
            minZoom: zoom,
            maxZoom: zoom,
            width: '100%',
            styles: mapStyle,
            disableDefaultUI: true
        });
    };

    var resultList = function (_results) {
        results = _results;

        let list = $(listId);
        for (var i = results.length - 1; i >= 0; i--) {
            let result = results[i];
            var date = new Date(result.date).toLocaleString();
            var div = $('<div></div>', { 'class': 'result', 'data-id': result.id });
            $('<span></span>', { 'class': 'id' }).text("#" + result.id).appendTo(div);
            $('<span></span>', { 'class': 'status status-' + result.status }).text(result.status_text).appendTo(div);
            $('<span></span>', { 'class': 'kplex' }).text(result.kplex).appendTo(div);
            $('<span></span>', { 'class': 'date' }).text(date).appendTo(div);

            let existing = list.find('[data-id="' + result.id + '"]');
            if (existing.length == 0) {
                div.prependTo(list);
            }
        }
    };

    let resultDetail = function (result) {
        var detail = $(detailId);
        detail.html('');
        $('<div></div>', { 'class': 'tester' }).text('Tester:').appendTo(detail);
        $('<div></div>', { 'class': 'tester' }).text(result.user.name).appendTo(detail);
        $('<div></div>', { 'class': 'team' }).text('Team:').appendTo(detail);
        $('<div></div>', { 'class': 'team' }).text(result.team?.name ? result.team.name : "Test Team").appendTo(detail);

        if (result.status == 'trigger') {
            $('<h5></h5>').text('Positive parameters').appendTo(detail);
        }

        if (result.status == "trigger") {
            result.tests.sort((a, b) => { return a.name > b.name })
            result.tests.forEach(function (test) {
                if (test.status == 'trigger') {
                    var div = $('<div></div>', { 'class': 'test' }).appendTo(detail);
                    $('<span></span>', { 'class': 'dot dot-trigger' }).appendTo(div);
                    $('<span></span>').text(test.name).appendTo(div);
                }
            });
        }

        $('<h5></h5>').text('Negative parameters').appendTo(detail);
        result.tests.forEach(function (test) {
            if (test.status == 'clear') {
                var div = $('<div></div>', { 'class': 'test' }).appendTo(detail);
                $('<span></span>', { 'class': 'dot dot-clear' }).appendTo(div);
                $('<span></span>').text(test.name).appendTo(div);
            }
        });
    };

    var mapMarker = function (result) {
        var position = { lat: result.lat, lng: result.lng };
        map.setCenter(position);
        if (marker == null) {
            marker = new google.maps.Marker({
                position: position,
                icon: '/static/images/pin_' + result.status + '.svg',
                map: map
            });
        } else {
            marker.setIcon('/static/images/pin_' + result.status + '.svg');
            marker.setPosition(position);
        }
    };

    function update() {
        $.get(apiUrl, function (data) {
            window.setTimeout(update, updateInterval);
            if (data.result.length > 0) {
                resultList(data.result);

                if (clicked == false) {
                    mapMarker(data.result[0]);
                    resultDetail(data.result[0]);
                }
            }
        });
    }

    $(listId).on('click', '.result', function () {
        clicked = true;
        let id = parseInt($(this).data('id'));
        $('.module-radar .result-list .result').removeClass('active');
        $(this).addClass('active');

        results.forEach(function (item) {
            if (id == item.id) {
                resultDetail(item);
                mapMarker(item);
            }
        });
    });

    init();
    update();
};
