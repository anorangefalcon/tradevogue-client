import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';


@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent {
  @Input() title!: string;
  @Input() width!:string;
  @Input() height!:string;
  @Input() direction!: string;
  @Input() show!: boolean;
  @Output() showChange: EventEmitter<any> = new EventEmitter();

  constructor() { }


  // width:string='300px';

  ngOnInit(){
    console.log(this.direction);
  }

  translate!: string;

  ngOnChanges() {
    if(!this.show)this.translate=''; 
    
    if (this.show == true) {
      if (this.direction == 'top') {
        this.translate = 'translateTop';

      }
      else if (this.direction == 'bottom') {
        this.translate = 'translateBottom';
      }

      else if (this.direction == 'left') {
        this.translate = 'translateLeft';
      }
      else if (this.direction == 'right') {
        this.translate = 'translateRight';
      }

      else if (this.direction == 'popup') {
        this.translate = 'popup_show';
      }
    }

  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.translate='';
      this.show = false;
      this.showChange.emit(false)
    }
  }
}