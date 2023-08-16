import { Component, OnInit } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.css']
})
export class FaqPageComponent implements OnInit {
  faqData!: any[];
  

     constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    const acc = this.el.nativeElement.querySelectorAll('.accordion');

    acc.forEach((item: HTMLElement) => {
      this.renderer.listen(item, 'click', () => {
        item.classList.toggle('active');
        const parent = item.parentElement;
        const panel = item.nextElementSibling as HTMLElement | null;
        // const mainPanel = document.querySelector('.main-panel');
        
        if (panel) {
          if (panel.style.maxHeight) {
            panel.style.maxHeight = "";
          } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            if (parent) {
              parent.style.maxHeight =
                (parseInt(parent.style.maxHeight) || 0) + panel.scrollHeight + 'px';
            }
          }
        }
      });
    });
  }
}