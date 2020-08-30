const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${latitude},${longitude}&units=f`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to the weather service', undefined);
    } else if (body.error) {
      callback('Cannot find location.', undefined);
    } else {
      const currentTemp = body.current.temperature;
      const feelsLike = body.current.feelslike;
      const weatherDescription = body.current.weather_descriptions;
      const humidity = body.current.humidity;
      callback(
        undefined,
        `${weatherDescription}: It is currently ${currentTemp} degrees and it feels like ${feelsLike} degrees. 
        The humidity is ${humidity}%`
      );
    }
  });
};

module.exports = forecast;
