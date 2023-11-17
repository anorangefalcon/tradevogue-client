import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent {
  @Input() title!: string;
  @Input() direction!: string;
  @Input() show!: boolean;
  @Output() showChange: EventEmitter<any> = new EventEmitter();
  @Input() ParenClosed!: boolean;
  @Output() ParentClosedEmitter: EventEmitter<any> = new EventEmitter();

  constructor() { }

  CloseWrapper() {
    this.translate = '';
    setTimeout(() => {
      this.showChange.emit(false);
      this.ParentClosedEmitter.emit(false);
    }, 300);

  }

  translate!: string;


  ngOnChanges() {
    if (this.ParenClosed) { this.CloseWrapper(); return; }
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
}
