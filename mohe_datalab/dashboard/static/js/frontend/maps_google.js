function MondiaMarker(result, mondiaMap) {
    this.result = result;

    var marker = new google.maps.Marker({
        position: {lat: result.lat, lng: result.lng},
        icon: '/static/images/pin_' + result.status + '.svg'
    });

    this.marker = marker;
    var that = this;

    marker.addListener('click', function () {
        var active = mondiaMap.activeMarker;
        if (active != null) {
            active.marker.setIcon('/static/images/pin_' + active.result.status + '.svg')
        }
        mondiaMap.activeMarker = that;
        marker.setIcon('/static/images/pin_' + result.status + '_active.svg')

        resultOverlay.update(result);
        var nearby = findNearbyMarkers(mondiaMap, marker);
        if (nearby.length > 1) {
            for (var i = 0; i < nearby.length; i++) {
                var nearbyMarker = nearby[i];
                var lat = marker.position.lat() + (Math.random() - 0.5) / 2000;
                var lng = marker.position.lng() + (Math.random() - 0.5) / 2000;
                nearbyMarker.setPosition({'lat': lat, 'lng': lng});
            }
        }
    });
}

function rad(x) {
    return x * Math.PI / 180;
}

function findNearbyMarkers(mondiaMap, marker) {
    var lat = marker.position.lat();
    var lng = marker.position.lng();
    var R = 6371; // radius of earth in km

    var result = [];

    for (var i = 0; i < mondiaMap.markers.length; i++) {
        var mlat = mondiaMap.markers[i].position.lat();
        var mlng = mondiaMap.markers[i].position.lng();
        var dLat = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        if (d < 0.003) {
            result.push(mondiaMap.markers[i]);
        }
    }
    return result;
}


function MondiaMap(mapId) {
    var container = $("#" + mapId);

    var lat = parseFloat(container.data("lat"));
    var lng = parseFloat(container.data("lng"));
    var zoom = parseInt(container.data("zoom"));
    this.maxZoom = 20;

    var map = new google.maps.Map(document.getElementById(mapId), {
        center: {lat: lat, lng: lng},
        zoom: zoom,
        width: '100%',
        styles: mapStyle,
        streetViewControl: false,
        mapTypeControl: true,
        scaleControl: false,
        minZoom: 3,
        maxZoom: this.maxZoom
    });


    var that = this;

    this.map = map;
    this.activeMarker = null;

    this.clusterer = new MarkerClusterer(this.map, [],
        {imagePath: '/static/markerclusterer/m', maxZoom: 16, zoomOnClick: false, averageCenter: true}
    );

    this.clusterer.addListener('click', function (src) {
        map.setCenter(src.getCenter());
        map.setZoom(map.getZoom() + 4);
    })

    this.markers = [];

    this.createControls();
    this.lock = false;
}

MondiaMap.prototype.createControls = function() {

    // Create a div to hold the control.
    var controlDiv = document.createElement('div');
    controlDiv.style.margin = "15px 0";

    controlDiv.style.color = "#fff";
    controlDiv.style.padding = "4px";
    controlDiv.style.fontSize = "20px";
    controlDiv.style.lineHeight = 1;

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var playButton = document.createElement('div');
    playButton.setAttribute("class", "glyphicon glyphicon-play");
    playButton.style.cursor = "pointer";
    playButton.style.marginRight = "10px";
    controlUI.appendChild(playButton);

    var progress = document.createElement('div');

    progress.setAttribute("class", "progress");
    controlUI.appendChild(progress);

    var progressBar = document.createElement('div');
    progressBar.setAttribute("class", "progressbar");
    progressBar.setAttribute("role", "progress-bar");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progressBar.setAttribute("aria-valuenow", "60");

    progress.appendChild(progressBar);

    this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(controlDiv);

    var that = this;
    playButton.addEventListener('click', function() {
        that.play()
    });
}


MondiaMap.prototype.play = function () {
    this.clusterer.clearMarkers();
}


MondiaMap.prototype.updateResults = function (results, isInitial) {
    if (this.lock) {
        return
    }

    this.lock = true;
    this.results = results;
    if (results.length > 0) {
        results.sort(function(a, b) { return a.date - b.date });
    }

    this.renderResults();

    /** no fit to markers
    if (isInitial) {
        this.clusterer.fitMapToMarkers();
    }
     **/

    this.lock = false;
};


MondiaMap.prototype.renderResults = function () {
    this.clusterer.clearMarkers();

    this.markers = [];

    for (var i = 0; i < this.results.length; i++) {
        var result = this.results[i];
        var mondiaMarker = new MondiaMarker(result, this);
        this.markers.push(mondiaMarker.marker);
    }

    this.clusterer.addMarkers(this.markers);
};

