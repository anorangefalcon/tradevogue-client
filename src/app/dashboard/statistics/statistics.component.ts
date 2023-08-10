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

  ngOnInit(): void {
    this.createBarChart();
    this.createDonut();
    // this.createTable();

    $('#datatable').DataTable({
      pagingType: 'numbers',
      pageLength: 5,
    }); 
  }

  createBarChart(){
    this.barChart = new Chart("barChart", {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: "Sales",
          data: ["30", "40", "45", "50", "49", "60", "70", "91", "125", "70", "91", "125"],
          backgroundColor: 'rgb(253, 225, 229)'
        },
        {
          label: "Profit",
          data: ["50", "20", "60", "50", "90", "40", "60", "9", "250", "80", "123", "50"],
          backgroundColor: 'rgb(136, 45, 56)'
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
        labels: ['Likes(%)', 'Dislikes(%)'],
        datasets: [{
          data: ['75', '25'],
          backgroundColor: [
            'rgba(253, 225, 229, 1)',
            'rgba(136, 45, 56, 0.9)'
          ],
          hoverOffset: 4
        }]
      }, 
      options: {
        responsive: true,
        cutout: 100,
        layout: {
          padding: 10
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
