import { Component, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class DashboardComponent {
  @ViewChild('nav-links') linkbtn!: ElementRef;

  isCollapse: boolean = false;

  // toggleCheck(e: Event){
  //   console.log("he", this.isCollapse);
  //   if(this.isCollapse){
  //     this.isCollapse = false;
  //   }
  // }

  toggle(){
    this.isCollapse = !this.isCollapse;
  }
}
