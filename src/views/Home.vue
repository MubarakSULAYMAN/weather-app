<template>
  <div>
    <section
      v-if="
        r_permission === true || (isRequesting === false && isError === false)
      "
    >
      <p class="app-name">My Weather App</p>
      <p class="location">Location: {{ city_name }}</p>
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
            @pws_data="updateData1"
          />
        </div>
        <div class="chart-area">
          <weather-forecast-summary
            ref="wfs"
            :city_name="city_name"
            :currentTemp="currentTemp"
            @wfs_data="updateData2"
          />
        </div>
      </div>
    </section>

    <div class="overlay" v-if="r_permission === true || isRequesting === true">
      <!-- || isError === true -->
      <p v-if="r_permission">{{ permission_msg }}</p>
      <p v-if="isRequesting === true">Updating Result...</p>
      <p v-if="isError === true">Request unsuccessful, kindly refresh.</p>
    </div>
  </div>
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
      permission_msg: "Requesting Permission...",
      r_permission: true,
      wfn_request: null,
      wfn_error: null,
      pwn_request: null,
      pwn_error: null,
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
        navigator.permissions
          .query({ name: "geolocation" })
          .then((geo_status) => {
            console.log("No need to check");
            if (geo_status.state !== "granted") {
              console.log("Checking...");
              let time = 10000;
              setTimeout(() => {
                if (geo_status.state === "granted") {
                  this.r_permission = false;
                  console.log((this.r_permission = false));

                  navigator.geolocation.watchPosition((position) => {
                    this.lat = position.coords.latitude;
                    this.lon = position.coords.longitude;

                    console.log("Request accepted");
                    this.geolocationRequest();
                  });
                }
                // if the permission was denied.
                console.log("Request denied");
                this.r_permission = false;
                this.defaultRequest();
              }, time);

              let timeleft = time / 1000;
              if (timeleft > 0) {
                let countdownTimer = setInterval(function () {
                  if (timeleft <= 0) {
                    clearInterval(countdownTimer);
                  }

                  this.permission_msg = `Requesting Permission, auto request will be made in ${timeleft} seconds`;
                }, 1000);
              }
            }
            this.r_permission = false;
            // this.defaultRequest();
            this.geolocationRequest();
          });
        //           this.r_permission = false;
        // this.defaultRequest();
      } else {
        this.r_permission = false;
        this.defaultRequest();
      }
    },

    defaultRequest() {
      this.$refs.pws.fetchCityWeather(), this.$refs.wfs.fetchCityForecast();
    },

    geolocationRequest() {
      this.$refs.pws.fetchGeolocationWeather(),
        this.$refs.wfs.fetchGeolocationForecast();
      // this.$refs.pws.fetchCityWeather(), this.$refs.wfs.fetchCityForecast();
    },

    updateRequest() {
      this.defaultRequest();
    },

    updateData1(...data1) {
      const [x, y, z] = data1;

      this.currentTemp = x;
      this.pwn_request = y;
      this.pwn_error = z;
      // console.log(y, z);
    },

    updateData2(...data2) {
      const [a, b, c] = data2;

      if (this.city_name === a) {
        this.city_name = a;
      }
      this.wfn_request = b;
      this.wfn_error = c;
      // console.log(a, b);
    },
  },

  computed: {
    isRequesting() {
      return [this.pwn_request, this.wfn_request].includes(true);
    },

    isError() {
      return [this.pwn_error, this.wfn_error].includes(true);
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
  color: var(--white);
  font-weight: 700;
}

p.app-name {
  top: 10px;
  left: 10px;
}

p.location {
  top: 10px;
  right: 10px;
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
  background-color: rgba(238, 242, 255, 0.95);
}

.overlay p {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: var(--font-xl);
  color: var(--celtic-blue);
  text-align: center;
  transform: translate(-50%, -50%);
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
    font-size: var(--font-sm);
  }

  p.app-name {
    top: 8px;
    left: 8px;
  }

  p.location {
    top: 8px;
    right: 8px;
  }

  .overlay p {
    font-size: var(--font-lg);
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
    font-size: var(--font-xs);
  }

  p {
    top: 6px;
    left: 6px;
  }

  p {
    top: 6px;
    right: 6px;
  }

  .overlay p {
    font-size: var(--font-md);
  }

  .home {
    padding: 10px;
  }

  input {
    width: 70%;
  }
}
</style>
