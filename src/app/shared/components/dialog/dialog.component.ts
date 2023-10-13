import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent {
  @Input() type?: string;
  @ViewChild('popupclose') close!: ElementRef<HTMLButtonElement>;
  @ViewChild('dialogBox') content!: ElementRef<HTMLDivElement>;


  constructor(elementRef: ElementRef){}

  @HostListener('document:click', ['$event']) onClick(e: Event){
    
    if(!this.content.nativeElement.contains(e.target as Node)){
      (<HTMLDivElement>this.close.nativeElement.parentElement?.parentElement)?.classList.remove('popup');
    }
  }

  closeDialog(){
    (<HTMLDivElement>this.close.nativeElement.parentElement?.parentElement)?.classList.remove('popup');
  }

}
