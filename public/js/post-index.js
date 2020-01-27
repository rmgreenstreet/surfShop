// add map with center on post coordinates with a marker icon
async function createMap() {
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: post.geometry.coordinates,
      zoom: 3
    });

    // create a HTML element for post location
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for post location and add to the map
    new mapboxgl.Marker(el)
        .setLngLat(post.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
        .addTo(map);
}

const clear = document.getElementById('clear-distance');
clear.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('location').value = '';
  document.querySelectorAll('input[type=radio]:checked = false');
});

function geoFindMe(e) {
  e.preventDefault();
  const status = document.querySelector('#status');
  const locationInput = document.querySelector('#location');;
  function success(position) {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;

    status.textContent = '';
    locationInput.value = `[${lng},${lat}]`;
  }
  function error() {
    status.textContent = 'Unable to retrieve location'
  }
  if(!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported in your browser. Please upgrade to a modern browser to use this feature.'
  } else {
    status.textContent = 'Locating...';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document.querySelector('#find-me').addEventListener('click', geoFindMe);