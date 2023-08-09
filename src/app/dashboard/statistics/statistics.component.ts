import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  ngOnInit(): void {

    // Donut /PIE chart
    const pie_options = {
      theme: {
        palette: 'palette7' // upto palette10
      },
      chart: {
        type: 'donut',
        height: 500,
        width: 300
      },
      series: [70, 30],
      labels: ['Likes', "Dislikes"]
    }

    const pie_chart = new ApexCharts(document.querySelector('#customer-fb'), pie_options);
    pie_chart.render();

    const options = {
      theme: {
        palette: 'palette7' // upto palette10
      },

      chart: {
        type: 'line',
        height: 300,
        width: '100%'
      },
      markers: {
        size: 10,
      },
      series: [
        {
          name: 'Orders',
          data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
        }
      ],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      }
    };
    const options1 = {
      theme: {
        palette: 'palette7' // upto palette10
      },
      chart: {
        type: 'bar',
        height: 300,
        width: '100%'
      },
      legend: {
        position: "bottom"
      },
      series: [
        {
          name: 'Orders',
          data: [30, 40, 145, 50]
        }
      ],
      xaxis: {
        categories: ['Kurta', 'Jeans', 'Shirts', 'T-shirts' ]
      },
      responsive: [{
        breakpoint: 400,
        options: {
          chart: {
            width: "100%",
            height: 150,
          }
        }
      }]
    };

    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();

    const chart1 = new ApexCharts(document.querySelector('#chart1'), options1);
    chart1.render();
  }

}
