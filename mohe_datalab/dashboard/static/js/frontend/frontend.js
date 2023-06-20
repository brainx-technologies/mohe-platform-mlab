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

    $('[data-toggle=tooltip]').tooltip({ container: 'body' })



}());

// Get the current page URL
var currentUrl = window.location.pathname;

// Get the image element by its ID
var dashboard = document.getElementById('dashboard-svg');
var map = document.getElementById('map-svg');
var results = document.getElementById('results-svg');
var calendar = document.getElementById('calendar-svg');
// Get the link element by its ID
var dashboardLink = document.getElementById('dashboard-link');
var mapLink = document.getElementById('map-link');
var resultsLink = document.getElementById('results-link');

// Check the current URL
if (currentUrl === '/dashboard/map/') {
    map.src = '/static/images/images/new_svgs/map-dark.svg';
    mapLink.style.color = '#632154';
} else if (currentUrl === '/dashboard/results/') {
    results.src = '/static/images/images/new_svgs/results-dark.svg';
    resultsLink.style.color = '#632154';
} else if (currentUrl === '/dashboard/calendar/') {
    //to be implemented
} else {
    dashboard.src = '/static/images/images/new_svgs/dashboard-dark.svg';
    dashboardLink.style.color = '#632154';
}

const toggleButton = document.getElementsByClassName('hamburger-icon')[0]
const navbar = document.getElementsByClassName('nav-bar')[0]

toggleButton.addEventListener('click', () => {
    console.log("here",navbar);
    navbar.classList.toggle('open');
})
