<template>
  <section>
    <p>My Weather App</p>
    <div class="home">
      <div class="city-area">
        <label for="city">Your city</label>
        <input
          type="text"
          name="city"
          id="city-name"
          :placeholder="city_name"
          v-model="city_name"
          @keydown.enter="updateRequest()"
        />
      </div>
      <div class="data-area">
        <present-weather-summary
          ref="pws"
          :city_name="city_name"
          @temp="getTemp"
        />
      </div>
      <div class="chart-area">
        <weather-forecast-summary
          ref="wfs"
          :city_name="city_name"
          :currentTemp="currentTemp"
        />
      </div>
    </div>
  </section>
</template>

<script>
import PresentWeatherSummary from "@/components/PresentWeatherSummary";
import WeatherForecastSummary from "@/components/WeatherForecastSummary";

export default {
  name: "Home",
  components: {
    PresentWeatherSummary,
    WeatherForecastSummary,
  },

  data() {
    return {
      city_name: "Abuja",
      lat: 0,
      lon: 0,
      currentTemp: 0,
      presentWeatherArr: [],
    };
  },

  methods: {
    initializeRequest() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;

          this.$refs.pws.fetchGeolocationWeather(),
            this.$refs.wfs.fetchGeolocationForecast();
        });
      } else {
        this.$refs.pws.fetchCityWeather(), this.$refs.wfs.fetchCityForecast();
      }
    },

    updateRequest() {
      this.$refs.pws.fetchCityWeather(), this.$refs.wfs.fetchCityForecast();
    },

    getTemp(x) {
      this.currentTemp = x;
    },
  },

  mounted() {
    this.initializeRequest();
  },
};
</script>

<style scoped>
section {
  width: 100vw;
  height: 100vh;
  padding: 40px;
  background: linear-gradient(
    145deg,
    var(--united-nations),
    var(--celtic-blue)
  );
  overflow: hidden;
}

p {
  position: absolute;
  top: 10px;
  left: 10px;
  color: var(--white);
  font-weight: 700;
}

.home {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 30px;
  width: 100%;
  height: 100%;
  padding: 30px 50px;
  border-radius: 20px;
  font-size: var(--font-normal);
  background-color: var(--white);
}

.city-area {
  grid-row: 1;
  grid-column: 1 / 2;
  display: flex;
  justify-content: left;
  align-items: center;
}

.data-area {
  grid-row: 2;
  grid-column: 1 / 2;
}

.chart-area {
  grid-row: 2;
  grid-column: 2 / 3;
  overflow: hidden;
}

input {
  width: 80%;
  margin-left: auto;
  padding: 5px 10px;
  border: 1px solid var(--light-gray);
  border-radius: 5px;
}

input:focus {
  border-color: var(--celtic-blue);
  outline: none;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(238, 242, 255, 0.9);
}

.day {
  font-weight: 600;
}

img {
  padding: 0%;
  height: 70px;
}

.value {
  margin-top: 10px;
  font-size: var(--font-normal);
  font-weight: 500;
}

@media screen and (max-width: 768px) {
  section {
    padding: 30px;
    width: fit-content;
    height: fit-content;
  }

  p {
    top: 8px;
    left: 8px;
    font-size: var(--font-sm);
  }

  .home {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .chart-area {
    grid-row: 3;
    grid-column: 1 / 2;
  }
}

@media screen and (max-width: 420px) {
  section {
    padding: 20px;
  }

  p {
    top: 6px;
    left: 6px;
    font-size: var(--font-xs);
  }

  .home {
    padding: 10px;
  }

  input {
    width: 70%;
  }
}
</style>
