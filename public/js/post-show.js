function initMap() {
    var center = {lat: lat, lng: lng };
    var map = new 	google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: center,
        scrollwheel: false
    });
    
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var marker = new google.maps.Marker({
        position: center,
        map: map
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}