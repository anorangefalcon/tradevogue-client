import { Component} from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class DashboardComponent {

  isCollapse: boolean = false;
  isSalesBtnActive: boolean = false;
  isProductBtnActive: boolean = false;
  title: string = ''; 

  ngOnInit(){
    window.addEventListener("resize", ()=>{
      let check = window.matchMedia("(max-width: 992px)");
      // console.log(check.matches);
      if (check.matches){ 
        this.isCollapse = true;
        console.log(this.isCollapse);
        return;
      }
      this.isCollapse = false;
    });
  }

  sales_dropdown(){
    this.isSalesBtnActive = !this.isSalesBtnActive;
  }

  product_dropdown(){
    this.isProductBtnActive = !this.isProductBtnActive;
  }
}
