import { NONE_TYPE } from '@angular/compiler';
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

  createBarChart(){
    this.barChart = new Chart("barChart", {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: "Sales",
          data: ["30", "40", "45", "50", "49", "60", "70", "91", "125", "70", "91", "125"],
          backgroundColor: 'rgba(57, 62, 70, 0.5)',
          maxBarThickness: 15
        },
        {
          label: "Profit",
          data: ["50", "20", "60", "50", "90", "40", "60", "80", "250", "80", "123", "50"],
          backgroundColor: 'rgb(0, 173, 181)',
          maxBarThickness: 15,
          pointStyle: 'circle'
        }]
      },
      options: {
        responsive: true
      }
    });
  }
  


  createDonut(){
    this.donutChart = new Chart('donutChart', {
      type: 'doughnut',

      data: {
        labels: ['Satisfied', 'Dissatisfied', 'Neutral'],
        datasets: [{
          data: ['75', '25', '50'],
          backgroundColor: [
            'rgba(0, 28, 48, 0.9)',
            'rgb(0, 173, 181)',
            'rgba(57, 62, 70, 0.5)'
          ],
          hoverOffset: 10,
          borderWidth: 2,
          borderRadius: 5,
        }]

      }, 
      options: {
        radius: 120,
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
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
