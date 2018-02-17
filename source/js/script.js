(function() {
  var TABLET_WIDTH = 768; //px
  var DESKTOP_WIDTH = 1300; //px

  var mainNav = document.querySelector(".main-nav");
  var navToggle = document.querySelector(".main-nav__toggle");
  var mapElement = document.querySelector("#map");
  var mapWrapper = document.querySelector(".contacts__map-wrapper");
  var toggle = document.querySelector(".toggle");
  var range = document.querySelector(".toggle__range");
  var toggleButton = document.querySelector(".toggle__button");
  var slideBefore = document.querySelector(".toggle__item--before");
  var toggleLabels = document.querySelectorAll(".toggle__label");
  var toggleButtonWidth = 34; //px
  var rangeWidth = 428; //px
  var activeLabel = null;

  var togglePosition = rangeWidth / 2; //px

  var getScreenWidth = function () {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  var setToggleState = function (position) {
    toggleButton.style = "left: " + position + "px";
    slideBefore.style = "width: " + 100 * (1 - position / rangeWidth) + "%";
  }

  var onToggleButtonDown = function (evt) {
    evt.preventDefault();
    toggleButton.focus();

    if (activeLabel !== null) {
      activeLabel.classList.remove("toggle__label--active");
    }

    var buttonCoords = getCoords(toggleButton);
    var shiftX = evt.pageX - buttonCoords.left - toggleButtonWidth / 2;

    var rangeCoords = getCoords(range);

    onButtonMouseMove = function (moveEvt) {
      var newLeft = moveEvt.pageX - shiftX - rangeCoords.left;

      if (newLeft < 0) {
        newLeft = 0;
      }

      var rightEdge = range.offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      setToggleState(newLeft);
    }

    onButtonMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onButtonMouseMove);
      document.removeEventListener('mouseup', onButtonMouseUp);
    };

    document.addEventListener('mousemove', onButtonMouseMove);
    document.addEventListener('mouseup', onButtonMouseUp);
  };

  onToggleButtonDragstart =  function () {
    return false;
  };

  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }

  var onLabelClick = function (evt) {
    if (activeLabel !== null) {
      activeLabel.classList.remove("toggle__label--active");
    }
    evt.target.classList.add("toggle__label--active");
    activeLabel = evt.target;

    if (activeLabel.classList.contains("toggle__label--before")) {
      setToggleState(0);
    } else {
      setToggleState(rangeWidth);
    }
    evt.preventDefault();
  }

  var bindToggleEvents = function () {
    var width = getScreenWidth();
    if (width >= TABLET_WIDTH) {
      setToggleState(togglePosition);
      toggleButton.addEventListener("mousedown", onToggleButtonDown);
      toggleButton.addEventListener("dragstart", onToggleButtonDragstart);

      [].forEach.call(toggleLabels, function (toggleLabel) {
        toggleLabel.addEventListener("click", onLabelClick);
        toggleLabel.addEventListener("focus", onLabelClick);
      });
    } else {
      toggleButton.style = slideBefore.style = "";
      toggleButton.removeEventListener("mousedown", onToggleButtonDown);
      toggleButton.removeEventListener("dragstart", onToggleButtonDragstart);

      [].forEach.call(toggleLabels, function (toggleLabel) {
        toggleLabel.removeEventListener("click", onLabelClick);
        toggleLabel.removeEventListener("focus", onLabelClick);
      });
    }
  };

  if (toggle) {
    bindToggleEvents();
    window.addEventListener("resize", bindToggleEvents);
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
