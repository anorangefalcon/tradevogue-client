import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { HttpParams } from '@angular/common/http';
import { UtilsModule } from 'src/app/utils/backend-urls';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {

 loading : boolean = false;
 userAddresses: any=[];
 receiveData: any;
 ShowComponent: boolean = false;
 body :any;
 deletiontype!:String


 template: any = {
  title: 'Are You Sure! Want to Cancel?',
  subtitle: `You can't view this in your list anymore if you delete!`,
  type: 'confirmation',
  confirmationText: 'Yes, Cancel it',
  cancelText: 'No, Revert'
};

 constructor(private fetchDataService : FetchDataService, private backendURLs : UtilsModule, private toastService : ToastService, private dialogBox: DialogBoxService, ) {
 }

 ngOnInit(){
    this.getAddresses();
 }

  getAddresses() {
    // this.showData = 'addresses';
    // this.loading=true;
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getAddress)
      .subscribe(
        
       {
        next: (data: any) => {
        if (data) {
          data = data.addresses;
          // this.AddressLength = data.length;
          if (data.length != 0) {
            this.userAddresses = data;
          }
        }
        // this.loading=false;
      }
    ,
    error:(error)=>{
      // this.loading=false;
    }

  }


      )
  }

  AddAddress() {
    console.log('hello ');
    
    this.receiveData = '';
    this.ShowComponent = true;
  }

  AddressHandler(event: any) {
    if (!event) {
      this.ShowComponent = event;
    }


    //edit request updated
    else if (event.index === 0 || event.index) {
      this.userAddresses[event.index] = event.data;
      // this.AddressLength = this.userAddresses.length;
    }
    // // new address added
    else {
      this.userAddresses = event;
      // this.AddressLength = this.userAddresses.length;
    }

  }


  deletedAddressIndex!:number
  RemoveAddress(id: string,index:number) {
    let params = new HttpParams();
    params = params.set("address_id", id);
    
    this.body=params;
    this.deletiontype='address';
    this.deletedAddressIndex=index;
    this.template = {
      title: 'Delete Address',
      subtitle: 'Are you sure you want to delete the address?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };
    // const body = { address_id: address._id }
    this.dialogBox.confirmationDialogBox(this.template);


  }

  EditAddress(address: any, index: any) {
    const data = this.userAddresses[index];
    console.log('data is ',data);
    
    this.receiveData = { data, index };
    this.ShowComponent = true;
  }

  async MakeDefault( index: number) {
    const body = {index };
    this.fetchDataService.HTTPPATCH(this.backendURLs.URLs.setDefaultAddress, body).subscribe((data) => {
      let defaultAddress=this.userAddresses[0];
      this.userAddresses[0]=this.userAddresses[index];
      this.userAddresses[index]=defaultAddress;
      this.toastService.successToast(data);
    });
}


}
