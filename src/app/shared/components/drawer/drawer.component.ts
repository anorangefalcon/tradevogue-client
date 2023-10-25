import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent {
  @Input() direction!: string;
  @Input() show!: boolean;
  @Output() showChange: EventEmitter<any> =   new EventEmitter();
  CloseWrapper(){
    this.translate='';
    this.showChange.emit(false);
    
}

translate!:string;

ngOnChanges(){
  if(this.show == true){

    if(this.direction == 'top' ){
      this.translate='translateTop';

    }
    else if(this.direction == 'bottom'){
      this.translate='translateBottom';
    }

    else if(this.direction == 'left' ){
      this.translate='translateLeft';
    }
    else if(this.direction == 'right'){
      this.translate='translateRight';
    }
  }
 
}

}
