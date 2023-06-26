// Function to update the image based on the alerts count
function updateImage(alertsCount) {
    var notificationImage = document.getElementById('notification-svg');
    var alertImage = document.getElementById('alert-svg');

    if (alertsCount > 0) {
        notificationImage.style.display = 'none';
        alertImage.style.display = 'block';
    } else {
        notificationImage.style.display = 'block';
        alertImage.style.display = 'none';
    }
}
// Function to fetch alerts count from the API
function fetchAlertsCount() {
    // Make an AJAX request to the API endpoint
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/frontend/alert/count/', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var alertsCount = response.new;

            updateImage(alertsCount);
        }
    };

    xhr.send();
}
// Fetch alerts count initially
fetchAlertsCount();
// Fetch alerts count every 5000ms
setInterval(fetchAlertsCount, 5000);









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
} else if (currentUrl === '/') {
    dashboard.src = '/static/images/images/new_svgs/dashboard-dark.svg';
    dashboardLink.style.color = '#632154';
} else {
    console.log("current url :", currentUrl);
}

const toggleButton = document.getElementsByClassName('hamburger-icon')[0]
const navbar = document.getElementsByClassName('nav-bar')[0]

toggleButton.addEventListener('click', () => {
    navbar.classList.toggle('open');
})
