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
  // colors: string[] = ['Color 1', 'Color 2', 'Color 3', 'Color 4'];
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

  constructor(private elem_ref: ElementRef,
    private render: Renderer2,
    private fb: FormBuilder,
    private dataService: FetchDataService,
    private backendUrl: UtilsModule,
    private toastservice: ToastService,
    private upload: ImageUploadService,
    private router: Router) {

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
          photo: [[], {
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
    return (<FormArray>this.productsForm.get('productDesc')).controls;
  }

  productSubForm(field: string) {
    return this.productsForm.get('basicinfo')?.get(field);
  }

  deleteFormGroup(index: number) {
    (<FormArray>this.productsForm.get('productDesc')).removeAt(index);
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

      photo: [[], {
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
    let formControl = this.productsForm.get('productDesc')?.get(String(formId))?.get('photo');

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

      // Handling Image Exceeding the Size Limit of 2MB
      if (formControl?.hasError('exceedSize')) {
        console.log("Error::", formControl?.getError('errorFiles'), productImages);

        let errorFile = formControl?.getError('errorFiles');

        // Filtering Out Error Free Data
        productImages = productImages.filter((file: any) => {
          return !errorFile.includes(file);
        });
        formControl?.patchValue(productImages);

        // Warning Message
        this.data_template.title = 'Maximum Image Size Exceeded (2MB)';
        errorFile.forEach((err: any) => {
          this.data_template.body.push(err.file.name);
        });
        this.toastservice.warningToast(this.data_template);
      }
    })
  }

  // Delete Image from Image List
  deleteImage(imageIndex: any, formId: any) {
    let productImages = this.productsForm.get('productDesc')?.get(String(formId))?.get('photo')?.value;
    productImages.splice(imageIndex, 1);
    this.productsForm.get('productDesc')?.get(String(formId))?.get('photo')?.patchValue(productImages);
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
    return this.productsForm.get('productDesc')?.get(String(index))?.get('photo')?.value;
  }

  async onsubmit() {

    console.log(this.productsForm.valid);

    if (!this.productsForm.valid) {
      this.productsForm.markAllAsTouched();
    } else {

      const imageFormArray = this.productsForm.get('productDesc')?.value;

      // Upload Images to fileStack and last upload the form data
      imageFormArray.forEach((imageArray: any, index: number) => {
        this.upload.fileupload(imageArray['photo']).then(async (res) => {
          
          this.productsForm.get('productDesc')?.get(String(index))?.get('photo')?.patchValue(res);

          if (index == (imageFormArray.length - 1)) {
            const data = {
              type: 'single',
              data: this.productsForm.value
            };
            this.dataService.httpPost(this.backendUrl.URLs.addproduct, data).then(()=>{
              this.router.navigate(['/dashboard/products'])
            }).catch((err)=>{
              console.log(err);
            })
          }

        });
      });
    }
  }
}