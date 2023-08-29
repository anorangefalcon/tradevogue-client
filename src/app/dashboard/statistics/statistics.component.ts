import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  barChart: any;
  // lineChart: any;
  donutChart: any;
  table: any;

  isCustomerChange: boolean = true;
  isOrderChange: boolean = false;
  isRevenueChange: boolean = true;

  ngOnInit(): void {
    this.createBarChart();
    this.createDonut();
    // this.createTable();

    // $('#datatable').DataTable({
    //   pagingType: 'numbers',
    //   pageLength: 5,
    // }); 
  }

  createBarChart() {

    this.barChart = new Chart("barChart", {

      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: "Sales",
          data: ["30", "40", "45", "50", "49", "60", "70", "91", "125", "70", "91", "125"],
          backgroundColor: 'rgba(57, 62, 70)',
          borderColor: 'rgba(57, 62, 70)',
          borderWidth: 2,
          pointBorderColor: 'white'
        },
        {
          label: "Profit",
          data: ["50", "20", "60", "50", "90", "40", "60", "80", "250", "80", "123", "50"],
          backgroundColor: 'rgb(0, 173, 181)',
          // maxBarThickness: 5,
          borderColor: 'rgba(0, 173, 181)',
          pointStyle: 'circle',
          borderWidth: 3,
          pointBackgroundColor: 'white'
          // borderRadius: 5,
        }]
      },
      options: {
        responsive: true,
        elements: {
          point:{
            radius: 5,
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              padding: 24,
              borderRadius: 200,
            },
          }
        },
        scales:{
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.08)',
            },
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.0)',
            },
          }
        }
        
      }

    });
  }



  createDonut() {
    this.donutChart = new Chart('donutChart', {
      type: 'doughnut',

      data: {
        labels: ['Satisfied', 'Dissatisfied', 'Neutral'],
        datasets: [{
          data: ['80', '30', '40'],
          backgroundColor: [
            'rgba(0, 28, 48, 0.9)',
            'rgb(0, 173, 181)',
            'rgba(57, 62, 70, 0.2)'
          ],
          hoverOffset: 10,
          borderWidth: 2,
          borderRadius: 5,
          
        }]

      },
      options: {
        // radius: 120,
        responsive: true,
        cutout: 80,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 16,
              boxHeight: 16,
              padding: 18,
              borderRadius: 200,
            },
          },
        }
      }
    });
  }

  // createLineChart(){
  //   this.lineChart = new Chart('lineChart',{
  //     type: 'line',
  //     data: [{
  //       labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //       datasets: [{
  //         label: Customer
  //       }]
  //     }]
  //   });
  // }

}
