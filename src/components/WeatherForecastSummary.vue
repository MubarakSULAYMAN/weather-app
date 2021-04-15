<template>
  <div>
    <div class="weather-chart">
      <div class="chart-wrap">
        <div class="chart">
          <temperature-chart
            :chartData="temperatureArr"
            :options="chartOptions"
            label="Temperature"
            :height="chartHeight"
            v-if="temperatureArr.length > 0"
          />
        </div>
      </div>
    </div>
    <div class="weather-card-wrapper">
      <div class="weather-card-grp">
        <div class="weather-card" tabindex="0" v-for="x in 7" :key="x">
          <p class="day">
            <span v-if="x === 1">Tomorrow</span>
            <span v-if="x > 1">In {{ x }} days</span>
          </p>
          <img
            :src="`http://openweathermap.org/img/wn/${iconArr[x - 1]}@2x.png`"
            alt="Weather Icon"
          />
          <div class="condition">Humidity</div>
          <div class="value">{{ humidityArr[x - 1] }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TemperatureChart from "./TemperatureChart.vue";
import api from "@/utils/services/RequestHelpers.js";

export default {
  components: { TemperatureChart },
  name: "WeatherChart",

  props: {
    city_name: {
      type: String,
      default: "Abuja",
    },
    currentTemp: {
      type: Number,
      default: 0,
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
      chartHeight: 200,
      chartOptions: {
        opacity: 1,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          // align: "start",
          // onClick: (e) => e.stopPropagation(),
          display: false,
        },
        title: {
          display: true,
          text: "Temperature",
          fontSize: 20,
          fontStyle: "normal",
          fontColor: "#7c7a7a",
        },
        // tooltips: {
        //   callbacks: {
        //     labelColor: function (tooltipItem, chart) {
        //       return {
        //         borderColor: "rgb(255, 0, 0)",
        //         backgroundColor: "rgb(255, 0, 0)",
        //       };
        //     },
        //     labelTextColor: function (tooltipItem, chart) {
        //       return "#543453";
        //     },
        //   },
        // },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                display: false,
                beginAtZero: true,
              },
            },
          ],
        },
      },

      iconArr: [],
      temperatureArr: [],
      conditionArr: [],
      humidityArr: [],
      windspeedArr: [],
      wf_request: null,
      wf_error: null,
    };
  },

  methods: {
    getResult(data) {
      this.wf_request = true;
      if (data.cod.includes(200)) {
        this.wf_request = false;
        const forecasts = data.list;
        const result = forecasts.map((a) => ({
          fc_weather_icon: a.weather[0].icon,
          fc_temperature: a.main.temp,
          fc_condition: a.weather[0].main,
          fc_humidity: a.main.humidity,
          fc_windspeed: a.wind.speed,
        }));

        let iconArr = [];
        let temperatureArr = [];
        let conditionArr = [];
        let humidityArr = [];
        let windspeedArr = [];

        for (let i = 0; i < result.length; i++) {
          iconArr.push(result[i].fc_weather_icon);
          temperatureArr.push(result[i].fc_temperature);
          conditionArr.push(result[i].fc_condition);
          humidityArr.push(result[i].fc_humidity);
          windspeedArr.push(result[i].fc_windspeed);
        }

        this.iconArr = iconArr;
        this.temperatureArr = [this.currentTemp, ...temperatureArr];
        this.weatherConditionsArr = conditionArr;
        this.humidityArr = humidityArr;
        this.windspeedArr = windspeedArr;
        this.exportData();
      } else this.wf_error = true;
    },

    async fetchCityForecast() {
      try {
        const { data } = await api.getWeatherForecastByCity(this.city_name);
        this.getResult(data);
      } catch (e) {
        console.log(e);
        this.wf_error = true;
      }
    },

    async fetchGeolocationForecast() {
      try {
        const { data } = await api.getWeatherForecastByGeolocation(
          this.lat,
          this.lon
        );
        this.getResult(data);
      } catch (e) {
        console.log(e);
        this.wf_error = true;
      }
    },

    exportData() {
      this.$emit("wfs_data", this.wf_request, this.wf_error);
    },
  },
};
</script>

<style scoped>
.weather-chart,
.weather-card-wrapper {
  display: flex;
  flex-wrap: nowrap;
}

.weather-chart {
  flex-direction: column;
  justify-content: left;
  align-items: center;
}

.chart-wrap {
  width: 100%;
  height: 200px !important;
}

.chart-wrap {
  width: 100%;
  height: 100%;
}

.weather-card-wrapper {
  overflow-x: auto;
}

.weather-card-wrapper::-webkit-scrollbar {
  display: none;
}

.weather-card-grp {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding: 5px;
  border-right: 1px solid rgb(136, 136, 255);
  border-left: 1px solid rgb(136, 136, 255);
  border-radius: 5px;
}

.weather-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 160px;
  padding: 15px 20px;
  border-radius: 5px;
  font-size: var(--font-sm);
  box-sizing: border-box;
  border: 2px solid var(--ghost-white);
  transition: all 0.2s;
}

.weather-card:not(:last-child) {
  margin-right: 10px;
}

.condition {
  color: var(--sonic-silver);
  transition: all 0.2s;
}

.weather-card:hover,
.weather-card:focus {
  color: var(--white);
  border-color: transparent;
  background-color: var(--blue-crayola);
  box-shadow: 2px 2px 8px #bebebe, -2px -2px 8px var(--white);
  cursor: pointer;
}

.weather-card:hover .condition,
.weather-card:focus .condition {
  color: var(--white);
}

.weather-card:focus {
  background: linear-gradient(
    145deg,
    var(--united-nations),
    var(--celtic-blue)
  );
  outline: none;
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
</style>
