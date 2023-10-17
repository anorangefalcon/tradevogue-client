import { Component } from '@angular/core';
import { DialogBoxService } from '../shared/services/dialog-box.service';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent {
  
  value: string = '';
  type: string = '';
  open: boolean = false;

  constructor(private dialogService: DialogBoxService){
    dialogService.contentEmitter.subscribe({
      next: (data: any) => {
        this.type = data.type;
        this.value = data.value;
      }
    })
  }

  closeDialog(){}

  delete(){
    this.dialogService.responseEmitter.next(true);
  }
  cancel(){
    this.dialogService.responseEmitter.next(false);
  }
}
