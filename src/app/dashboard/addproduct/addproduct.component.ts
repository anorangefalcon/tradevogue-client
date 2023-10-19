import { Component, ElementRef, HostListener, Renderer2, ViewEncapsulation, asNativeElements } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { imageSizeValidator, invalidformat } from 'src/app/shared/validators/imageValidators.validator';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class AddproductComponent {
  isSubmitted: boolean = false;

  // Array for Various Selects
  categories!: string[];
  brands!: string[];
  gender: string[] = ['Male', 'Female', 'Others'];
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  tags!: string[];
  orderQuantity!: number[];
  common_colors: string[] = ['#FFFFFF', '#000000', '#0000FF', '#808080', '#800080', '#00FF00', '#FFC0CB', '#ff0000'];

  productsForm: FormGroup;
  current_form: string = '';

  // Template for Toast
  data_template: any = {
    title: '',
    body: []
  }

  constructor(private fb: FormBuilder,
    private dataService: FetchDataService,
    private backendUrl: UtilsModule,
    private toastservice: ToastService,
    private upload: ImageUploadService,
    private router: Router) {

    this.productsForm = this.fb.group({

      assets: this.fb.array([

        this.fb.group({

          color: ['', {
            validators: [
              Validators.required
            ]
          }],
          photo: [[], {
            validators: [
              Validators.required,
              Validators.maxLength(6)
            ]
          }],

          stockQuantity: this.fb.array([
            this.fb.group({
              size: ['', {
                validators: [
                  Validators.required
                ]
              }],
              quantity: ['', {
                validators: [
                  Validators.required
                ]
              }],
            })
          ]),

        })
      ]),

      basicinfo: this.fb.group({
        name: ['', {
          validators: [
            Validators.required,
            invalidformat
          ]
        }],
        subTitle: ['', {
          validators: [
            Validators.required
          ]
        }],
        description: ['', {
          validators: [
            Validators.required
          ]
        }],
        info: this.fb.group({
          code: ['', {
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
          composition: ['', {
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
        }),
        price: [, {
          validators: [
            Validators.required,
          ]
        }],
      })
    });
  }

  // box-shadow: inset 0px 0px 2px #0000004
  async ngOnInit() {
    const result: any = await this.dataService.httpGet(this.backendUrl.URLs.fetchFeatures);
    this.categories = result.categories;
    this.brands = result.brands;
    this.tags = result.tags;
    this.orderQuantity = result.orderQuantity;
    this.sizes = result.sizes;
  }

  productImagesFormArray() {
    return (<FormArray>this.productsForm.get('assets')).controls;
  }

  productSubForm(field: string) {
    return this.productsForm.get('basicinfo')?.get(field);
  }

  deleteFormGroup(index: number) {
    (<FormArray>this.productsForm.get('assets')).removeAt(index);
  }

  addStockQuantityForm(index: number) {
    const template = this.fb.group({
      size: [[], {
        validators: [
          Validators.required
        ]
      }],
      quantity: ['', {
        validators: [
          Validators.required
        ]
      }],
    });
    (<FormArray>this.productsForm.get('assets')?.get(String(index))?.get('stockQuantity'))?.push(template);
  }

  productStockQuantityFormArray(index: number) {
    return (<FormArray>this.productsForm.get('assets')?.get(String(index))?.get('stockQuantity'))?.controls;
  }

  deleteStockQuantityForm(formId: number, index: number) {
    (<FormArray>this.productsForm.get('assets')?.get(String(formId))?.get('stockQuantity'))?.removeAt(index);
  }

  addProductImageForm() {
    const template = this.fb.group({
      color: ['', {
        validators: [
          Validators.required
        ]
      }],

      stockQuantity: this.fb.array([
        this.fb.group({
          size: ['', {
            validators: [
              Validators.required
            ]
          }],
          quantity: ['', {
            validators: [
              Validators.required
            ]
          }],
        })
      ]),

      photo: [[], {
        validators: [
          Validators.required,
          Validators.maxLength(6),
        ]
      }],
    });
    (<FormArray>this.productsForm.get('assets')).push(template);
  }

  checkFormStatus() {
    
    if(this.productsForm.get('basicinfo')?.valid){
      this.current_form = 'product_images';
      return;
    }
    this.productsForm.get('basicinfo')?.markAllAsTouched();
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
    let formControl = this.productsForm.get('assets')?.get(String(formId))?.get('photo');

    // Reading Files using File Reader and displaying visual Data to user
    this.fileReader(file, formControl?.value).then((res) => {
      console.log(res);

      formControl?.patchValue(res);
      let productImages = formControl?.value;

      // Handling Image Exceeding the Length Limit of 6
      if (formControl?.hasError('maxlength')) {
        console.log("inside maxlength");
        productImages = productImages.slice(0, 6);
        formControl?.patchValue(productImages);

        // Warning Message
        this.data_template.title = 'Maximum 6 Images Allowed';
        this.toastservice.warningToast(this.data_template);
      }

      const errorFiles = this.imageSizeValidator(formControl);

      if (errorFiles) {
        // Filtering Out Error Free Data
        productImages = productImages.filter((file: any) => {
          return !errorFiles.includes(file);
        });
        formControl?.patchValue(productImages);

        // Warning Message
        this.data_template.title = 'Maximum Image Size Exceeded (2MB)';
        errorFiles.forEach((err: any) => {
          this.data_template.body.push(err.file.name);
        });
        this.toastservice.warningToast(this.data_template);
      }

      // Handling Image Exceeding the Size Limit of 2MB
      // if (formControl?.hasError('exceedSize')) {
      //   console.log("Error::", formControl?.getError('errorFiles'), productImages);

      //   let errorFile = formControl?.getError('errorFiles');

      //   // Filtering Out Error Free Data
      //   productImages = productImages.filter((file: any) => {
      //     return !errorFile.includes(file);
      //   });
      //   formControl?.patchValue(productImages);

      //   // Warning Message
      //   this.data_template.title = 'Maximum Image Size Exceeded (2MB)';
      //   errorFile.forEach((err: any) => {
      //     this.data_template.body.push(err.file.name);
      //   });
      //   this.toastservice.warningToast(this.data_template);
      // }
    })
  }

  // imageSize Validator
  imageSizeValidator(control: any) {
    let imageList = control.value;

    if (imageList.length != 0) {
      let errorfiles = imageList.filter((image: any) => {
        if(image.file)
          return image.file.size > 2097152; //2MB
        return;
      });
      if (errorfiles.length != 0) return errorfiles;
    }

    return null;
  }

  // Delete Image from Image List
  deleteImage(imageIndex: any, formId: any, type = '') {
    let productImages = this.productsForm.get('assets')?.get(String(formId))?.get('photo')?.value;
    if (type != 'filestack') {
      productImages.splice(imageIndex, 1);
      this.productsForm.get('assets')?.get(String(formId))?.get('photo')?.patchValue(productImages);
      return;
    }
    this.upload.delete(productImages[imageIndex]).subscribe((res) => {
      console.log(res);
    })
  }

  // update Form Control For Custom Select buttons
  updateFormFields(e: any, field: string) {
    this.productsForm.get('basicinfo')?.get(field)?.patchValue(e);
  }

  updateColor(e: Event, index: number) {
    const color = (<HTMLInputElement>e.target).value;
  }

  // Letter Counter for Paragraph
  textarea_letterCount: number = 0;
  letterCounter(e: Event, totalcount: number) {
    this.textarea_letterCount = (<HTMLTextAreaElement>e.target).value.length;
  }

  // For  purpose of ng For loop for Displaying Images
  imagesArray(index: number) {
    return this.productsForm.get('assets')?.get(String(index))?.get('photo')?.value;
  }

  async onsubmit() {
    if (!this.productsForm.valid) {
      this.productsForm.markAllAsTouched();
    } else {
      const imageFormArray = this.productsForm.get('assets')?.value;

      // Upload Images to fileStack and last upload the form data
      imageFormArray.forEach((imageArray: any, index: number) => {
        this.upload.fileupload(imageArray['photo']).then(async (res) => {

          this.productsForm.get('assets')?.get(String(index))?.get('photo')?.patchValue(res);

          if (index == (imageFormArray.length - 1)) {
            const data = {
              type: 'single',
              data: this.productsForm.value
            };

            this.dataService.httpPost(this.backendUrl.URLs.addproduct, data).then((res: any) => {
              //Success Message
              this.data_template.title = 'Product Uploaded';
              this.toastservice.successToast(this.data_template);
              this.router.navigate(['/dashboard/products']);

            }).catch((err) => {
              console.log(err);
            })
          }

        });
      });
    }
  }
}