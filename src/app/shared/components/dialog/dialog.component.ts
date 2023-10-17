import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DialogComponent {

  @Input() type?: string;
  @Input() name?: string;
  @Output() reply = new EventEmitter<Boolean>;
  @ViewChild('popupclose') close!: ElementRef<HTMLButtonElement>;
  @ViewChild('dialogbox') content!: ElementRef;

  // type!: string;
  constructor(elementRef: ElementRef){}

  // @HostListener('document:click', ['$event']) onClick(e: Event){
    
  //   if(!this.content.nativeElement.contains(e.target as Node)){
  //     (<HTMLDivElement>this.close.nativeElement.parentElement?.parentElement)?.classList.remove('popup');
  //   }
  // }

  // ngAfterViewInit(){
  //   console.log(<HTMLDivElement>this.content.nativeElement);
  //   (<HTMLDivElement>this.content.nativeElement).classList.add('popup');
  // }

  closeDialog(){
    (<HTMLDivElement>this.close.nativeElement.parentElement?.parentElement)?.classList.remove('popup');
  }

  response(e: Event, res: boolean){
    this.reply.emit(res);
  }


  // open(){
  //   (<HTMLDivElement>this.content.nativeElement).classList.add('popup');
  // }
}
