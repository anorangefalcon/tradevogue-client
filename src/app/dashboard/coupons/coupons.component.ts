import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent {
  OfferForm: FormGroup;
  title = 'Add Coupon/Discount';
  direction: string = 'right';
  ParenClosed: boolean = false;
  show: boolean = false;
  todayDate: any = Date.now();



  ChangeHanlder(event: any) {
    this.show = event;
  }

  OfferType = ['coupon', 'discount'];
  discountType = ['percentage', 'flat'];
  couponType = ['global', 'custom', 'new'];
  newEntry:Boolean=false;
  Brands: any;
  EditIndex: any;
  EditRequest: any;
  allOffers: any;
  Categories: any;
  // Filters = ['categories', 'brands'];
  CouponRequest: boolean = false;
  selectAll: boolean = false;
  deleteList: any = [];



  constructor(private fb: FormBuilder, private toastService:ToastService, private imageuploadService:ImageUploadService, private fetchDateService: FetchDataService, private BackendUrls: UtilsModule) {
    this.OfferForm = fb.group(
      {
        Image:fb.control('',[Validators.required]),
        OfferType: fb.control('', [Validators.required]),
        Title: fb.control('', [Validators.required]),
        Description: fb.control('', [Validators.required]),
        discountType: fb.control('', [Validators.required,]),
        discountAmount: fb.control('', [Validators.required]),
        startDate: fb.control('', [Validators.required]),
        endDate: fb.control('', [Validators.required,]),
        // maximumDiscount: fb.control('', [Validators.required]),
      },
      { validator: this.DateValidator }
    )
    const body = ['categories', 'brands']
    this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.fetchFeatures, body).subscribe((data: any) => {
      this.Brands = data.brands;
      this.Categories = data.categories;
    })


  }


  CurrentDate() {
    let dtToday = new Date();
    let month: any = dtToday.getMonth() + 1;
    let day: any = dtToday.getDate();
    let year: any = dtToday.getFullYear();
    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;
    return maxDate;

  }


  toggleSelectAll() {
    this.allOffers.forEach((product: any) => {
      product.checked = this.selectAll;
    });
  }

  isAllcheckboxChecked() {
    return this.allOffers.every((product: any) => product.checked);
  }

  updateCheckList() {
    this.deleteList = [];
    this.allOffers.forEach((offer: any) => {
      if (offer.checked) this.deleteList.push(offer._id);
    });
  }


  CouponCodeValidator(control: FormControl) {
    if (!control.value) return null;
    if (control.value.includes(' ')) {
      return { error: true }
    }
    return null;
  }

  ParenClosedHandler(event: any) {
    this.ParenClosed = event;
  }


  DateValidator(form: FormGroup) {
    let startDate = new Date((form.get('startDate')?.value)).getTime();
    let endDate = new Date((form.get('endDate')?.value)).getTime();
    endDate += 60 * 60 * 24 * 1000;
    if (startDate >= endDate) {
      form.get('endDate')?.setErrors({ 'format': "incorrect" });
    };
    return null;
  }




  OfferTypeHandler(event: any) {
    this.OfferForm.get('OfferType')?.patchValue(event);
    const controls: any = [
      { name: 'couponcode', validator: this.CouponCodeValidator },
      { name: 'couponType', },
      { name: 'couponUsersLimit' },
      { name: 'minimumPurchaseAmount' },
    ];
    if (event == 'coupon') {
      if (this.OfferForm.get('ExtraInfo')) {
        this.OfferForm.removeControl('ExtraInfo');
        this.OfferForm.removeControl('DiscountPercentageHandler');        
      }
      controls.forEach((el: any) => {
        if (el.validator) {
          this.OfferForm.addControl(el.name, this.fb.control('', [Validators.required, el.validator]));
        }
        else {
          this.OfferForm.addControl(el.name, this.fb.control('', [Validators.required]));
        }
      })



    }

    if (event == 'discount') {
      controls.forEach((el: any) => {
        this.OfferForm.removeControl(el.name);
      })
      let ExtraInfo = this.fb.group({
        categories: [],
        brands: []
      });
      this.OfferForm.addControl('ExtraInfo', ExtraInfo);
    }

  }



  CouponTypeHandler(event: any) {
    this?.OfferForm?.get('couponType')?.patchValue(event);
    if (event == 'custom') {
      this.OfferForm.addControl('UserEmails', this.fb.array([]));

      (<FormArray>this.OfferForm.get('UserEmails')).push(this.fb.group({
        email: ['', Validators.required]
      }));
      this.OfferForm.removeControl('couponUsersLimit');
    }
    else {
      this.OfferForm.addControl('couponUsersLimit', this.fb.control('', [Validators.required]))
      this.OfferForm.removeControl('UserEmails');
    }

  }
  // x(form: any, i: number) {
  //   return form?.controls(i);
  // }

  getEmailArray() {
    return (<FormArray>this.OfferForm.get('UserEmails'))?.controls
  }


  AddEmailFormControl() {
    this.OfferForm.addControl('UserEmails', this.fb.array([]));
    (<FormArray>this.OfferForm.get('UserEmails')).push(this.fb.group({
      email: ['', Validators.required]
    }));
  }


  RemoveEmailFormControl(i: any) {
    (<FormArray>this.OfferForm.get('UserEmails')).removeAt(i);
  }

  getEmailFormControl(index: number) {
    return (<FormArray>this.OfferForm.get('UserEmails')?.get(String(index)));
  }



  getAllOffers(){
    this.fetchDateService.HTTPGET(this.BackendUrls.URLs.getOffers).subscribe((data) => {
      this.allOffers = data;
    });
  }


  getOfferImage(){
     return this.OfferForm.get('Image')?.value;
  }

  async ngOnInit() {
    this.getAllOffers();
  }
  currentPage: number = 1
  pageChange(e: any) {
    this.currentPage = e;
    // this.fetchData();
  }


  AddCoupon() {
    this.newEntry=true;
    this.OfferForm.reset();
    this.show = true;
    this.EditRequest = false;
  }

  // CancelCoupon() {
  //   this.CouponRequest = false;
  // }



  CategoriesHandler(event: any) {
    this.OfferForm.get('ExtraInfo')?.get('categories')?.patchValue(event);
  }


  BrandsHandler(event: any) {
    this.OfferForm.get('ExtraInfo')?.get('brands')?.patchValue(event);
  }


  PercentageValidator(control: AbstractControl) {
    if (control.value >= 0 && control.value <= 100) {
      return null;
    }
    return { error: true }
  }


  DiscountTypeHandler(event: any) {
    this.OfferForm.get('discountType')?.patchValue(event);
    if (this?.OfferForm?.get('discountType')?.value == 'percentage') {
      this.OfferForm.get('discountAmount')?.setValidators([this.PercentageValidator])
      this.OfferForm.addControl('maximumDiscount',this.fb.control('',[Validators.required]));
    }

    else {
      this.OfferForm.get('discountAmount')?.removeValidators(this.PercentageValidator)
      this.OfferForm.removeControl('maximumDiscount');
    }

  }


  async CouponSubmit() {
    console.log('this offer form is ',this.OfferForm);
    if(!this.OfferForm.get('Image')?.value){
      this.toastService.errorToast('Image is still uploading please try again');
      return;
    }
    this.OfferForm.get('startDate')?.setValue(new Date(this.OfferForm.get('startDate')?.value));

    let endDate: any = new Date((this.OfferForm.get('endDate')?.value));
    endDate.setDate(endDate.getDate() + 1);
endDate.setMinutes(endDate.getMinutes() - 1);
    this.OfferForm.get('endDate')?.setValue(endDate);


    let url;
    let body: any = this.OfferForm.value;
    if (this.EditRequest) {
      url = this.BackendUrls.URLs.updateOffer;
      body.id = this.EditRequest;
    }
    else {
      url = this.BackendUrls.URLs.createOffer;
    }
    this.fetchDateService.HTTPPOST(url, body).subscribe((data) => {
      if (this.EditRequest) {
        this.allOffers[this.EditIndex] = data;
        this.EditRequest = false;
      }
      else {
        this.allOffers.unshift(data);
      }
      this.ParenClosed=true;  
      this.OfferForm.reset();
    });
    return;

  }


  async DeleteOffer(element: any, index: any) {

    const body = { id: element._id };
    this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.deleteOffer, body).subscribe((data) => {
      this.allOffers=data;
    });

  }


  CustomTypeHandler(value:any){
    this.OfferForm.addControl('UserEmails', this.fb.array([]));
  value.forEach((el:any)=>{
    (<FormArray>this.OfferForm.get('UserEmails')).push(this.fb.group({
      email: ['', Validators.required]
    }));
  })
   
  }

  async EditOffer(data: any, index: any) {

    this.EditIndex = index;
    this.EditRequest = data._id;
    data.startDate = data.startDate.split('T')[0];
    data.endDate = data.endDate.split('T')[0];
    this.OfferTypeHandler(data.OfferType);
    this.DiscountTypeHandler(data.discountType);
  if(data.UserEmails) { 
   this.CustomTypeHandler( data.UserEmails);
  }

    this.OfferForm.patchValue(data);
    this.show = true;
    this.CouponRequest = true
  }


  Delete_Offer() {
    const body = this.deleteList;
    this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.deleteOffer, body).subscribe((response) => {
      this.selectAll = false;
      this.allOffers=response;
      this.deleteList = [];
    });

  }


  checkboxChanged(index: any) {
    if (this.isAllcheckboxChecked()) this.selectAll = true;
    else this.selectAll = false;

  }


  ActiveStatus(event:any,data:any){
    const body={data,status:event.target.checked};
      this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.updateOfferStatus,body).subscribe((data)=>{
        
      })

  }

  updateFields(event:any){
      if(!event){
        this.getAllOffers();
        return;
      }
      const body={searchWord:event};
      this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.searchOffer,body).subscribe((data)=>{
        this.allOffers=data;
      })
  }


  bannerImageUpload(event:any){
    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.imageuploadService.fileupload([{ file: file }]).then((url: any) => {
      console.log('url come up is ',url[0]);
      
      this.OfferForm.get('Image')?.setValue(url[0]);

    })
  }


  ShowUpload(){
    this.OfferForm.get('Image')?.setValue('');
  }

}
