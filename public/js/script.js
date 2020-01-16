function initMap() {
    if($('#map')) {
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
    $(this).text() === 'Edit Review' ? $(this).text('Cancel Edit'):$(this).text('Edit Review');
    $(this).siblings('.edit-review-form').toggle(500);
});