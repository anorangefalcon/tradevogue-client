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

  isCustomerChange: boolean = true;
  isOrderChange: boolean = false;
  isRevenueChange: boolean = true;

  category_sales: any = [];
  productList: any[] = [];
  selectedType: string = 'monthly';

  lineChart: any;
  donutChart: any;
  barChart: any;
  table: any;
  reviewDataLabel: any[] = ['Satisfied', 'Neutral', 'Unsatisfied'];
  reviewData: any[] = [50, 50, 50];

  SPLabel: any[] = [];
  salesData: any[] = [];
  profitData: any[] = [];

  constructor(private fetchdata: FetchDataService, private backendUrl: UtilsModule) { }

  ngOnInit(): void {
    this.createLineChart();
    this.createDonut();
    // this.createBarChart();
    this.resetMonthly();

    // Fetch Data
    this.fetchOverAllData();
    this.fetchSalesProfitStats();
    this.fetchCategoryStats();
    this.fetchPopularStats();
    this.fetchReviewStats();
  }

  fetchSalesProfitStats() {
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchSalesStats, {'type': this.selectedType}).subscribe((res: any) => {
      this.salesDataUpdate(res);
    });
  }

  fetchReviewStats() {
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchReviewStats).subscribe((res: any) => {

      this.reviewData = [];
      Object.keys(res).forEach((key: any) => {
        this.reviewData.push(res[key])
      });
      this.resetDonut();
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

    data.forEach((saleData: any) => {
      if (saleData._id.year = year) {

        if (this.selectedType == "monthly") {
          this.salesData[saleData._id.date - 1] = saleData.totalsales;
          this.profitData[saleData._id.date - 1] = saleData.totalProfit;
        } else {
          this.salesData[saleData._id.month - 1] = saleData.totalsales;
          this.profitData[saleData._id.month - 1] = saleData.totalProfit;
        }
      }
    });
    this.resetLineChart();
  }

  fetchOverAllData() {
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchOverallData).subscribe((data: any) => {

      this.inventoryAlert = data.alertCount;

      this.revenue = data.revenue.total;
      this.revenueChange = data.revenue.change;

      this.customerCount = data.customer.count;
      this.customerCountChange = data.customer.change;

      this.orderCount = data.orders.count;
      this.orderCountChange = data.orders.change;
    });
  }

  resetMonthly() {

    let currMonth = new Date().getMonth();
    let currYear = new Date().getFullYear();
    let monthCount = 30;

    let dataLabel = [];
    this.salesData = [];
    this.profitData = [];

    if (currMonth == 2) {
      if (currYear % 400 == 0 || (currYear % 100 != 0 && currYear % 4 == 0)) monthCount = 29;
      else monthCount = 28;
    } else if (currMonth % 2 == 0) monthCount = 30;
    else monthCount = 31;

    for (let i = 1; i <= monthCount; i++) {
      dataLabel.push(i);
      this.salesData.push(0);
      this.profitData.push(0);
    }

    this.SPLabel = dataLabel;
  }

  resetYearly() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.salesData = [];
    this.profitData = [];

    for (let i = 1; i <= 12; i++) {
      this.salesData.push(0);
      this.profitData.push(0);
    }
    this.SPLabel = months;
  }

  importData() {
    if (this.selectedType == 'monthly') {
      this.resetMonthly();
    } else {
      this.resetYearly();
    }
    this.fetchSalesProfitStats();
  }

  createLineChart() {

    this.lineChart = new Chart("lineChart", {

      type: 'line',
      data: {
        labels: this.SPLabel,
        datasets: [
          {
            label: "Profit",
            data: this.profitData,
            backgroundColor: 'rgb(0, 173, 181)',
            borderColor: 'rgba(0, 173, 181)',
            pointStyle: 'circle',
            borderWidth: 1.5,
            pointBackgroundColor: 'white',
            // yAxisID: 'y',
          },
          {
            label: "Sales",
            data: this.salesData,
            backgroundColor: 'rgba(57, 62, 70)',
            borderColor: 'rgba(57, 62, 70)',
            borderWidth: 1.5,
            pointBorderColor: 'white',
            // yAxisID: 'y1',
          },
        ]
      },
      options: {
        responsive: true,
        elements: {
          point: {
            radius: 4,
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
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          // y1: {
          //   type: 'linear',
          //   display: true,
          //   position: 'left',
          //   grid: {
          //     drawOnChartArea: false, // only want the grid lines for one axis to show up
          //   },
          // }
        }

      }

    });
  }

  resetLineChart() {
    this.lineChart.destroy();
    this.createLineChart();
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
          borderRadius: 1,
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

  resetDonut() {
    this.donutChart.destroy();
    this.createDonut();
  }


  createBarChart(){
    this.barChart = new Chart('barChart', {
      type: 'bar',

      data: {
        labels: this.reviewDataLabel,
        datasets: [{
          data: this.reviewData,
          backgroundColor: [
            'rgba(0, 28, 48, 0.9)',
            'rgb(0, 173, 181)',
            'rgba(57, 62, 70, 0.2)'
          ]
        }]
      },
    })
  }
}
