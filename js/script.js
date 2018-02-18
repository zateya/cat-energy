(function() {
  var TABLET_WIDTH = 768; //px
  var DESKTOP_WIDTH = 1300; //px

  var mainNav = document.querySelector(".main-nav");
  var navToggle = document.querySelector(".main-nav__toggle");
  var mapElement = document.querySelector("#map");
  var mapWrapper = document.querySelector(".contacts__map-wrapper");

  var getScreenWidth = function () {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  if (navToggle) {
    navToggle.classList.remove("main-nav__toggle--hidden");
    mainNav.classList.add("main-nav--closed");

    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("main-nav--opened");
      mainNav.classList.toggle("main-nav--closed");
    })
  };

  if (mapElement) {
    var map = "";
    google.maps.event.addDomListener(window, "load", init);
    google.maps.event.addDomListener(window, "resize", resizeMap);

    function init() {
      var mapOptions = {
        zoom: 16,
        mapTypeControl: false,
        zoomControl: true,
        scrollwheel: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
        },
        streetViewControl: false,
        center: new google.maps.LatLng(59.939181, 30.321469),
      };

      map = new google.maps.Map(mapElement, mapOptions);
      var image = {
        url: "img/map-pin.png",
        size: new google.maps.Size(124, 106),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(62, 106)
      };

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(59.938790, 30.323199),
        map: map,
        optimized: false,
        icon: image
      });
      resizeMap();
    }

    function resizeMap() {
      google.maps.event.trigger(map, "resize");
      var width = getScreenWidth();
      map.setZoom(width >= TABLET_WIDTH ? 17 : 16);

      if (width >= DESKTOP_WIDTH) {
        map.panTo(new google.maps.LatLng(59.939117, 30.319356));
      } else {
        map.panTo(new google.maps.LatLng(59.938790, 30.323199));
      }
    }
  }
})();
