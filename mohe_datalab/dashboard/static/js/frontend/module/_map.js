var clusterStyles = [
    {
        textColor: 'white',
        url: '/static/markerclusterer/m1.png',
        height: 34,
        width: 34
    },
    {
        textColor: 'white',
        url: '/static/markerclusterer/m2.png',
        height: 50,
        width: 50
    },
    {
        textColor: 'white',
        url: '/static/markerclusterer/m3.png',
        height: 70,
        width: 70
    },
    {
        textColor: 'white',
        url: '/static/markerclusterer/m4.png',
        height: 90,
        width: 90
    },
    {
        textColor: 'white',
        url: '/static/markerclusterer/m5.png',
        height: 110,
        width: 110
    }
];

var markerImage = {
    url: '/static/markerclusterer/m0.png',
    scaledSize: new google.maps.Size(12, 12),
    anchor: new google.maps.Point(6, 6),
    origin: new google.maps.Point(0, 0),
};


DashboardModules.map = function (moduleId) {
    var module = '#module-' + moduleId;
    var mapId = "map-" + moduleId;
    var apiUrl = "/api/frontend/map/" + moduleId + "/";

    var container = $("#" + mapId);

    var lat = parseFloat(container.data("lat"));
    var lng = parseFloat(container.data("lng"));
    var zoom = parseInt(container.data("zoom"));

    var map;
    var clusterer;
    var markers = [];

    $('#sidebar .status-choices').show();

    var MapControl = function (controlDiv) {
        var playPosition = 0;
        var playTimeout;
        var playStatus = "stop";

        // Set CSS for the control border.
        var controlUI = $("<div></div>").css({
            backgroundColor: '#fff',
            border: '2px solid #fff',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
            color: 'rgb(25,25,25)',
            fontSize: '24px',
            marginBottom: "20px"
        }).appendTo(controlDiv);


        var stop = $("<i></i>", {"class": "glyphicon glyphicon-stop"}).css({padding: '0 4px'}).appendTo(controlUI);
        var play = $("<i></i>", {"class": "glyphicon glyphicon-play"}).css({padding: '0 4px'}).appendTo(controlUI);

        var progress = $("<div></div>", {"class": "progress"}).appendTo(controlUI);
        var progressBar = $("<div></div>", {
            "class": "progress-bar", role: "progressbar", "aria-valuenow": 0,
            "aria-valuemin": 0, "aria-valuemax": 100
        }).css({width: "0%", transition: "width .1s"}).appendTo(progress);

        var date = $("<div></div>", {"class": "date"}).css({
            display: "inline-block",
            verticalAlign: "top",
            padding: "0 8px",
            fontSize: "16px", lineHeight: "30px",
        }).appendTo(controlUI);

        stop.click(function () {
            clusterer.clearMarkers();
            clusterer.addMarkers(markers);
            progressBar.css({width: 0});
            playStatus = "stop";
            play.removeClass("glyphicon-pause");
            play.addClass("glyphicon-play");
        });

        var player = function () {
            if (playStatus == "play") {
                var end = playPosition + 20;
                while (playPosition < end && playPosition < markers.length) {
                    marker = markers[playPosition];
                    marker.setOpacity(0.2);
                    marker.setMap(map);
                    var p = Math.round(playPosition / markers.length * 100);
                    progressBar.css({width: p + "%"});
                    playPosition += 1;
                }
                date.text(new Date(marker.result.date).toLocaleDateString());
            }
            if (playStatus == "play" || playStatus == "pause") {
                if (playPosition < markers.length) {
                    playTimeout = window.setTimeout(player, 20);
                }
            }
        };

        play.click(function () {
            switch (playStatus) {
                case "stop":
                    playPosition = 0;
                    play.removeClass("glyphicon-play");
                    play.addClass("glyphicon-pause");
                    clusterer.clearMarkers();
                    for (var i = 0; i < markers.length; i++)
                        markers[i].setMap(null);
                    playStatus = "play";
                    playTimeout = window.setTimeout(player, 100);
                    break;
                case "play":
                    play.removeClass("glyphicon-pause");
                    play.addClass("glyphicon-play");
                    playStatus = "pause";
                    break;
                case "pause":
                    play.removeClass("glyphicon-play");
                    play.addClass("glyphicon-pause");
                    playStatus = "play";
                    break;
            }
        });

    };

    map = new google.maps.Map(document.getElementById(mapId), {
        center: {lat: 20, lng: 20},
        zoom: 3,
        minZoom: 3,
        styles: mapStyle,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false
    });


    clusterer = new MarkerClusterer(map, markers, {
        styles: clusterStyles
    });

    resultOverlay.setMap(map);

    var mapControlDiv = document.createElement('div');
    var mapControl = new MapControl(mapControlDiv);

    mapControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(mapControlDiv);


    google.maps.event.addListener(clusterer, 'clusterclick', function (cluster) {
        var markers = cluster.getMarkers();
        var results = [];
        for (var i = 0; i < markers.length; i++) {
            results.push(markers[i].result);
        }
        resultOverlay.update(results);
    });


    function update() {
        clusterer.clearMarkers();

        $.get(apiUrl, function (data) {
            var bounds = new google.maps.LatLngBounds();
            clusterer.clearMarkers();
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];
            data.result.forEach(function (result) {
                var marker = new google.maps.Marker({
                    position: {lat: result.lat, lng: result.lng},
                    icon: markerImage,
                    result: result,
                    index: markers.length
                });

                markers.push(marker);
                clusterer.addMarker(marker);
                bounds.extend(marker.getPosition());

                marker.addListener('click', function () {
                    resultOverlay.update([result]);
                });
            });

            if (markers.length > 0) {
                // center on the last (newest) marker
                map.setCenter(markers[markers.length - 1].position);
                map.setZoom(7);
            }
        });
    }

    update();

    DashboardModuleUpdate.push(update);
};
