import { Component } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
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
  allSubscriptions: Subscription[] = [];
  show: boolean = false;
  totalCount:number = 0;
  currentPage: number = 1;

  TemplatePagination:any= {
    search: '',
    currentPage: this.currentPage,
    limit: 10
  }


  clearFormArray = (formArray: any) => {
    while (formArray?.length !== 0) {
      formArray?.removeAt(0)
    }
  }

  clearForm(){
    if(this.OfferForm?.get('UserEmails')?.value){
      this.clearFormArray(this.OfferForm?.get('UserEmails'));
    }
    this.OfferForm.reset();
  }

  ChangeHanlder(event: boolean) {
    this.show = event;
    this.clearForm();
  }

  OfferType = ['coupon', 'discount'];
  discountType = ['percentage', 'flat'];
  couponType = ['global', 'custom', 'new'];
  newEntry: Boolean = false;
  Brands: any;
  EditIndex: any;
  EditRequest: any;
  allOffers: any=[];
  Categories: any;
  // CouponRequest: boolean = false;
  selectAll: boolean = false;
  deleteList: any = [];



  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private imageuploadService: ImageUploadService,
    private fetchDateService: FetchDataService,
    private dialogService: DialogBoxService,
    private BackendUrls: UtilsModule) {

    this.OfferForm = fb.group(
      {
        Image: fb.control('', [Validators.required]),
        OfferType: fb.control('', [Validators.required]),
        Title: fb.control('', [Validators.required]),
        Description: fb.control('', [Validators.required]),
        discountType: fb.control('', [Validators.required,]),
        discountAmount: fb.control('', [Validators.required]),
        startDate: fb.control('', [Validators.required]),
        endDate: fb.control('', [Validators.required,this.DateValidator]),
      },
      { validator: this.DateValidator }
    )
    const body = ['categories', 'brands']
    this.allSubscriptions.push(
    this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.fetchFeatures, body).subscribe((data: any) => {
      this.Brands = data.brands;      
      this.Categories = data.categories;
    }));

    this.allSubscriptions.push(
    this.dialogService.responseEmitter.subscribe({
      next: (res: any) => {
        if (res) {
          this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.deleteOffer, { id: this.deleteId }).subscribe((data) => {
            this.allOffers = data;
          });
        }

      }
    }))
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



  DateValidator(form: FormGroup) {
    let startDate = new Date((form.get('startDate')?.value)).getTime();
    let endDate = new Date((form.get('endDate')?.value)).getTime();
    endDate += 60 * 60 * 24 * 1000;
    if (startDate >= endDate) {
      form.get('endDate')?.setErrors({ 'format': "incorrect" });
    };
    return null;
  }


  OfferTypeHandler(event: any,couponType:any=null) {
    let controls:any = [
      { name: 'couponcode', validator: this.CouponCodeValidator },
      { name: 'couponType', },
      { name: 'minimumPurchaseAmount' },
    ];
  
    
    this.OfferForm.get('OfferType')?.setValue(event);

    if (event == 'coupon') { 
      if(couponType!='custom'){
        controls.push( 
          { name: 'couponUsersLimit' });
      }
        this.OfferForm?.removeControl('ExtraInfo');
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

      this.OfferForm?.removeControl('UserEmails');
      this.OfferForm?.removeControl('couponUsersLimit');
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
      this.AddEmailFormControl()
      this.OfferForm.removeControl('couponUsersLimit');
    }
    else {
      this.OfferForm.addControl('couponUsersLimit', this.fb.control('', [Validators.required]))
      this.OfferForm.removeControl('UserEmails');
    }

  }

  getEmailArray() {
    return (<FormArray>this.OfferForm.get('UserEmails'))?.controls
  }


  AddEmailFormControl(data:any=false) {
    if(!data){
    (<FormArray>this.OfferForm.get('UserEmails')).push(this.fb.group({
      email: ['', [Validators.required,Validators.email]]
    }));
  }

    if (data) {
      this.OfferForm.addControl('UserEmails', this.fb.array([]));
      data.forEach((el: any) => {
        (<FormArray>this.OfferForm.get('UserEmails')).push(this.fb.group({
          email: this.fb.control(['', Validators.required,Validators.email])
        }));
      })
    }

  }


  RemoveEmailFormControl(i: number) {
    (<FormArray>this.OfferForm.get('UserEmails')).removeAt(i);
  }

  getEmailFormControl(index: number) {
    return (<FormArray>this.OfferForm.get('UserEmails')?.get(String(index)));
  }

  notData: boolean = false;
  getAllOffers() {
    this.allSubscriptions.push(
    this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.getOffers,this.TemplatePagination).subscribe((data:any) => {
      if(!data.length){
        this.notData = true;
        this.totalCount = 0;
        this.allOffers = []
        return;
      }
      this.allOffers = data[0]?.document;
      this.totalCount=data[0]?.count;
      
    }));
  }

  getOfferImage() {
    return this.OfferForm.get('Image')?.value;
  }

  async ngOnInit() {
    this.pageChange(this.currentPage);
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription)=> item.unsubscribe());
  }

  pageChange(pageNo: any,searchWord:String='') {
    this.currentPage=pageNo;
    this.TemplatePagination.search = searchWord;
    this.getAllOffers();
  }


  AddCoupon() {
    this.newEntry = true;
    this.clearForm();
    this.show = true;
    // this.EditRequest = false;
    // this.pageChange(this.currentPage);
  }


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
      this.OfferForm.addControl('maximumDiscount', this.fb.control('', [Validators.required]));
    }

    else {
      this.OfferForm.get('discountAmount')?.removeValidators(this.PercentageValidator)
      this.OfferForm.removeControl('maximumDiscount');
    }

  }

  dataUpdate: boolean = false;
  async CouponSubmit() {
    this.dataUpdate = true;
    if (!this.OfferForm.get('Image')?.value) {
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

    this.allSubscriptions.push(
    this.fetchDateService.HTTPPOST(url, body).subscribe((data) => {
      if (this.EditRequest) {
        this.allOffers[this.EditIndex] = data;
        this.EditRequest = false;
      }
      else {
        this.allOffers?.unshift(data);
      }
    
    }));

    this.show = false;
    this.clearForm();
    // this.OfferForm.reset();
    this.dataUpdate = false;
    this.pageChange(this.currentPage);
    return;

  }


  deleteId: any;
  async DeleteOffer(element: any) {
    this.deleteId = element._id;

    let template = {
      title: 'Proceed with Deletion?',
      subtitle: 'The Offer will be permanently deleted, and recovery will not be possible. Are you sure you want to proceed?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };

    this.dialogService.confirmationDialogBox(template);
  }


  async EditOffer(data: any, index: any) {
    this.EditIndex = index;
    this.EditRequest = data._id;
    data.startDate = data.startDate.split('T')[0];
    data.endDate = data.endDate.split('T')[0];
    this.OfferTypeHandler(data.OfferType,data.couponType);
    this.DiscountTypeHandler(data.discountType);
    if(data?.UserEmails?.length>0){
      this.AddEmailFormControl(data.UserEmails);
    }
    this.OfferForm.patchValue(data);
    this.show = true;
    // this.CouponRequest = true
  }


  Delete_Offer() {
    const body = this.deleteList;
    this.allSubscriptions.push(
    this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.deleteOffer, body).subscribe((response) => {
      this.selectAll = false;
      this.allOffers = response;
      this.deleteList = [];
    }));

  }


  checkboxChanged(index: number) {
    if (this.isAllcheckboxChecked()) this.selectAll = true;
    else this.selectAll = false;

  }


  ActiveStatus(event: any, data:any,index:any,) {
    const body = { data, status: event.target.checked };

    this.allSubscriptions.push(
    this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.updateOfferStatus, body).subscribe({next:(data) => {
    },error:(error)=>{
      if(error){

        this.allOffers[index].status.active=false;
        // this.data[index].   
      }
      
    }}));

  }

  updateFields(event: any) {
    if (!event) {
    this.pageChange(1);
      return;
    }

    this.pageChange(1,event);
  }

  uploading: boolean = false;

  bannerImageUpload(event: any) {
    this.uploading = true;
    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.imageuploadService.fileupload([{ file: file }]).then((url: any) => {
      this.OfferForm.get('Image')?.setValue(url[0]);

      this.uploading = false;
    })
  }


  ShowUpload() {
    this.OfferForm.get('Image')?.setValue('');
  }


  tableGenerator(len: number){
    let temp = []
    for(let i=0;i<len;i++){
      temp.push(0);
    }
    return temp;
  }

}