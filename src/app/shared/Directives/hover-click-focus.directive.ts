import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverClickFocus]'
})
export class HoverClickFocusDirective {

  constructor(private Element: ElementRef) { }

  @HostListener('click')
  @HostListener('mouseover') 
  @HostListener('focus')
  onEvent(){
    this.Element.nativeElement.getElementsByClassName('sub-items')[0].classList.add('active');

  }

}
