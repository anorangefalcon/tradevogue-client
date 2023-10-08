import { Component, ElementRef, HostListener, Renderer2, asNativeElements } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { imageSizeValidator, invalidformat } from 'src/app/shared/validators/imageValidators.validator';
import { UploadExcelService } from '../services/upload-excel.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent {
  isSubmitted: boolean = false;

  // Array for Various Selects
  categories: string[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6'];
  brands: string[] = ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4'];
  gender: string[] = ['Male', 'Female', 'All'];
  sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  colors: string[] = ['Color 1', 'Color 2', 'Color 3', 'Color 4'];
  tags: string[] = ['tag 1', 'tag 2', 'tag 3', 'tag 4', 'tag 5', 'tag 6', 'tag 7'];
  orderQuantity: number[] = [100, 200, 300, 400, 500];

  productsForm: FormGroup;
  current_form: string = '';

  constructor(private elem_ref: ElementRef,
    private render: Renderer2,
    private fb: FormBuilder,
    private upload: ImageUploadService,
    private excelService: UploadExcelService,
    private toastService: ToastService) {

    this.productsForm = this.fb.group({
      productDesc: this.fb.array([
        this.fb.group({
          color: ['', {
            validators: [
              Validators.required
            ]
          }],
          stockQuantity: ['', {
            validators: [
              Validators.required
            ]
          }],
          images: [[], {
            validators: [
              Validators.required,
              Validators.maxLength(6),
              imageSizeValidator
            ]
          }],
        })
      ]),

      basicinfo: this.fb.group({
        name: ['', {
          validators: [
            Validators.required,
            invalidformat
          ]
        }],
        code: ['', {
          validators: [
            Validators.required,
          ]
        }],
        subtitle: ['', {
          validators: [
            Validators.required
          ]
        }],
        description: ['', {
          validators: [
            Validators.required
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
        // discount: [],
        // discountprice: [],
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
        orderQuantity: [[], {
          validators: [
            Validators.required
          ]
        }]
      })
    });
  }

  productImagesFormArray() {
    return (<FormArray>this.productsForm.get('productDesc')).controls;
  }

  productSubForm(field: string) {
    return this.productsForm.get('basicinfo')?.get(field);
  }

  addProductImageForm() {
    const template = this.fb.group({
      color: ['', {
        validators: [
          Validators.required
        ]
      }],

      stockQuantity: ['', {
        validators: [
          Validators.required
        ]
      }],

      images: [[], {
        validators: [
          Validators.required,
          Validators.maxLength(6),
          imageSizeValidator
        ]
      }],
    });
    (<FormArray>this.productsForm.get('productDesc')).push(template);
  }

  async fileReader(file: any, image: any): Promise<any> {

    return new Promise(async (res, rej) => {

      let productImages: any[] = image;

      for (let j = 0; j < file!.length; j++) {

        const reader = new FileReader();

        let x = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            resolve({ image: e.target?.result, file: file[j] });
          }
          reader.readAsDataURL(file[j]);
        });

        productImages.push(x);
      }
      res(productImages);
    })
  }

  //Function triggered when an image/Collection of images are uplaoded & handling it error (FileReader)
  onImageUpload(event: Event, formId: number) {

    let file = (<HTMLInputElement>event.target)?.files;
    let formControl = this.productsForm.get('productDesc')?.get(String(formId))?.get('images');

    // Reading Files using File Reader and displaying visual Data to user
    this.fileReader(file, formControl?.value).then((res) => {
      console.log(res);
      
      formControl?.patchValue(res);
      let productImages = formControl?.value;

      // Handling Image Exceeding the Length Limit of 6
      if(formControl?.hasError('maxlength')) {
        console.log("inside maxlength");
        productImages = productImages.slice(0, 6);
        formControl?.patchValue(productImages);
      }

      // Handling Image Exceeding the Size Limit of 2MB
      if (formControl?.hasError('exceedSize')) {
        console.log("Error::", formControl?.getError('errorFiles'), productImages);

        let errorFile = formControl?.getError('errorFiles');

        // Filtering Out Error Free Data
        productImages = productImages.filter((file: any) => {
          return !errorFile.includes(file);
        });
        formControl?.patchValue(productImages);
      }
    })
  }

  // Delete Image from Image List
  deleteImage(imageIndex: any, formId: any) {
    let productImages = this.productsForm.get('productDesc')?.get(String(formId))?.get('images')?.value;  
    productImages.splice(imageIndex, 1)
    this.productsForm.get('productDesc')?.get(String(formId))?.get('images')?.patchValue(productImages);  
  }

  // Handles Excel File Uplaoded
  uploadFile(event: Event) {
    let data = this.excelService.handleFileInput(event);
    data.then((products) => {
      console.log(products);

      let product_keys = Object.keys(products['errors']);
      this.toastService.errorToast({
        title: 'Errors found in Excel',
        body: ['In sheet First, Second']
      })

      product_keys.forEach((sheet) => {
        let sheets_keys = Object.keys(products['errors'][sheet]);
        // console.log(sheets_keys);

        // sheets_keys.forEach((errors) => {

        //   let error_list = Object.keys(products['errors'][sheet][errors]);
        //   console.log(error_list);

        // console.log(error_list); 

        // error_list.forEach((detail) => {
        //   console.log(detail);
        // })
        // })
      })
    })
  }

  // update Form Control For Custom Select buttons
  updateFormFields(e: any, field: string) {
    this.productsForm.get('basicinfo')?.get(field)?.patchValue(e);
  }

  updateColor(e: Event, index: number) {
    const color = (<HTMLInputElement>e.target).value;
    this.productsForm.get('productImages')?.get(String(index))?.get('color')?.patchValue(color);
  }

  // Letter Counter for Paragraph
  textarea_letterCount: number = 0;
  letterCounter(e: Event, totalcount: number) {
    this.textarea_letterCount = (<HTMLTextAreaElement>e.target).value.length;
  }

  // For  purpose of ng For loop for Displaying Images
  imagesArray(index: number) {
    return this.productsForm.get('productDesc')?.get(String(index))?.get('images')?.value;
  }


  onsubmit() {

    console.log(this.productsForm);
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


