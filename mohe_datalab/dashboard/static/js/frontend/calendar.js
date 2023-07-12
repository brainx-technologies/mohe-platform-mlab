DashboardModules.results = function (moduleId) {
    var apiUrl = '/api/frontend/results/' + moduleId + '/';
    var container = $("#results-" + moduleId);
    var tbody = $("#results-" + moduleId + ' .table tbody');
    var pagination = $("#module-" + moduleId + ' .pagination');

    $('#sidebar .status-choices').show();

    resultOverlay.enableMap();

    var page = 1;

    function update(page) {
        if (page == undefined || page == null) {
            page = 1;
        }
        var q = $('#id_q').val();

        $.get(apiUrl, { p: page, q: q }, function (data) {
            console.log("results module id :", moduleId);
            console.log("data :", data);
            tbody.html('');
            data.result.forEach(function (result) {
                var tr = $('<tr></tr>', { 'class': 'result' }).appendTo(tbody);
                tr.attr('data-pk', result.id);
                $('<td></td>').text('#' + result.id).appendTo(tr);
                $('<td></td>').text(new Date(result.date).toLocaleString()).appendTo(tr);
                $('<td></td>').text(result.team.name).appendTo(tr);

                $('<td></td>').text(result.kplex).appendTo(tr);
                $('<td></td>').text(result.reference).appendTo(tr);
                var td = $('<td></td>').appendTo(tr);
                $('<span></span>', { 'class': 'dot dot-' + result.status }).appendTo(td);
                var td = $('<td></td>').appendTo(tr);

                if (result.status == "trigger") {
                    var tests = [];
                    result.tests.sort((a, b) => { return a.name > b.name })
                    for (var i = 0; i < result.tests.length; i++) {
                        if (result.tests[i].status == 'positive') {
                            tests.push(result.tests[i].name);
                        }
                    }
                    td.html(tests.join('<br>'));
                }

                tr.click(function () {
                    $('.results .table tr').removeClass("active");
                    $(this).addClass("active");
                    resultOverlay.update(result);
                });
            });

            pagination.html('');

            for (var i = 1; i <= data.num_pages; i++) {
                if (i > 1 && i < data.page - 3) {
                    if (i == 2) {
                        var li = $('<li><a>...</a></li>').appendTo(pagination);
                    }
                }
                else if (i > data.page + 3 && i < data.num_pages) {
                    if (i == data.num_pages - 1) {
                        var li = $('<li><a>...</a></li>').appendTo(pagination);
                    }
                }
                else {
                    var li = $('<li></li>').appendTo(pagination);
                    if (i == data.page) {
                        li.addClass('active');
                    }
                    $('<a href="#"></a>').text(i).appendTo(li);
                }
            }
        });
    }

    pagination.on('click', 'li a', function (data) {
        var page = $(this).text();
        update(page);
    });

    $('#result_search').submit(function (e) {
        e.preventDefault();
        update(1);
    });

    update(1);

    DashboardModuleUpdate.push(update);
};
