var pinSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px" >' +
    '    <path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19 29.3 19 31 Z" fill="#000" fill-opacity=".2" />' +
    '    <path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8 21.9 L 13 31 L 22.2 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/>' +
    '    <path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 L 20.8 20.5 C 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="COLOR"/>' +
    '</svg>';

var clusterSvg = '<svg  width="DIAMETER" height="DIAMETER" xmlns="http://www.w3.org/2000/svg">' +
    '<circle stroke="none" fill="steelblue" opacity=".4" cx="RADIUS" cy="RADIUS" r="RADIUS" />' +
    '<circle stroke="none" fill="cornflowerblue" cx="RADIUS" cy="RADIUS" r="INNER_RADIUS" opacity=".7"/>' +
    '<text x="RADIUS" y="TEXT_Y" font-size="10pt" font-family="Arial" font-weight="normal" ' +
    'text-anchor="middle" fill="white" >COUNT</text>' +
    '</svg>';

HERE_CLEAR_ICON = null;
HERE_TRIGGER_ICON = null;

var HERE_MIN_ZOOM = 1;
var HERE_MAX_ZOOM = 17;
var HERE_DEFAULT_ZOOM = 8;

function MapsHere(container) {
    this.container = $('#' + container);
    this.platform = new H.service.Platform({
        app_id: 'DemoAppId01082013GAL',
        app_code: 'AJKnXv84fjrb0KIHawS0Tg',
        useCIT: true,
        useHTTPS: true
    });
    var defaultLayers = this.platform.createDefaultLayers();
    var lat = parseFloat(this.container.data('lat')) || 0;
    var lng = parseFloat(this.container.data('lng')) || 0;
    var zoom = parseInt(this.container.data('zoom')) || HERE_DEFAULT_ZOOM;

    this.map = new H.Map(document.getElementById(container), defaultLayers.normal.map, {
        center: {lat: lat, lng: lng},
        zoom: zoom
    });

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

    var ui = H.ui.UI.createDefault(this.map, defaultLayers);

    this.switchBaseLayer();
    HERE_CLEAR_ICON = new H.map.Icon(pinSvg.replace('COLOR', GREEN));
    HERE_TRIGGER_ICON = new H.map.Icon(pinSvg.replace('COLOR', ORANGE));

    if (this.container.hasClass('map-play')) {
        this.renderUi();
    }

    this.marker = null;
}

MapsHere.prototype.reset = function () {
    var lat = parseFloat(this.container.data('lat')) || 0;
    var lng = parseFloat(this.container.data('lng')) || 0;
    var position = {lat: lat, lng: lng};
    this.map.setCenter(position);

    var zoom = parseInt(this.container.data('zoom')) || HERE_DEFAULT_ZOOM;
    this.map.setZoom(zoom);

};

MapsHere.prototype.showResult = function (result) {
    if (this.marker != null) {
        this.map.removeObject(this.marker);
    }

    if (result.lat == 0 && result.lng == 0) {
        console.log("map reset");
        this.reset();
        return;
    }
    
    this.map.getViewPort().resize();
    var position = {lat: result.lat, lng: result.lng};
    this.map.setCenter(position);

    if (result.status == 'trigger') {
        icon = HERE_TRIGGER_ICON;
    }
    else {
        icon = HERE_CLEAR_ICON;
    }

    this.marker = new H.map.Marker(position, {icon: icon});
    this.map.addObject(this.marker);
};

MapsHere.prototype.updateResults = function (results) {
    this.results = results;
    var bbox = this.showResults(results);
    if (bbox) {
        this.map.setViewBounds(bbox);
    }
};

MapsHere.prototype.showResults = function (results) {
    if (this.clusteringLayer) {
        this.map.removeLayer(this.clusteringLayer);
    }

    var minLat = null, maxLat = null, minLng = null, maxLng = null;

    var dataPoints = results.map(function (item) {
        var point = new H.clustering.DataPoint(item.lat, item.lng, null, item);
        if (minLat == null) {
            minLat = item.lat;
            maxLat = item.lat;
            minLng = item.lng;
            maxLng = item.lng;
        }
        else {
            minLat = Math.min(minLat, item.lat);
            maxLat = Math.max(maxLat, item.lat);
            minLng = Math.min(minLng, item.lng);
            maxLng = Math.max(maxLng, item.lng);
        }
        return point;
    });

    if (dataPoints.length > 0) {
        var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
            clusteringOptions: {
                eps: 32,
                minWeight: 2
            },
            theme: this.clusterTheme
        });

        var map = this.map;

        clusteredDataProvider.addEventListener('tap', function (evt) {
            var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
            map.setCenter(coord);
            var zoom = map.getZoom();
            zoom = Math.min(zoom + 2, HERE_MAX_ZOOM);
            map.setZoom(zoom);
        });

        this.clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
        this.map.addLayer(this.clusteringLayer);

        return new H.geo.Rect(minLat, minLng, maxLat, maxLng);
    }
};


MapsHere.prototype.switchBaseLayer = function () {
    var mapTileService = this.platform.getMapTileService({
        type: 'base'
    });
    var parameters = {};

    var tileLayer = mapTileService.createTileLayer(
        'maptile', 'reduced.day', 256, 'png8', parameters
    );
    tileLayer.setMin(4);
    tileLayer.setMax(18);

    this.map.setBaseLayer(tileLayer);
};


MapsHere.prototype.clusterTheme = {
    getClusterPresentation: function (cluster) {

        var innerRadius = Math.round(Math.sqrt(cluster.getWeight()) + 15);
        var radius = innerRadius + 4;
        var diameter = radius * 2;
        var textY = radius + 5;

        var svg = clusterSvg.replace(/INNER_RADIUS/g, innerRadius)
            .replace(/DIAMETER/g, diameter)
            .replace(/RADIUS/g, radius)
            .replace(/TEXT_Y/, textY)
            .replace(/COUNT/, cluster.getWeight());
        var icon = new H.map.Icon(svg);

        return new H.map.Marker(cluster.getPosition(), {
            icon: icon,
            min: cluster.getMinZoom(),
            max: cluster.getMaxZoom()
        });
    },
    getNoisePresentation: function (noisePoint) {
        var data = noisePoint.getData();
        var icon;
        if (data.status == 'trigger') {
            icon = HERE_TRIGGER_ICON;
        }
        else {
            icon = HERE_CLEAR_ICON;
        }

        var marker = new H.map.Marker(noisePoint.getPosition(), {
            icon: icon,
            min: noisePoint.getMinZoom()
        });
        marker.setData(data);
        marker.addEventListener('pointerup', maps_here_pointerup);
        return marker;
    }
};


MapsHere.prototype.renderUi = function () {
    $('canvas').css({position: 'relative'});

    var container = $('<div></div>').css({
        position: 'absolute',
        bottom: '50px',
        right: '5px',
        color: '#fff',
        fontSize: 'normal',
        backgroundColor: 'rgba(0, 0, 0, .8)',
        padding: '6px 8px 4px',
        borderRadius: '18px',
    }).appendTo(this.container);

    var that = this;

    this.date = $('<span></span>').text('').css({padding: '0 10px'}).appendTo(container);
    this.date.hide();

    this.playButton = $('<i></i>', {'class': 'glyphicon glyphicon-play'}).css({
        'cursor': 'pointer'
    }).appendTo(container);
    this.playButton.on('click', function () {
        that.play();
    });

    this.pauseButton = $('<i></i>', {'class': 'glyphicon glyphicon-pause'}).css({
        'cursor': 'pointer'
    }).appendTo(container);
    this.pauseButton.hide();
    this.pauseButton.on('click', function () {
        that.pause();
    });

    this.stopButton = $('<i></i>', {'class': 'glyphicon glyphicon-stop'}).css({
        cursor: 'pointer'
    }).appendTo(container);
    this.stopButton.hide();
    this.stopButton.on('click', function () {
        that.stop();
    });

    this.playing = false;
    this.paused = false;
};

MapsHere.prototype.pause = function () {
    this.paused = true;
    this.playButton.show();
    this.pauseButton.hide();
};

MapsHere.prototype.stop = function () {
    this.playing = false;
    this.paused = false;

    this.playButton.show();
    this.pauseButton.hide();
    this.stopButton.hide();
    this.date.hide();
    this.showResults(this.results);
};

MapsHere.prototype.play = function () {
    this.paused = false;

    if (!this.playing) {
        this.date.show();
        this.resultsByDay = [];
        var index = -1;
        var day = null;
        for (var i = 0; i < this.results.length; i++) {
            var result = this.results[i];
            var date = new Date(result.date);
            if (day != date.getDate()) {
                day = date.getDate();
                this.resultsByDay.push([]);
                index += 1;
            }
            this.resultsByDay[index].push(result);
        }
    }

    this.playButton.hide();
    this.pauseButton.show();
    this.stopButton.show();

    var that = this;
    var index = 0;


    var _play = function () {
        if (!that.playing) {
            return;
        }

        if (!that.paused) {
            var first = that.resultsByDay[index][0];
            that.date.text(new Date(first.date).toLocaleDateString());
            that.showResults(that.resultsByDay[index], {'fixed': true});
            index++;
        }


        if (index == that.resultsByDay.length) {
            this.stop();
        }
        else {
            window.setTimeout(_play, 500);
        }
    };

    if (!this.playing) {
        this.playing = true;
        _play();
    }
};


function maps_here_pointerup(evt) {
    resultOverlay.update(evt.target.getData());
}
