import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SalesService } from 'src/app/shared/services/custom-UI/sales.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {

  salesForm!: FormGroup;
  previewImage: any;
  tableData: any;
  selectedItem: any;
  itemId: any;
  editingIndex: any;
  showEditIcon: any = true;
  allSubscriptions: Subscription[] = [];
  getSales() {
    this.allSubscriptions.push(
    this.salesService.getSales().subscribe((res) => {
      this.tableData = res;
    }))
  }

  constructor(
    private fb: FormBuilder, 
    private salesService: SalesService, 
    private uploadService: ImageUploadService, 
    private fetch: FetchDataService, 
    private dialogService: DialogBoxService,
    private util: UtilsModule,
    private router: Router,
    private toast: ToastService) {

    this.getSales();

    this.salesForm = this.fb.group({
      sale: this.fb.array([
        this.fb.group({
          backgroundImage: ['', Validators.required],
          title: ['', Validators.required],
          subTitle: ['', Validators.required],
          buttonText: ['', Validators.required],
          buttonLink: ['', Validators.required],
          colors: this.fb.group({
            titleColor: '',
            subTitleColor: '',
            buttonColor: '',
            cardColor: ''
          })
        })
      ])
    });

    this.allSubscriptions.push(
    this.dialogService.responseEmitter.subscribe({
      next: (res: any)=>{
        if(res){
          this.allSubscriptions.push(
          this.fetch.HTTPPOST(this.util.URLs.deleteSales, {_id: this.deleteId}).subscribe((data => {
            this.getSales();
            this.toast.successToast({title: 'Deleted Successfully'});
          })));
          this.getSales();
        }
      }
    }))
  }
  
  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription)=> item.unsubscribe());
  }
  deleteId: any;

  deleteItem(key: any) {
    this.selectedItem = key;
    if (this.selectedItem) {
      this.deleteId =  this.selectedItem._id;
      this.dialogService.confirmationDialogBox()
    }
  }

  toggle(key: any) {
    this.selectedItem = key;
    if (this.selectedItem) {
      const id = this.selectedItem._id;
      const enable = !this.selectedItem.enable;
      const body = {
        id, enable
      }

      this.allSubscriptions.push(
      this.fetch.HTTPPOST(this.util.URLs.toggleSales, body).subscribe((res) => {
        this.getSales();
      })
      );
    }
  }

  getLink(link: string){
    const toLink = '/' + link.split('/')[3];    
    this.router.navigateByUrl(toLink);
  }

  onCancel() {
    this.salesForm.reset();
  }

  showItemDetails(item: any, index: any) {
    this.selectedItem = item;
    this.itemId = item._id;
    this.editingIndex = index;


    this.salesForm.patchValue({
      sale: [
        {
          backgroundImage: item.backgroundImage,
          title: item.title,
          subTitle: item.subTitle,
          buttonText: item.buttonText,
          buttonLink: item.buttonLink,
          colors: {
            titleColor: item.colors.titleColor,
            subTitleColor: item.colors.subTitleColor,
            buttonColor: item.colors.buttonColor,
            cardColor: item.colors.cardColor
          }
        }
      ]
    });
  }

  addSale() {
    const saleGroup = this.fb.group({
      backgroundImage: ['', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      buttonText: ['', Validators.required],
      buttonLink: ['', Validators.required],
      colors: this.fb.group({
        titleColor: '',
        subTitleColor: '',
        buttonColor: '',
        cardColor: ''
      })
    });

    (this.salesForm.get('sale') as FormArray).push(saleGroup);
  }

  getSale() {
    return (this.salesForm.get('sale') as FormArray).controls;
  }

  removeSale(index: any) {
    (this.salesForm.get('sale') as FormArray).removeAt(index);
  }

  onUpdate() {

    if (this.salesForm.dirty) {
      if (this.editingIndex !== undefined) {
        const body = {
          index: this.editingIndex,
          id: this.itemId,
          data: this.salesForm.value
        }

        this.allSubscriptions.push(
        this.fetch.HTTPPOST(this.util.URLs.updateSales, body).subscribe((res) => {
          console.log(res, 'res');
          this.toast.successToast({title: 'Updated Successfully'});
          this.getSales();
          this.salesForm.reset();
        }))
        this.salesForm.reset();
      } else {
        this.allSubscriptions.push(
        this.salesService.setSales(this.salesForm.value).subscribe((data) => {
          this.getSales();
          this.toast.successToast({title: 'Added Successfully'});
          this.salesForm.reset();
          this.showEditIcon = true;
        }));
      }
    } else {
    }
  }

  updateContentAlign(index: number, value: string) {
    this.salesForm.get('sale')?.get(String(index))?.get('contentAlign')?.setValue(value);
  }

  preview: any;

  getImages() {
    return this.salesForm.get('backgroundImage')?.value;
  }

  saleImageUpload(event: any, formIndex: any) {

    console.log(event, 'file', formIndex, "index");

    let file: any = (<HTMLInputElement>event.target)?.files![0];

    this.uploadService.fileupload([{ file: file }]).then((url: any) => {
      this.salesForm.get('sale')?.get(String(formIndex))?.get('backgroundImage')?.setValue(url[0]);
      this.getImagePreview(formIndex);
    })
  }

  getImagePreview(index: any) {
    let value = <FormArray>((this?.salesForm?.get('sale'))?.get(String(index)))?.get('backgroundImage')?.value;
    // console.log(value, 'linkkk');

    return value;
  }

  removeImage(index: any) {
    const saleArray = this.salesForm.get('sale') as FormArray;
    const saleControl = saleArray.at(index) as FormGroup;
    saleControl.get('backgroundImage')?.reset('');
  }

  showLoading(i: number): boolean {
    return !this.getImagePreview(i);
  }
}