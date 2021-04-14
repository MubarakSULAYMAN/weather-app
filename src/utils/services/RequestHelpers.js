import RequestService from "@/utils/services/RequestServices.js";

const api_key = "9a63c02ce2c0c7480f4017d828825f8e";

export default {
  getWeatherByCity(city_name) {
    return RequestService.get(
      `/data/2.5/weather?q=${city_name}&units=metric&appid=${api_key}`
    );
  },

  getWeatherForecastByCity(city_name) {
    return RequestService.get(
      `/data/2.5/forecast?q=${city_name}&units=metric&cnt=7&appid=${api_key}`
    );
  },

  getWeatherByGeolocation(lat, lon) {
    return RequestService.get(
      `/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
    );
  },

  getWeatherForecastByGeolocation(lat, lon) {
    return RequestService.get(
      `/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=7&appid=${api_key}`
    );
  },
};
