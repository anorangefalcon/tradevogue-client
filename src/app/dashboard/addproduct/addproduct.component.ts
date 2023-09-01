import { Component, ElementRef, HostListener, Renderer2, asNativeElements } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { imagesCount, imagesValidation, invalidformat } from 'src/app/shared/validators/imageValidators.validator';

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
  productImages: any = [];

  constructor(private elem_ref: ElementRef, private render: Renderer2, private fb: FormBuilder) {
    this.productsForm = this.fb.group({
      productImages: [this.productImages, {
        validators: [
          Validators.required,
          imagesValidation,
          imagesCount
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
      salesprice: [],
      discount: [0],
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

  // ngOnInit() : void {
  //   Array.from(document.querySelectorAll(".option")).forEach((ele) => {
  //     ele.addEventListener("click", () => this.updateSelected("category", $event))
  //   })
  // }
  // Single Select Function for Click, Blur, Update
  element!: HTMLInputElement;

  toggleClass(e: Event) {
    this.element = <HTMLInputElement>e.target;
    // console.log(this.element);
    let ele = <HTMLInputElement>this.element.parentElement?.nextSibling;
    // console.log(ele);
    $(ele).toggleClass('active');
  }

  blurClass(e: Event) {
    console.log(e);
    this.element = <HTMLInputElement>e.target;
    console.log((<HTMLInputElement>this.element.parentElement?.parentElement)?.contains(this.element));
    if( !(<HTMLInputElement>this.element.parentElement?.parentElement)?.contains(this.element)){
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
  
  // Handle Images
  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const images = fileInput?.files;
    for (let i = 0; i < images?.length!; i++) {
      this.productImages.push(images![i].name);
    }
    this.productsForm.get('productImages')?.setValue(this.productImages);
  }

  // Delete Image
  deleteImage(image: any) {
    this.productImages = this.productImages.filter((img: any) => {
      return img !== image;
    });
    this.productsForm.get('productImages')?.setValue(this.productImages);
  }


  updateMultiSelected(event: Event, type: string) {
    let inputList = this.productsForm.get('sizes')?.value;
    let checkbox = <HTMLInputElement>event.target;

    if (checkbox.checked) {
      inputList.push(checkbox.value);
      this.productsForm.get(type)?.setValue(inputList);
    } else {
      inputList.splice(inputList.indexOf(checkbox.value), 1);
      this.productsForm.get(type)?.setValue(inputList);
    }

  }

  onsubmit() {
    console.log(this.productsForm);
    console.log("formcontrol vla ", typeof (this.productsForm.get('sizes')?.value));


  }
}


