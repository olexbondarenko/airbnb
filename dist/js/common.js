$(function () {
  $(document).ready(function () {
    // Init select subject
    $('#contact-subject').dropdown({
      titleText: '',
      toggleText: '',
      closeText: ''
    });

    // Focus on input
    var formField = document.querySelectorAll('.contact-us__form-field input, .contact-us__form-field select, .contact-us__form-field textarea');
    for (var i = 0; i < formField.length; i++) {
      formField[i].addEventListener("focus", function (e) {
        this.parentNode.classList.add('focused')
      });
      formField[i].addEventListener("blur", function (e) {
        this.parentNode.classList.remove('focused')
      })
    }

    // Click mobile menu
    document.querySelector(".mobile-menu").addEventListener("click", function () {
      this.querySelector(".mobile-menu__icon").classList.toggle("active")
      document.querySelector(".header__nav").classList.toggle("active")
    });

    // Validate form
    function validateForm(form) {
      var isValid = true;
      var formInputs = contactForm.querySelectorAll('input');
      var reName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
      var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var rePhone = /^([0-9\+\- \(\)]{8,20})$/;
      for (var i = 0; i < formInputs.length; i++) {
        formInputs[i].parentNode.classList.remove('has-error');
        var inputValid = true;
        var message = "";
        if (formInputs[i].dataset.required !== undefined) {
          var inputType = formInputs[i].getAttribute("type");
          if (inputType === "text") {
            if (inputValid && (!formInputs[i].value.match(reName))) {
              inputValid = false;
              message = "Invalide Name!";
            }
          }
          if (inputType === "tel") {
            if (inputValid && (!formInputs[i].value.match(rePhone))) {
              inputValid = false;
              message = "Invalide Phone!";
            }
          }
          if (inputType === "email") {
            if (inputValid && (!formInputs[i].value.match(reEmail))) {
              inputValid = false;
              message = "Invalide Email!";
            }
          }
          if (!inputValid) {
            isValid = false;
            formInputs[i].parentNode.classList.add('has-error');
            formInputs[i].parentNode.parentNode.querySelector('.contact-us__form-error').innerHTML = message;
          } else {
            formInputs[i].parentNode.parentNode.querySelector('.contact-us__form-error').innerHTML = "";
          }
        }
      }
      return isValid;
    }

    var contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      validateForm(contactForm);
      if (validateForm()) {
        document.querySelector(".contact-us__form-send").classList.add('disabled');
        setTimeout(function () {
          contactForm.classList.add("hidden")
          document.querySelector(".contact-us__success").classList.add('active');
          document.querySelector(".contact-us__form-send").classList.remove('disabled');
        }, 1500)
      }
    })


    // Map API settings
    var mapStyles = [{
        "elementType": "geometry",
        "stylers": [{
          "color": "#f5f5f5"
        }]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#616161"
        }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#f5f5f5"
        }]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#bdbdbd"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "color": "#eeeeee"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#757575"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
          "color": "#e5e5e5"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#9e9e9e"
        }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#757575"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "color": "#dadada"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#616161"
        }]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#9e9e9e"
        }]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
          "color": "#e5e5e5"
        }]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
          "color": "#eeeeee"
        }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#c9c9c9"
        }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#9e9e9e"
        }]
      }
    ];

    function initMap(contactMapId) {
      var contactMap = document.getElementById(contactMapId);
      var markerTitle = contactMap.dataset.title;
      var lat = contactMap.dataset.lat;
      var lng = contactMap.dataset.lng;
      var mapOptions = {
        zoom: parseFloat(contactMap.dataset.zoom),
        center: new google.maps.LatLng(lat, lng),
        styles: mapStyles,
        disableDefaultUI: true
      };
      var mapElement = document.getElementById(contactMapId);
      var map = new google.maps.Map(mapElement, mapOptions);
      var markers = contactMap.dataset.markers;
      var marker;
      if (markers.length) {
        var markersStr = markers.split(';');
        markersStr.forEach(function (item) {
          var markerCoords = item.split(',');
          if (parseFloat(markerCoords[0]) && parseFloat(markerCoords[1])) {
            marker = new google.maps.Marker({
              position: {
                lat: parseFloat(markerCoords[0]),
                lng: parseFloat(markerCoords[1])
              },
              map: map,
              title: markerTitle,
              icon: "img/marker-icon.png"
            });
            marker.setMap(map);
          }
        });
      } else {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          title: markerTitle,
          icon: "img/marker-icon.png"
        });
      }
    }
    if (document.getElementById('map')) {
      google.maps.event.addDomListener(window, 'load', initMap('map'));
    }
  });

});