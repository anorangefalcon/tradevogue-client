import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/custom-UI/notification.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
 
  notificationForm!: FormGroup;
  previewImage: any;
  registrationIds: any;
  selectedItem: any;
  tableData: any;
  itemId: any;
  editingIndex: any;
  fcmTokens: any;

  constructor(private fb: FormBuilder, private notificationService: NotificationService, private uploadService: ImageUploadService, private fetch: FetchDataService, private util : UtilsModule, private http: HttpClient) {

    this.notificationService.getRegistrationIDs().subscribe((res)=> {
      console.log(res, "res is")
      this.registrationIds = res;
      console.log(this.registrationIds)
    })

    this.fetch.HTTPGET(this.util.URLs.getFCMtoken).subscribe((res)=> {
      this.fcmTokens= res;
      console.log(res, "fcmTokens");
    })


    this.notificationService.getNotifications().subscribe((res)=> {
      console.log(res, "res is")
      this.tableData = res;
    })


    this.notificationForm = this.fb.group({
      notification: this.fb.array([
        this.fb.group({
          icon: ['', Validators.required],
          title: ['', Validators.required],
          body: [''],
          url: ['', Validators.required],
          // registration_ids: this.fb.array([])  
        })
      ])
    });
  }

  deleteItem(key: any){
    this.selectedItem = key;
    if(this.selectedItem) {
      const id = this.selectedItem._id;
      console.log(id);

      const body = {
        _id: id
      }

      this.fetch.HTTPPOST(this.util.URLs.deleteSales, body).subscribe((data=> {
        console.log("delete data is ", data);
      }))
      
    }
  }

  toggle(key: any) {
    this.selectedItem = key;
    if (this.selectedItem) {
      const id = this.selectedItem._id;
      const state = !this.selectedItem.state;
      console.log("id is ", id , "enable is ", state)
      const body = {
        id , state
      }

      console.log(body , "toggle body")

      this.fetch.HTTPPOST(this.util.URLs.toggleNotifications , body).subscribe((res)=> {
        console.log(res , "notifications is ")
      })

    }
  }

  showItemDetails(item: any, index: any) {
    this.selectedItem = item;
    this.itemId = item._id;
    this.editingIndex = index;
    console.log(item, "index is ");
  
    const notificationArray = this.notificationForm.get('notification') as FormArray;
    notificationArray.clear();
  
    // Create an empty form group
    const notificationFormGroup = this.fb.group({
      icon: ['', Validators.required],
      title: ['', Validators.required],
      body: [''],
      url: ['', Validators.required],
    });
  
    // Patch the values from the selected item
    notificationFormGroup.patchValue(item.notification);
  
    // Push the form group to the array
    notificationArray.push(notificationFormGroup);
  }
  
  
  
  
  
  addNotification() {
    const notificationArray = this.notificationForm.get('notification') as FormArray;
  
    // Create a new form group
    const notificationGroup = this.fb.group({
      notification: this.fb.array([
        this.fb.group({
          icon: ['', Validators.required],
          title: ['', Validators.required],
          body: [''],
          url: ['', Validators.required],
          registration_ids: this.fb.array([])  // Assuming you want to keep an array here
        })
      ])
    });
  
    notificationArray.push(notificationGroup);
  }

  getNotification() {
    return (this.notificationForm.get('notification') as FormArray).controls;
  }

  removeNotification(index: any) {
    (this.notificationForm.get('notification') as FormArray).removeAt(index);
  }

  sendNotification(item: any) {
    console.log(item);
      const data = {
        title: item.notification.title,
        body: item.notification.body,
        icon: item.notification.icon,
        url: item.notification.url,
        registration_ids: this.fcmTokens
      };

      console.log(data, "data is ")

      const apiUrl = 'http://localhost:3000/send-notification';

      this.http.post(apiUrl, data).subscribe(
        (response:  any) => {
          console.log('Notification sent successfully:', response);
          // Reset the form and close the popup
          this.notificationForm.reset();
          // this.selectedTicket = {};
        },
        (error: any) => {
          console.error('Error sending notification:', error);
        }
      );
    }
  

  onUpdate() {
    if (this.notificationForm.dirty) { 
      if (this.editingIndex !== undefined) {
        console.log("done is done")
        const body = {
          index: this.editingIndex,
          id: this.itemId,
          data: this.notificationForm.value
        }

        console.log(body , "updated data ")

        this.fetch.HTTPPOST(this.util.URLs.updateNotifications , body).subscribe((res)=> {
          console.log(res , "updated sales is ")
        })
        
      } else {
        this.notificationService.setNotifications(this.notificationForm.value).subscribe((data) => {
          console.log(data, "subscribed data - New Item added");
        });
      }
    } else {
      console.log('No changes to update.');
    }
  }

  updateContentAlign(index: number, value: string) {
    this.notificationForm.get('notification')?.get(String(index))?.get('contentAlign')?.setValue(value);
  }

  preview: any;

  getImages() {
    return this.notificationForm.get('icon')?.value;
  }

  notificationImageUpload(event: any, formIndex: any) {

    let file: any = (<HTMLInputElement>event.target)?.files![0];

    this.uploadService.fileupload([{ file: file }]).then((url: any) => {
      this.notificationForm.get('notification')?.get(String(formIndex))?.get('icon')?.setValue(url[0]);
      console.log(this.notificationForm);
      this.getImagePreview(formIndex);
    })
  }

  getImagePreview(index: any) {
    let value = <FormArray>((this?.notificationForm?.get('notification'))?.get(String(index)))?.get('icon')?.value;
    return value;
  }

  removeImage(index: any) {
    const saleArray = this.notificationForm.get('notification') as FormArray;
    const saleControl = saleArray.at(index) as FormGroup;
    saleControl.get('icon')?.reset('');
  }
  showLoading(i: number): boolean {
    return !this.getImagePreview(i);
  }
}