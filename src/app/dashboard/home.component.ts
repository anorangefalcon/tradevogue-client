import { Component, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class DashboardComponent {
  @ViewChild('nav-links') linkbtn!: ElementRef;

  isCollapse: boolean = false;
  isSalesBtnActive: boolean = false;
  isProductBtnActive: boolean = false;

  // toggleCheck(e: Event){
  //   console.log("he", this.isCollapse);
  //   if(this.isCollapse){
  //     this.isCollapse = false;
  //   }
  // }
  
  ngOnInit(){
    window.addEventListener("resize", ()=>{
      let check = window.matchMedia("(max-width: 767px)");
      if (check.matches){ 
        this.isCollapse = true;
        return;
      }
      this.isCollapse = false;
    });
  }

    


  toggle(){
    this.isCollapse = !this.isCollapse;
  }

  sales_dropdown(){
    this.isSalesBtnActive = !this.isSalesBtnActive;
  }

  product_dropdown(){
    this.isProductBtnActive = !this.isProductBtnActive;
  }
}
