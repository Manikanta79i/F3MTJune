function getUserIPAddress(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.ipify.org/?format=json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const ip = response.ip;
            callback(ip);
        } else {
            callback('Error retrieving IP address');
        }
    };
    xhr.onerror = function() {
        callback('Error retrieving IP address');
    };
    xhr.send();
}

function redirectToInfoPage(ip) {
    window.location.href = `info.html?ip=${ip}`;
}

function onPageLoad() {
    getUserIPAddress(function(ip) {
        document.getElementById('ipData').textContent = ip;
        document.getElementById('getDataButton').addEventListener('click', function() {
            redirectToInfoPage(ip);
        });
    });
}

window.addEventListener('load', onPageLoad);