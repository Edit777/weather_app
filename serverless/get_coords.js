import fetch from "node-fetch";

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { request, units } = params;
  const regex = /^\d+$/g;
  const flag = regex.test(request) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${request}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encodedUrl = encodeURI(url);
  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(jsonData),
    };
  } catch (error) {
    return {
      statusCode: 422,
      body: error.stack,
    };
  }
};
