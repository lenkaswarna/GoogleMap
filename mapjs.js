function myMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 13
  });

  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(
    input, { placeIdOnly: true });
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var geocoder = new google.maps.Geocoder;
  var marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function () {
    infowindow.close();
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      return;
    }
    geocoder.geocode({ 'placeId': place.place_id }, function (results, status) {

      if (status !== 'OK') {
        window.alert('Geocoder failed due to: ' + status);
        return;
      }
      //map.setZoom(18);
      map.setCenter(results[0].geometry.location);
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      var wdata;
      marker.setPlace({
        placeId: place.place_id,
        location: results[0].geometry.location
      });


      infowindowContent.children['place-name'].textContent = 'Server error , please try again';
      marker.setVisible(true);


      var mykey = "d91d68cb0b4e423ab5d62353170907";
      urls = 'https://api.apixu.com/v1/current.json?key=' + mykey + '&q=' + place.name;

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          wdata = JSON.parse(this.responseText);
          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-temp'].textContent = wdata.current.temp_c;
          infowindowContent.children['place-wspeed'].textContent = wdata.current.wind_kph;
          infowindowContent.children['place-description'].textContent = wdata.current.condition.text;
          results[0].formatted_address;
          infowindow.open(map, marker);
        }
      };
      xhttp.open("GET", urls, true);
      xhttp.send();


      // Set the position of the marker using the place ID and location.           



    });
  });

}