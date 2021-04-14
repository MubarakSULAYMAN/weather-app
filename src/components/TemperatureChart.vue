<script>
import { Line } from "vue-chartjs";
// import { Line, mixins } from "vue-chartjs";
// const { reactiveProp } = mixins;

export default {
  // extends: VueChartJs.Line,
  extends: Line,
  // mixins: [reactiveProp],

  props: {
    label: {
      type: String,
    },

    chartData: {
      type: Array,
    },

    options: {
      type: Object,
    },
  },

  mounted() {
    this.renderChart(
      {
        // height: 26,
        labels: [
          "Today",
          "Tomorrow",
          "In 2 days",
          "In 3 days",
          "In 4 days",
          "In 5 days",
          "In 6 days",
          "In 7 days",
        ],
        datasets: [
          {
            label: this.label,
            data: this.chartData,
            backgroundColor: "#eef2ffff",
            borderColor: "#5a7df9ff",
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 20,
            pointBorderWidth: 2,
          },
        ],
      },
      this.options
    );
  },
};
</script>
