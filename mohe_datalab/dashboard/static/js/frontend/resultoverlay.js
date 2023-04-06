function ResultOverlay() {
    this.marker = null;
    this.container = $('<div></div>', {'class': 'result-overlay'}).appendTo($('body'));

    var detail = $('<div></div>', {'class': 'detail'}).appendTo(this.container);
    this.detail = $("<div></div>").appendTo(detail);

    var close = $('<a class="close"><i class="glyphicon glyphicon-remove"></i></a>').appendTo(detail);
    close.click(function () {
        $('.result-overlay').fadeOut();
    });

    this.mapEnabled = false;
    this.map = null;
    this.mapContainer = null;
    this.marker = null;
}

ResultOverlay.prototype.enableMap = function () {
    if (this.mapEnabled == false) {
        this.mapEnabled = true;
        let div = $('<div></div>', {id: 'result-overlay-map-container'}).appendTo(this.container);
        this.mapContainer = $('<div></div>', {class: 'map', id: 'result-overlay-map'}).appendTo(div);
        this.map = new google.maps.Map(document.getElementById('result-overlay-map'), {
            center: {lat: 0, lng: 0},
            zoom: 11,
            minZoom: 11,
            maxZoom: 11,
            width: '100%',
            styles: mapStyle,
            disableDefaultUI: true
        });
    }
};

ResultOverlay.prototype.disableMap = function () {
    if (this.mapEnabled == true) {
        this.mapEnabled = false;
        this.map = null;
        this.mapContainer.remove();
    }
};

ResultOverlay.prototype.update = function (result) {
    this.container.show();
    var that = this;
    var url = '/api/frontend/result/' + result.id + '/';

    $.get(url, function (data) {
        var result = data.result;

        that.detail.html('');

        $('<h4></h4>').text('#' + result.id + ' ' + result.kplex).appendTo(that.detail);

        // result table
        var table = $('<table></table>', {'class': 'table'}).appendTo(that.detail);

        result.tests.sort((a, b) => { return a. name > b.name })
        for (var i = 0; i < result.tests.length; i++) {
            let test = result.tests[i];
            tr = $('<tr></tr>', {'class': 'testresult'}).appendTo(table);
            let td = $('<td></td>', {width: 20}).appendTo(tr);
            $('<span></span>', {'class': test.status}).appendTo(td);
            td = $('<td></td>').text(test.name).appendTo(tr);
        }

        $('<hr>').appendTo(that.detail)

        if (result.reference) {
            $('<label></label>').text('Reference').appendTo(that.detail)
            $('<div class="value"></div>').text(result.reference).appendTo(that.detail);
        }

        $('<label></label>').text('Name').appendTo(that.detail)
        $('<div class="value"></div>').text(result.title).appendTo(that.detail);

        $('<label></label>').text('Tester').appendTo(that.detail)
        $('<div class="value"></div>').text(result.user.name).appendTo(that.detail);

        $('<label></label>').text('Team').appendTo(that.detail)
        $('<div class="value"></div>').text(result.team.name).appendTo(that.detail);

        $('<label></label>').text('Test date').appendTo(that.detail)
        $('<div class="value"></div>').text(new Date(result.date).toLocaleString()).appendTo(that.detail);

        $('<label></label>').text('Upload date').appendTo(that.detail)
        $('<div class="value"></div>').text(new Date(result.cloud_sync_date).toLocaleString()).appendTo(that.detail);

        if (result.comment) {
            $('<label></label>').text('Comment').appendTo(that.detail)
            $('<div class="value"></div>').text(result.comment).appendTo(that.detail);
        }

        if (result.gender) {
            $('<label></label>').text('Gender').appendTo(that.detail)
            $('<div class="value"></div>').text(result.gender).appendTo(that.detail);
        }

        if (result.age) {
            $('<label></label>').text('Age').appendTo(that.detail)
            $('<div class="value"></div>').text(result.age).appendTo(that.detail);
        }


        if (result.extra_fields) {
            result.extra_fields.forEach(function (item) {
                $('<label></label>').text(item[0]).appendTo(tr);
                $('<div class="value"></div>').text(item[1]).appendTo(tr);
            });
        }
        $('<hr>').appendTo(that.detail)

        if (that.mapEnabled) {
            var position = {lat: result.lat, lng: result.lng};
            if (that.marker == null) {
                that.marker = new google.maps.Marker({
                    position: position,
                    icon: '/static/images/pin_' + result.status + '.svg',
                    map: that.map
                });
            } else {
                that.marker.setPosition(position);
            }
            that.map.setCenter(position);
        }
    });
};
