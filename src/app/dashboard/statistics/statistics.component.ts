import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Chart from 'chart.js/auto';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  customerCount: number = 0;
  customerCountChange: number = 0;
  orderCount: number = 0;
  orderCountChange: number = 0;
  revenue: number = 0;
  revenueChange: number = 0;
  inventoryAlert: number = 0;


  barChart: any;
  donutChart: any;
  table: any;
  reviewDataLabel: any[] = ['Satisfied', 'Neutral', 'Unsatisfied'];
  reviewData: any[] = [0, 0, 0];

  SPLabel: any[] = [];
  salesData: any[] = [];
  profitData: any[] = [];

  isCustomerChange: boolean = true;
  isOrderChange: boolean = false;
  isRevenueChange: boolean = true;

  category_sales: any = [];
  productList: any[] = [];

  constructor(private fetchdata: FetchDataService, private backendUrl: UtilsModule) { }

  ngOnInit(): void {
    this.fetchData();

    this.createBarChart();
    this.createDonut();

    // this.popularProducts();
    // this.createTable();

    // $('#datatable').DataTable({
    //   pagingType: 'numbers',
    //   pageLength: 5,
    // }); 
  }

  fetchSalesProfitStats() {
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchSalesStats).subscribe((res: any) => {
      console.log(res);
      this.salesDataUpdate(res);
      // this.revenue = 0;
      // res.salesStats.forEach((sale: any)=>{
      //     this.revenue += sale.totalSales;
      // });

      // this.salesDataUpdate(res.salesStats);

    });
  }
  fetchReviewStats() {
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchReviewStats).subscribe((res: any) => {
      this.reviewDataLabel = [];
      this.reviewData = [];
      Object.keys(res).forEach((key: any) => {
        this.reviewDataLabel.push(key);
        this.reviewData.push(res[key])
      });
      this.donutChart.update();
    });
  }

  fetchPopularStats() {
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchPopularProducts).subscribe((res: any) => {
      this.productList = res;
    });
  }

  fetchCategoryStats() {
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchCategoryStats).subscribe((res: any) => {
      this.category_sales = [];
      res.categoryStats.forEach((category: any) => {
        let temp = {
          field: category._id,
          sales: category.sales
        }
        this.category_sales.push(temp);
      });
    });
  }

  salesDataUpdate(data: any) {
    const date = new Date();
    let year = date.getFullYear();

    console.log("sales Data", data);
    data.forEach((saleData: any) => {
      if (saleData._id.year = year) {
        date.setMonth(saleData._id.month - 1);
        this.SPLabel.push(date.toDateString().split(' ')[1]);
        this.salesData.push(saleData.totalSales);
        this.profitData.push(saleData.totalProfit);
        // this.salesData[saleData._id.month - 1] = saleData.totalSales;
        // this.profitData[saleData._id.month - 1] = saleData.totalProfit;
      }
    });

    this.barChart.update();
  }

  fetchData() {
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchOverallData).subscribe((data: any) => {
      console.log("Data", data);

      this.inventoryAlert = data.alertCount;

      this.revenue = data.revenue.total;
      this.revenueChange = data.revenue.change;

      this.customerCount = data.customer.count;
      this.customerCountChange = data.customer.change;

      this.orderCount = data.orders.count;
      this.orderCountChange = data.orders.change;

      // this.revenue = 0;
      // data.salesStats.forEach((sale: any) => {
      //   this.revenue += sale.totalSales;
      // })

      this.reviewDataLabel = [];
      Object.keys(data.customerReview).forEach((key: any) => {
        this.reviewDataLabel.push(key);
        this.reviewData.push(data.customerReview[key])
      });
      this.donutChart.update();

      this.productList = data.popularStats;
      this.category_sales = [];

      data.categorySales.forEach((category: any) => {
        let temp = {
          field: category._id,
          sales: category.sales
        }
        this.category_sales.push(temp);
      });

      this.salesDataUpdate(data.salesStats);
    });
  }

  createBarChart() {

    this.barChart = new Chart("barChart", {

      type: 'line',
      data: {
        labels: this.SPLabel,
        datasets: [
          {
            label: "Profit",
            data: this.profitData,
            backgroundColor: 'rgb(0, 173, 181)',
            // maxBarThickness: 5,
            borderColor: 'rgba(0, 173, 181)',
            pointStyle: 'circle',
            borderWidth: 3,
            pointBackgroundColor: 'white'
            // borderRadius: 5,
          },
          {
            label: "Sales",
            data: this.salesData,
            backgroundColor: 'rgba(57, 62, 70)',
            borderColor: 'rgba(57, 62, 70)',
            borderWidth: 2,
            pointBorderColor: 'white'
          },
        ]
      },
      options: {
        responsive: true,
        elements: {
          point: {
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
        scales: {
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
        labels: this.reviewDataLabel,
        datasets: [{
          data: this.reviewData,
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
}
