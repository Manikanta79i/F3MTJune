const urlParams = new URLSearchParams(window.location.search);
	const ip = urlParams.get('ip');

	function displayIPData(data) {
		document.getElementById('ipData').textContent = ` ${data.ip}`;

		document.getElementById('latitudeItem').innerHTML = `Latitude: ${data.loc.split(',')[0]}`;
	document.getElementById('cityItem').innerHTML = `City: ${data.city}`;
	document.getElementById('longitudeItem').innerHTML = `Longitude: ${data.loc.split(',')[1]}`;
	document.getElementById('regionItem').innerHTML = `Region: ${data.region}`;
	document.getElementById('organizationItem').innerHTML = `Organization: ${data.org}`;
	document.getElementById('hostnameItem').innerHTML = `Hostname: ${data.hostname || 'N/A'}`;
		document.getElementById('timezone').textContent = `Timezone: ${data.timezone}`;


		const latitude = data.loc.split(',')[0];
const longitude = data.loc.split(',')[1];

const iframe = document.createElement('iframe');
iframe.setAttribute('src', `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`);
iframe.setAttribute('width', '100%');
iframe.setAttribute('height', '400px');
iframe.setAttribute('frameborder', '0');
iframe.setAttribute('style', 'border:0');

document.getElementById('mapContainer').appendChild(iframe);
		
		const currentTime = new Date().toLocaleString('en-US', { timeZone: data.timezone });
		document.getElementById('datetime').textContent = `Current Time: ${currentTime}`;
		
		document.getElementById('pincode').textContent = `Pincode: ${data.postal}`;
		document.getElementById('message').textContent = `Number of Pincodes Found: ${data.postal.length}`;
		

		// Get post offices based on pincode
		getPostOffices(data.postal);
	}

	function getPostOffices(pincode) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `https://api.postalpincode.in/pincode/${pincode}`);
		xhr.onload = function() {
			if (xhr.status === 200) {
				const response = JSON.parse(xhr.responseText);
				if (response[0].Status === "Success") {
					displayPostOffices(response[0].PostOffice);
				} else {
					displayPostOffices([]);
				}
			} else {
				displayPostOffices([]);
			}
		};
		xhr.onerror = function() {
			displayPostOffices([]);
		};
		xhr.send();
	}

	function displayPostOffices(postOffices) {
		const postOfficeList = document.getElementById('postOfficeData');
		postOfficeList.innerHTML = '';

		if (postOffices.length > 0) {
			postOffices.forEach(function(postOffice) {
				const postOfficeInfo = document.createElement('div');
				postOfficeInfo.className = 'postOfficeInfo';

				const name = document.createElement('p');
				name.textContent = `Name: ${postOffice.Name}`;

				const branchType = document.createElement('p');
				branchType.textContent = `Branch Type: ${postOffice.BranchType}`;

				const deliveryStatus = document.createElement('p');
				deliveryStatus.textContent = `Delivery Status: ${postOffice.DeliveryStatus}`;

				const district = document.createElement('p');
				district.textContent = `District: ${postOffice.District}`;

				const division = document.createElement('p');
				division.textContent = `Division: ${postOffice.Division}`;

				postOfficeInfo.appendChild(name);
				postOfficeInfo.appendChild(branchType);
				postOfficeInfo.appendChild(deliveryStatus);
				postOfficeInfo.appendChild(district);
				postOfficeInfo.appendChild(division);

				postOfficeList.appendChild(postOfficeInfo);
			});
		} else {
			const noResult = document.createElement('p');
			noResult.textContent = 'No post offices found.';
			postOfficeList.appendChild(noResult);
		}
	}

	function filterPostOffices() {
		const searchBox = document.getElementById('searchBox');
		const filter = searchBox.value.toUpperCase();
		const postOfficeList = document.getElementById('postOfficeData');
		const postOffices = postOfficeList.getElementsByClassName('postOfficeInfo');

		for (let i = 0; i < postOffices.length; i++) {
			const postOffice = postOffices[i];
			const text = postOffice.textContent.toUpperCase();
			if (text.indexOf(filter) > -1) {
				postOffice.style.display = '';
			} else {
				postOffice.style.display = 'none';
			}
		}
	}

	document.getElementById('searchBox').addEventListener('keyup', filterPostOffices);

	function fetchIPData() {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `https://ipinfo.io/${ip}/json?token=98e142206a99c6`);
		xhr.onload = function() {
			if (xhr.status === 200) {
				const response = JSON.parse(xhr.responseText);
				displayIPData(response);
			} else {
				displayIPData('Error retrieving IP information');
			}
		};
		xhr.onerror = function() {
			displayIPData('Error retrieving IP information');
		};
		xhr.send();
	}

	fetchIPData();