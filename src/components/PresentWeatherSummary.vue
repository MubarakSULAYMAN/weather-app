<template>
  <div>
    <p class="heading">{{ c_timestamp }}</p>
    <div class="weather-summary">
      <div class="current-weather">
        <div class="icon">
          <img
            :src="`http://openweathermap.org/img/wn/${weather_icon}@4x.png`"
            alt="Weather Icon"
          />
        </div>
        <div class="value">
          <div class="value-wrap">{{ c_temperature }}<span>&#8451;</span></div>
        </div>
      </div>
      <div class="condition">{{ c_condition }}</div>
    </div>
    <div class="weather-conditions">
      <div class="humidity">
        <p class="condition">Humidity</p>
        <p class="value">{{ c_humidity }}</p>
      </div>
      <div class="wind-speed">
        <p class="condition">Wind Speed</p>
        <p class="value">{{ c_windspeed }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/services/RequestHelpers.js";

export default {
  name: "WeatherData",

  props: {
    city_name: {
      type: String,
      default: "Abuja",
    },
    lat: {
      type: Number,
      default: 0,
    },
    lon: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      c_timestamp: "",
      weather_icon: "",
      c_temperature: 0,
      c_condition: "",
      c_humidity: 0,
      c_windspeed: 0,
    };
  },

  methods: {
    getResult(data) {
      const c_date = new Date(data.dt * 1000);

      const options1 = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        // "DD MM YYYY hh:mm:ss": true,
        // formatMatcher: "basic",
        // second: "numeric",
        // timeZoneName: "short",
      };

      const options2 = {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
      };

      const timeF = new Intl.DateTimeFormat("en-US", options1).format(c_date);

      const dateF = new Intl.DateTimeFormat("en-US", options2).format(c_date);

      this.c_timestamp = timeF + ", " + dateF;
      this.weather_icon = data.weather[0].icon;
      this.c_temperature = parseInt(data.main.temp.toFixed(1));
      this.c_condition = data.weather[0].main;
      this.c_humidity = data.main.humidity;
      this.c_windspeed = data.wind.speed;
      this.currentTemp();
    },

    async fetchCityWeather() {
      try {
        const { data } = await api.getWeatherByCity(this.city_name);
        this.getResult(data);
      } catch (e) {
        console.log(e);
      }
    },

    async fetchGeolocationWeather() {
      try {
        const { data } = await api.getWeatherByGeolocation(this.lat, this.lon);
        this.getResult(data);
      } catch (e) {
        console.log(e);
      }
    },

    currentTemp() {
      this.$emit("temp", this.c_temperature);
    },
  },
};
</script>

<style scoped>
p {
  margin-bottom: 20px;
  text-align: center;
}

.weather-summary {
  font-weight: 600;
}

.current-weather,
.weather-conditions {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.current-weather .icon,
.current-weather .value {
  height: 160px;
  font-size: var(--font-xl);
  font-weight: 700;
}

.current-weather .icon {
  object-fit: contain;
}

.current-weather .value div {
  position: relative;
}

.current-weather .value span {
  position: absolute;
  display: inline-block;
  font-size: var(--font-lg);
}

.current-weather .icon,
.current-weather .value,
.weather-conditions .humidity,
.weather-conditions .wind-speed {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.weather-conditions .humidity,
.weather-conditions .wind-speed {
  flex-direction: column;
  height: 100px;
}

.weather-conditions p:last-child {
  margin: 0;
}

.weather-summary .condition {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  font-size: var(--font-lg);
}

.heading,
.weather-conditions .condition {
  color: var(--sonic-silver);
}

.value {
  font-size: var(--font-md);
  font-weight: 500;
}
</style>
