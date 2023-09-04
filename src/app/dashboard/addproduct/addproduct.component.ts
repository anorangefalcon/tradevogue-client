import { Component, ElementRef, HostListener, Renderer2, asNativeElements } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { imageSizeValidator, invalidformat } from 'src/app/shared/validators/imageValidators.validator';
import { UploadExcelService } from '../services/upload-excel.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent {
  // Array for Various Selects
  categories: string[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6'];
  brands: string[] = ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4'];
  gender: string[] = ['Male', 'Female', 'All'];
  sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  colors: string[] = ['Color 1', 'Color 2', 'Color 3', 'Color 4'];
  tags: string[] = ['tag 1', 'tag 2', 'tag 3', 'tag 4'];
  orderQuantity: number[] = [100, 200, 300, 400, 500];

  productsForm: FormGroup;
  productImages: any = []; //Orginal File For Validation and storage
  productImagesD: any = [];
  productImageUrl: any = [];
  errorFile: any = []; //Duplicate File For display Purposes

  constructor(private elem_ref: ElementRef, 
    private render: Renderer2, 
    private fb: FormBuilder, 
    private upload: ImageUploadService,
    private excel: UploadExcelService) 
  {
    this.productsForm = this.fb.group({
      productImages: [[], {
        validators: [
          Validators.required,
          Validators.maxLength(6),
          imageSizeValidator
        ]
      }],
      productname: ['', {
        validators: [
          Validators.required,
          invalidformat
        ]
      }],
      productCode: ['', {
        validators: [
          Validators.required,
        ]
      }],
      category: ['', {
        validators: [
          Validators.required,
        ]
      }],
      brand: ['', {
        validators: [
          Validators.required,
        ]
      }],
      sizes: [[], {
        validators: [
          Validators.required
        ]
      }],
      gender: ['', {
        validators: [
          Validators.required,
        ]
      }],
      colors: ['', {
        validators: [
          Validators.required,
        ]
      }],
      tags: [[], {
        validators: [
          Validators.required
        ]
      }],
      actualprice: [, {
        validators: [
          Validators.required,
        ]
      }],
      salesPrice: [],
      discount: [0],
      discountPrice: [],
      materialType: ['', {
        validators: [
          Validators.required
        ]
      }],
      weight: ['', {
        validators: [
          Validators.required
        ]
      }],
      stockQuantity: ['', {
        validators: [
          Validators.required
        ]
      }],
      orderQuantity: [[], {
        validators: [
          Validators.required
        ]
      }]
    });
  }

  // Single Select Function for Click, Blur, Update
  element!: HTMLInputElement;

  toggleClass(e: Event) {
    this.element = <HTMLInputElement>e.target;
    let ele = <HTMLInputElement>this.element.parentElement?.nextSibling;
    $(ele).toggleClass('active');
  }

  blurClass(e: Event) {
    console.log(e);
    this.element = <HTMLInputElement>e.target;
    console.log((<HTMLInputElement>this.element.parentElement?.parentElement)?.contains(this.element));
    if (!(<HTMLInputElement>this.element.parentElement?.parentElement)?.contains(this.element)) {
      console.log("here")
      let ele = <HTMLInputElement>this.element.parentElement?.nextSibling;
      $(ele).removeClass('active');
    }
  }

  updateSelected(option: any, type: string) {
    this.productsForm.get(type)?.setValue(option);
    let ele = <HTMLInputElement>this.element.parentElement?.nextSibling;
    $(ele).removeClass('active');
  }

  // Handle Images when not added in collection
  onFileChange(event: Event) {

    let file = (<HTMLInputElement>event.target)?.files;

    for (let j = 0; j < file!.length; j++) {
      this.productImages.push(file![j]);
    }

    this.productsForm.get('productImages')?.setValue(this.productImages);

    // Check Validators Error
    // If true separate error files from accepted files
    this.errorFile = [];
    if (this.productsForm.get('productImages')?.hasError('errorFiles')) {
      let data = this.productsForm.get('productImages')?.value;

      // error section updated
      this.errorFile.push(this.productsForm.get('productImages')?.getError('errorFiles'));
      this.productImagesD = data.filter((file: any) => {
        return !this.errorFile.filter((errorfile: any)=> {return errorfile.name === file.name})
      })
      console.log(this.productImagesD);
      
    } else{
      this.productImagesD = this.productImages;
    }

    if (this.productsForm.get('productImages')?.hasError('maxlength')) {
      this.productImagesD = this.productImages.slice(0, 6);
      this.errorFile.push(this.productImages.slice(6, this.productImages.length));
      console.log(this.errorFile);
    }
  }

  // Delete Image
  deleteImage(image: any) {
    console.log("Delete");

    this.productImages = this.productImages.filter((img: any) => {
      return img.name !== image;
    });
    this.productsForm.get('productImages')?.setValue(this.productImages);
  }


  updateMultiSelected(event: Event, type: string) {
    let inputList = this.productsForm.get(type)?.value;
    let checkbox = <HTMLInputElement>event.target;

    if (checkbox.checked) {
      inputList.push(checkbox.value);
      this.productsForm.get(type)?.setValue(inputList);
    } else {
      inputList.splice(inputList.indexOf(checkbox.value), 1);
      this.productsForm.get(type)?.setValue(inputList);
    }

  }

  uploadFile(event: Event){
    let data = this.excel.handleFileInput(event);
    data.then((products)=>{
      console.log(products);
      
      let product_keys = Object.keys(products['errors']);
      product_keys.forEach((sheet)=>{
        let sheets_keys = Object.keys(products['errors'][sheet]);
        // console.log(sheets_keys);

        sheets_keys.forEach((errors)=>{
          let error_list = Object.keys(products['errors'][sheet][errors]);
          // console.log(error_list); 

          error_list.forEach((detail)=>{
            console.log(detail);
            
          })

        })
      })


    })
  }

  onsubmit() {
    this.errorFile = [];

    if (!this.productsForm.valid) {
      this.productsForm.markAllAsTouched();
    } else {
      // this.productImages.forEach(async () => {

      //   await this.upload.fileupload(this.productsForm.get('productName')?.value, this.productsForm.get('productImages')?.value)
      //     .then((response: any) => {
      //       console.log(response);
      //       this.productImageUrl.push(response);
      //     })
      //     .catch((error: any) => {
      //       this.errorFile.push(error.Error);
      //     })
      //     console.log("Hello");
      // })
    }

  }
}


