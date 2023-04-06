DashboardModules.map = function (moduleId) {
    var module = '#module-' + moduleId;
    var mapId = "map-" + moduleId;
    var apiUrl = "/api/frontend/map/" + moduleId + "/";

    var map = null;

    $('#sidebar .status-choices').show();

    var map = new MondiaMap(mapId);

    function update(initial) {
        $.get(apiUrl, function (data) {
            map.updateResults(data.result, initial);
        });
    }

    update(true);
    DashboardModuleUpdate.push(update);
};
