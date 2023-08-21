import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPopOpen]'
})
export class PopOpenDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick(){
    this.el.nativeElement.parentNode.nextSibling.show();
  }
}
