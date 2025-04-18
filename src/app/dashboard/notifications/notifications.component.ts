import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/custom-UI/notification.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
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

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private uploadService: ImageUploadService,
    private fetch: FetchDataService,
    private util: UtilsModule,
    private http: HttpClient,
    private toast: ToastService,
    private socketService: SocketService
  ) {
    // this.notificationService.getRegistrationIDs().subscribe((res)=> {
    //   this.registrationIds = res;
    // })
    this.fetch.HTTPGET(this.util.URLs.getFcmToken).subscribe((res) => {
      this.registrationIds = res;
    });

    this.loadNotifications();

    this.getFcmTokens();

    this.notificationForm = this.fb.group({
      notification: this.fb.array([
        this.fb.group({
          icon: ['', Validators.required],
          title: ['', Validators.required],
          body: [''],
          url: ['', Validators.required],
          registration_ids: this.fb.array([]),
        }),
      ]),
    });
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe((res) => {
      this.tableData = res;
    });
  }

  getFcmTokens() {
    this.fetch.HTTPGET(this.util.URLs.getFcmToken).subscribe((res) => {
      this.fcmTokens = res;
    });
  }

  deleteItem(key: any) {
    const socket = this.socketService.getNotificationSocket();
    this.selectedItem = key;
    console.log(this.selectedItem);
    if (this.selectedItem) {
      const id = this.selectedItem._id;

      const body = {
        _id: id,
      };

      this.fetch
        .HTTPPOST(this.util.URLs.deleteNotification, body)
        .subscribe((data) => {
          if (data) {
            this.loadNotifications();
            this.toast.successToast({ title: 'Notification deleted' });
            socket.emit('notificationStatus', true);
          }
        });
    }
  }

  toggle(key: any) {
    const socket = this.socketService.getNotificationSocket();
    this.selectedItem = key;
    if (this.selectedItem) {
      const id = this.selectedItem._id;
      const state = !this.selectedItem.state;

      const body = {
        id,
        state,
      };
      this.fetch
        .HTTPPOST(this.util.URLs.toggleNotification, body)
        .subscribe((res) => {
          socket.emit('notificationStatus', true);
          this.loadNotifications();
          this.getFcmTokens();
        });
    }
  }

  showItemDetails(item: any, index: any) {
    this.selectedItem = item;
    this.itemId = item._id;
    this.editingIndex = index;
    console.log(this.selectedItem, this.editingIndex);

    const notificationArray = this.notificationForm.get(
      'notification'
    ) as FormArray;
    // const specificNotificationGroup = notificationArray.at(index) as FormGroup;
    // const registrationIdsControl = specificNotificationGroup.get('registration_ids') as FormArray;
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
    const notificationArray = this.notificationForm.get(
      'notification'
    ) as FormArray;

    // Create a new form group
    const notificationGroup = this.fb.group({
      notification: this.fb.array([
        this.fb.group({
          icon: ['', Validators.required],
          title: ['', Validators.required],
          body: [''],
          url: ['', Validators.required],
          registration_ids: this.fb.array([]),
        }),
      ]),
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
    const data = {
      title: item.notification.title,
      body: item.notification.body,
      icon: item.notification.icon,
      url: item.notification.url,
      registration_ids: this.fcmTokens,
    };

    this.fetch
      .HTTPPOST(this.util.URLs.sendNotification, data)
      .subscribe((res) => {
        if (res !== undefined) {
          console.log(res, 'res is here');
          if (res) {
            this.toast.successToast({ title: 'Notification sent' });
          } else {
            this.toast.errorToast({ title: 'Notification not sent' });
          }
        } else {
          console.error('Undefined response received');
        }
      });
  }

  onUpdate() {
    if (this.notificationForm.dirty) {
      const socket = this.socketService.getNotificationSocket();
      if (this.editingIndex !== undefined) {
        const body = {
          index: this.editingIndex,
          id: this.itemId,
          data: this.notificationForm.value,
        };

        this.fetch
          .HTTPPOST(this.util.URLs.updateNotification, body)
          .subscribe((res) => {
            socket.emit('notificationStatus', true);
            this.getFcmTokens();
            this.loadNotifications();
            this.toast.successToast({ title: 'Notification updated' });
            this.notificationForm.reset();
          });
      } else {
        this.fetch
          .HTTPPOST(
            this.util.URLs.setNotifications,
            this.notificationForm.value
          )
          .subscribe((res) => {
            this.getFcmTokens();
            socket.emit('notificationStatus', true);
            this.notificationForm.reset();
            this.loadNotifications();
          });
      }
    } else {
    }
  }

  preview: any;

  getImages() {
    return this.notificationForm.get('icon')?.value;
  }

  notificationImageUpload(event: any, formIndex: any) {
    let file: any = (<HTMLInputElement>event.target)?.files![0];

    this.uploadService.fileupload([{ file: file }]).then((url: any) => {
      this.notificationForm
        .get('notification')
        ?.get(String(formIndex))
        ?.get('icon')
        ?.setValue(url[0]);
      this.getImagePreview(formIndex);
    });
  }

  getImagePreview(index: any) {
    let value = <FormArray>(
      this?.notificationForm
        ?.get('notification')
        ?.get(String(index))
        ?.get('icon')?.value
    );
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
