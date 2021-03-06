function initMap() {
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


function checkPostEditForm() {
    if($('#postEditForm')) {
        // find post edit form
        let postEditForm = document.getElementById('postEditForm');
        // add submit listener to post edit form
        postEditForm.addEventListener('submit', function(event) {
            // find length of uploaded images
            let imageUploads = document.getElementById('imageUpload').files.length;
            // find total number of existing images
            let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
            // find total number of potential deletions
            let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
            // calculate total after removal of deletions and addition of new uploads
            let newTotal = existingImgs - imgDeletions + imageUploads;
            // if newTotal is greater than four
            if(newTotal > 4) {
                // prevent form from submitting
                event.preventDefault();
                // calculate removal amount
                let removalAmt = newTotal - 4;
                // alert user of their error
                alert(`You need to remove at least ${removalAmt} (more) image${removalAmt === 1 ? '' : 's'}!`);
            }
        });
    }
}

//toggle edit review form
$('.toggle-review-edit-form').on('click', function() {
    $(this).text() === 'Edit' ? $(this).text('Cancel Edit'):$(this).text('Edit');
    $(this).parent().siblings('.edit-review-form').toggle(500);
});