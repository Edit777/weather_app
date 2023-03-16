export const setPlaceholderText = () => {
  const input = document.getElementById("search-bar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip Code");
};

export const addSpiner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMessage, screenReaderMessage) => {
  updateWeatherLocationHeader(headerMessage);
  updateScreenReaderConfirmation(screenReaderMessage);
};

export const displayApiError = (statusCode) => {
  const properMessage = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMessage);
  updateScreenReaderConfirmation(`${properMessage}. Please try again`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("current-forecast__location");
  if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
    const messageArray = message.split(" ");
    const mapArray = messageArray.map((message) => {
      return message.replace(":", ": ");
    });
    const latitude =
      mapArray[0].indexOf("-") === -1
        ? mapArray[0].slice(0, 10)
        : mapArray[0].slice(0, 11);
    const longitude =
      mapArray[1].indexOf("-") === -1
        ? mapArray[1].slice(0, 11)
        : mapArray[1].slice(0, 12);
    h1.textContent = `${latitude} • ${longitude}`;
  } else {
    h1.textContent = message;
  }
};

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
};

export const updateDisplay = (weatherJson, locationObject) => {
  fadeDisplay();
  clearDisplay();
  const weatherType = getWeatherClass(weatherJson.current.weather[0].icon);
  setBgImage(weatherType);
  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObject
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObject.name);
  const currentConditionsArray = createCurrentConditionsDivs(
    weatherJson,
    locationObject.unit
  );
  displayCurrentConditions(currentConditionsArray);
  displaySixDayForecast(weatherJson);
  setFocusOnSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const currentConditions = document.getElementById("current-forecast");
  currentConditions.classList.toggle("zero-vis");
  currentConditions.classList.toggle("fade-in");
  const sixDayForecast = document.getElementById("daily-forecast");
  sixDayForecast.classList.toggle("zero-vis");
  sixDayForecast.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentConditions = document.getElementById(
    "current-forecast__conditions"
  );
  deleteContents(currentConditions);
  const sixDayForecast = document.getElementById("daily-forecast__content");
  deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  const firtsTwoCharacters = icon.slice(0, 2);
  const lastCharacter = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  let weatherType;
  if (weatherLookup[firtsTwoCharacters]) {
    weatherType = weatherLookup[firtsTwoCharacters];
  } else if (lastCharacter === "d") {
    weatherType = "clouds";
  } else {
    weatherType = "night";
  }
  return weatherType;
};

const setBgImage = (weatherType) => {
  document.documentElement.classList.add(weatherType);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherType) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObject) => {
  const location = locationObject.name;
  const unit = locationObject.unit;
  const tempUnit = unit === "imperial" ? "fahrenheit" : "celsius";
  return `${weatherJson.current.weather[0].description} and ${Math.round(
    Number(weatherJson.current.temp)
  )}°${tempUnit} in ${location}`;
};

const setFocusOnSearch = () => {
  document.getElementById("search-bar__text").focus();
};

const createCurrentConditionsDivs = (weatherObject, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainIconDiv(
    weatherObject.current.weather[0].icon,
    weatherObject.current.weather[0].description
  );
  const temp = buildElement(
    "div",
    "temp",
    `${Math.round(Number(weatherObject.current.temp))}°`
  );
  const properDesc = toProperCase(weatherObject.current.weather[0].description);
  const desc = buildElement("div", "desc", properDesc);
  const feels = buildElement(
    "div",
    "feels",
    `Fells like ${Math.round(Number(weatherObject.current.feels_like))}°`
  );
  const maxTemp = buildElement(
    "div",
    "max-temp",
    `High ${Math.round(Number(weatherObject.daily[0].temp.max))}°`
  );
  const minTemp = buildElement(
    "div",
    "min-temp",
    `Low ${Math.round(Number(weatherObject.daily[0].temp.min))}°`
  );
  const humidity = buildElement(
    "div",
    "humidity",
    `Humidity ${Math.round(Number(weatherObject.current.humidity))}%`
  );
  const wind = buildElement(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherObject.current.wind_speed))} ${windUnit}`
  );
  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainIconDiv = (icon, altText) => {
  const iconDiv = buildElement("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFontAwesome(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const buildElement = (
  elementType,
  elementClassName,
  elementText,
  elementUnit
) => {
  const element = document.createElement(elementType);
  element.className = elementClassName;
  if (elementText) {
    element.textContent = elementText;
  }
  if (elementClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.className = "unit";
    unitDiv.textContent = elementUnit;
    element.appendChild(unitDiv);
  }
  return element;
};

const translateIconToFontAwesome = (iconType) => {
  const i = document.createElement("i");
  const firtsTwoCharacters = iconType.slice(0, 2);
  const lastCharacter = iconType.slice(2);
  switch (firtsTwoCharacters) {
    case "01":
      if (lastCharacter === "d") {
        i.classList.add("far", "fa-sun");
      } else {
        i.classList.add("far", "fa-moon");
      }
      break;
    case "02":
      if (lastCharacter === "d") {
        i.classList.add("fas", "fa-cloud-sun");
      } else {
        i.classList.add("fas", "fa-cloud-moon");
      }
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastCharacter === "d") {
        i.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;
    case "13":
      i.classList.add("far", "fa-snowflake");
      break;
    case "50":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("far", "fa-question-circle");
  }
  return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
  const currentConditionsContainer = document.getElementById(
    "current-forecast__conditions"
  );
  currentConditionsArray.forEach((element) => {
    currentConditionsContainer.appendChild(element);
  });
};

const displaySixDayForecast = (weatherJson) => {
  for (let i = 1; i <= 6; i++) {
    const dailyForecastArray = createDailyForecastDivs(weatherJson.daily[i]);
    displayDailyForecast(dailyForecastArray);
  }
};

const createDailyForecastDivs = (dayForecast) => {
  const dayAbbreviationText = getDayAbbreviation(dayForecast.dt);
  const dayAbbreviation = buildElement(
    "p",
    "dayAbbreviation",
    dayAbbreviationText
  );
  const dayIcon = createDailyForecastIcon(
    dayForecast.weather[0].icon,
    dayForecast.weather[0].description
  );
  const dayHigh = buildElement(
    "p",
    "dayHigh",
    `${Math.round(Number(dayForecast.temp.max))}°`
  );
  const dayLow = buildElement(
    "p",
    "dayLow",
    `${Math.round(Number(dayForecast.temp.min))}°`
  );
  return [dayAbbreviation, dayIcon, dayHigh, dayLow];
};

const getDayAbbreviation = (data) => {
  const dateObject = new Date(data * 1000);
  const utsString = dateObject.toUTCString();
  return utsString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
  const img = document.createElement("img");
  if (window.innerWidth < 768 || window.innerHeight < 1025) {
    img.src = `https://openweathermap.org/img/wn/${icon}.png`;
  } else {
    img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
  img.alt = altText;
  return img;
};

const displayDailyForecast = (dailyForecastArray) => {
  const dayDiv = buildElement("div", "forecast-day");
  dailyForecastArray.forEach((element) => {
    dayDiv.appendChild(element);
  });
  const dailyForecastContainer = document.getElementById(
    "daily-forecast__content"
  );
  dailyForecastContainer.appendChild(dayDiv);
};
