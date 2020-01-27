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