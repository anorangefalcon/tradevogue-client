import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SalesService } from 'src/app/shared/services/custom-UI/sales.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

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

  constructor(private fb: FormBuilder, private salesService: SalesService, private uploadService: ImageUploadService, private fetch: FetchDataService, private util : UtilsModule) {

    this.salesService.getSales().subscribe((res)=> {
      this.tableData = res;
    })

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
            buttonColor: ''
          })
        })
      ])
    })

  }
  deleteItem(key: any){
    this.selectedItem = key;
    if(this.selectedItem) {
      const id = this.selectedItem._id;

      const body = {
        _id: id
      }

      this.fetch.HTTPPOST(this.util.URLs.deleteSales, body).subscribe((data=> {
      }))
      
    }
  }

  toggle(key: any) {
    this.selectedItem = key;
    if (this.selectedItem) {
      const id = this.selectedItem._id;
      const enable = !this.selectedItem.enable;
      const body = {
        id , enable
      }

      this.fetch.HTTPPOST(this.util.URLs.toggleSales , body).subscribe((res)=> {
      })

    }
  }

  showItemDetails(item: any , index: any) {
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
            buttonColor: item.colors.buttonColor
          }
        }
      ]
    });
  }

  addSale() {
    const saleGroup = this.fb.group({
      // Define your form controls here
      backgroundImage: ['', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      buttonText: ['', Validators.required],
      buttonLink: ['', Validators.required],
      colors: this.fb.group({
        titleColor: '',
        subTitleColor: '',
        buttonColor: ''
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

        this.fetch.HTTPPOST(this.util.URLs.updateSales , body).subscribe((res)=> {
        })
        
      } else {
        this.salesService.setSales(this.salesForm.value).subscribe((data) => {
        });
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

    let file: any = (<HTMLInputElement>event.target)?.files![0];

    this.uploadService.fileupload([{ file: file }]).then((url: any) => {
      this.salesForm.get('sale')?.get(String(formIndex))?.get('backgroundImage')?.setValue(url[0]);
      this.getImagePreview(formIndex);
    })
  }

  getImagePreview(index: any) {
    let value = <FormArray>((this?.salesForm?.get('sale'))?.get(String(index)))?.get('backgroundImage')?.value;
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