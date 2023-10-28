import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent {
  @Input() direction!: string;
  @Input() show!: boolean;
  @Output() showChange: EventEmitter<any> =   new EventEmitter();
  @Input() ParenClosed!:boolean;

  //  this below is emiited becuase when parent closed the drawer and we open the the coupon than ngOnChange ParenClosed is true so it again close
  @Output() ParentClosedEmitter: EventEmitter<any> =   new EventEmitter();

constructor(private userService:UserServiceService){}

  CloseWrapper(){
    this.translate='';
    // this.show=false;
    // this.ParenClosed=false;
    setTimeout(()=>{
      this.showChange.emit(false);
      this.ParentClosedEmitter.emit(false);
    },300);
    
}




translate!:string;


ngOnChanges(){
if(this.ParenClosed) {this.CloseWrapper(); return;}

  // if(this.show==false){ this.CloseWrapper();  return;}
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

  // this.userService.DrawerClose.asObservable().subscribe((data)=>{
  //   if(data==true){
  //     this.CloseWrapper();
  //   }
  // });
 

 
}



}
