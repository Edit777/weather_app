import CurrentLocation from "./CurrentLocation.js";
import {
  setPlaceholderText,
  addSpiner,
  displayError,
  updateScreenReaderConfirmation,
  displayApiError,
  updateDisplay,
} from "./domFunctions.js";
import {
  setLocationObject,
  getHomeLocation,
  getWeatherFromCoords,
  getCoordsFromApi,
  validateRequest,
} from "./dataFunctions.js";
const currentLocation = new CurrentLocation();

const initApp = () => {
  // get buttons
  const geolocationButton = document.getElementById("getLocation");
  const homeWeatherButton = document.getElementById("home-weather");
  const saveLocationButton = document.getElementById("saveLocation");
  const toggleUnitsButton = document.getElementById("toggleUnits");
  const refreshButton = document.getElementById("refresh");
  // add listners
  geolocationButton.addEventListener("click", getGeolocationWeather);
  homeWeatherButton.addEventListener("click", loadWeather);
  saveLocationButton.addEventListener("click", saveLocation);
  toggleUnitsButton.addEventListener("click", setUnitPreference);
  refreshButton.addEventListener("click", refreshWeather);
  // search
  const locationSearch = document.getElementById("search-bar__form");
  locationSearch.addEventListener("submit", submitNewLocation);
  // set up
  setPlaceholderText();
  // default weather
  loadWeather();
};

// listening for page loaded
document.addEventListener("DOMContentLoaded", initApp);

// set functions

const getGeolocationWeather = (event) => {
  if (event) {
    if (event.type === "click") {
      const mapIcon = document.querySelector(".fa-map-marker-alt");
      addSpiner(mapIcon);
    }
  }
  if (!navigator.geolocation) return geolocationError();
  navigator.geolocation.getCurrentPosition(
    geolocationSuccess,
    geolocationError
  );
};

const geolocationError = (errorObject) => {
  const errorMessage = errorObject ? errorObject : "Geolocation not supported.";
  displayError(errorMessage, errorMessage);
};

const geolocationSuccess = (position) => {
  const coordsObject = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`,
  };
  setLocationObject(currentLocation, coordsObject);
  updateDataAndDisplay(currentLocation);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeolocationWeather();
  if (!savedLocation && event.type == "click") {
    displayError(
      "No Home Location Saved.",
      "Sorry. Please save your home location first."
    );
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector(".fa-home");
    addSpiner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home);
    const coordsObject = {
      latitude: locationJson.latitude,
      longitude: locationJson.longitude,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObject(currentLocation, coordsObject);
    updateDataAndDisplay(currentLocation);
  }
};

const saveLocation = () => {
  if (currentLocation.latitude && currentLocation.longitude) {
    const saveIcon = document.querySelector(".fa-save");
    addSpiner(saveIcon);
    const location = {
      name: currentLocation.name,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      unit: currentLocation.unit,
    };
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
    updateScreenReaderConfirmation(
      `Saved ${currentLocation.name} as home location`
    );
  }
};

const setUnitPreference = () => {
  const unitIcon = document.querySelector(".fa-chart-bar");
  addSpiner(unitIcon);
  currentLocation.toggleUnit();
  updateDataAndDisplay(currentLocation);
};

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-sync-alt");
  addSpiner(refreshIcon);
  updateDataAndDisplay(currentLocation);
};

const submitNewLocation = async (event) => {
  event.preventDefault();
  const searchRequest = document.getElementById("search-bar__text").value;
  const validatedSearchRequest = validateRequest(searchRequest);
  if (!validatedSearchRequest.length) return;
  const searchIcon = document.querySelector(".fa-search");
  addSpiner(searchIcon);
  const coordsData = await getCoordsFromApi(
    validatedSearchRequest,
    currentLocation.unit
  );
  if (coordsData) {
    if (coordsData.cod === 200) {
      const coordsObject = {
        latitude: coordsData.coord.lat,
        longitude: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name}, ${coordsData.sys.country}`
          : coordsData.name,
      };
      setLocationObject(currentLocation, coordsObject);
      updateDataAndDisplay(currentLocation);
    } else {
      displayApiError(coordsData);
    }
  } else {
    displayError("Connection error", "Connection error");
  }
};

const updateDataAndDisplay = async (locationObject) => {
  const weatherJson = await getWeatherFromCoords(locationObject);
  if (weatherJson) updateDisplay(weatherJson, locationObject);
};
