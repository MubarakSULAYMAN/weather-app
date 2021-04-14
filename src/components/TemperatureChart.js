import { Line } from "vue-chartjs";
// const { reactiveProp } = mixins;

export default {
  extends: Line,

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

  // mounted() {
  created() {
    // const dates = this.charData.map((d) => d.date).reverse();
    // const totals = this.charData.map((d) => d.total).reverse();

    this.renderChart(
      // {
      //   // labels: dates,
      //   labels: this.chartData,
      //   datasets: [
      //     {
      //       label: this.label,
      //       // data: totals,
      //       data: this.chartData,
      //     },
      //   ],
      // },
      // this.options
      this.renderChart(this.chartdata, this.options)
    );
  },
};
