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
  orderCount: number = 0;
  revenue: number = 0;
  inventoryAlert: number = 0;


  barChart: any;
  donutChart: any;
  table: any;
  reviewDataLabel: any[] = ['Satisfied', 'Neutral', 'Unsatisfied'];
  reviewData: any[] = [0, 0 , 0];

  SPLabel: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  salesData: any[] = [0,0,0,0,0,0,0,0,0,0,0,0];
  profitData: any[] = [0,0,0,0,0,0,0,0,0,0,0,0];

  isCustomerChange: boolean = true;
  isOrderChange: boolean = false;
  isRevenueChange: boolean = true;

  category_sales: any = []; 

  constructor(private fetchdata: FetchDataService, private backendUrl: UtilsModule){}

  ngOnInit(): void {
    
    this.createBarChart();
    this.createDonut();

    this.popularProducts();
    this.fetchData();
    // this.createTable();

    // $('#datatable').DataTable({
    //   pagingType: 'numbers',
    //   pageLength: 5,
    // }); 
  }

  fetchData(){
    this.fetchdata.HTTPGET(this.backendUrl.URLs.fetchOverallData).subscribe((data: any)=>{
        this.reviewDataLabel = [];
        // this.reviewData = [];
        Object.keys(data.customer_review).forEach((key: any)=>{
          this.reviewDataLabel.push(key);
          this.reviewData.push(data.customer_review[key])
        });
        this.donutChart.update();

        console.log(data);
        this.customerCount = data.customer;
        this.orderCount  = data.orders;

        let sales = 0, alert = 0;
        data.productInfo[0].sales_profit.forEach((product: any)=>{
          sales += product.qtySold * product.SP;
          alert += product.alertCount;
        })
        this.revenue = sales;
        this.inventoryAlert = alert;

        this.category_sales = [];
        data.productInfo[0].category_sales_profit.forEach((category: any)=>{
          let temp = {
            field: category._id,
            sales: category.sales
          }
          this.category_sales.push(temp);
        })
    })
  }

  createBarChart() {

    this.barChart = new Chart("barChart", {

      type: 'line',
      data: {
        labels: this.SPLabel,
        datasets: [{
          label: "Sales",
          data: this.salesData,
          backgroundColor: 'rgba(57, 62, 70)',
          borderColor: 'rgba(57, 62, 70)',
          borderWidth: 2,
          pointBorderColor: 'white'
        },
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

  productList: any[] = [];


  popularProducts(){
    this.fetchdata.getSellerData().subscribe((data: any)=>{

      let products = data[0]['products'][0];
      console.log(products);
      this.productList = []; 

      products.forEach((item: any) => {

        let product = {
          image: '',
          name: '',
          category: '',
          profit: 0,
          revenue: 0,
          rating: 0
        }

        product.image = item['image'][0];
        product.name = item['name'];
        product.category = item['info']['category'];

        let reviews = item["reviews"];
        let rating = 0;
        reviews?.forEach((review: any)=>{
          rating += review['rating'];
        });
        rating /= reviews?.length;
        product.rating = rating;
        product.revenue = 20000;
        product.profit = 5000;

        this.productList.push(product);
        // Add logic if their tie in rating based upon unit sold or something
      });
      this.productList.sort((a,b)=> b.rating - a.rating); 
      this.productList = this.productList.slice(0, 3);
    })
  }
}
