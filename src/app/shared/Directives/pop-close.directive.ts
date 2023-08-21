import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPopClose]'
})
export class PopCloseDirective {

  constructor(private el: ElementRef) { }
  @HostListener('click') onClick(){
    this.el.nativeElement.parentNode.parentNode.parentNode.close();
  }
}
