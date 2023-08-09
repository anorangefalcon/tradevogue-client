import {   
  Component, 
  ViewChild, 
  ElementRef,
  AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.css']
})
export class SidepanelComponent implements AfterViewInit {
  @ViewChild('toggleBtn') togglebtn!: ElementRef;
  @ViewChild('sidePanel') sidepanel!: ElementRef;

  ngAfterViewInit(): void {
    this.togglebtn.nativeElement.addEventListener('click', ()=>{
      this.sidepanel.nativeElement.classList.toggle('active');
    })
  }
  
}
