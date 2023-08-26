import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUnhoverUnclickBlur]'
})
export class UnhoverUnclickBlurDirective {

  constructor(private Element: ElementRef) { }

  @HostListener('blur') 
  @HostListener('mouseout')
  onEvent(){
    this.Element.nativeElement.getElementsByClassName('sub-items')[0].classList.remove('active');
  }

}
