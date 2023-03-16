export const setLocationObject = (locationObject, coordsObjects) => {
  const { latitude, longitude, name, unit } = coordsObjects;
  locationObject.latitude = latitude;
  locationObject.longitude = longitude;
  locationObject.name = name;
  if (unit) {
    locationObject.unit = unit;
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (locationObject) => {
  // const latitude = locationObject.latitude;
  // const longitude = locationObject.longitude;
  // const units = locationObject.unit;
  // const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
  // try {
  //   const weatherStream = await fetch(url);
  //   const weatherJson = await weatherStream.json();
  //   return weatherJson;
  // } catch (error) {
  //   console.error(error.stack);
  // }
  const urlDataObject = {
    latitude: locationObject.latitude,
    longitude: locationObject.longitude,
    units: locationObject.unit,
  };
  try {
    const weatherStream = await fetch("./.netlify/functions/get_weather", {
      method: "POST",
      body: JSON.stringify(urlDataObject),
    });
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (error) {
    console.error(error.stack);
  }
};

export const getCoordsFromApi = async (searchRequest, units) => {
  // const regex = /^\d+$/g;
  // const flag = regex.test(searchRequest) ? "zip" : "q";
  // const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${searchRequest}&units=${units}&appid=${WEATHER_API_KEY}`;
  // const encodedUrl = encodeURI(url);
  // try {
  //   const dataStream = await fetch(encodedUrl);
  //   const jsonData = await dataStream.json();
  //   return jsonData;
  // } catch (error) {
  //   console.error(error.stack);
  // }
  const urlDataObject = {
    request: searchRequest,
    units: units,
  };
  try {
    const dataStream = await fetch("./.netlify/functions/get_coords", {
      method: "POST",
      body: JSON.stringify(urlDataObject),
    });
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (error) {
    console.error(error);
  }
};

export const validateRequest = (request) => {
  const regex = / {2,}/g;
  const validatedRequest = request.replaceAll(regex, " ").trim();
  return validatedRequest;
};
