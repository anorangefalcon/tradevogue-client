import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
})
export class OffersComponent {
  //  VARIABLES DECLARATION AND INTIALIZATION STARTS
  deleteList: any = [];
  OfferBodyDeleted: any;
  activeOffers: boolean = true;
  allOffers: any[] = [];
  allSubscriptions: Subscription[] = [];
  selectAll: boolean = false;
  currentPage: number = 1;
  EditIndex: number = -1;
  totalCount: number = 0;
  TemplatePagination: any = {
    search: '',
    currentPage: this.currentPage,
    limit: 10,
    active: this.activeOffers,
  };
  EditRequest: boolean = false;
  loading: boolean = false;
  direction: string = 'right';
  show: boolean = false;
  title = 'Add Coupon/Discount';
  Categories: any;
  Brands: any;
  OfferForm!: FormGroup;
  uploading: boolean = false;
  OfferType = ['coupon', 'discount'];
  discountType = ['percentage', 'flat'];
  couponType = ['global', 'custom', 'new'];
  deleteId: any = null;
  //  VARIABLES DECLARATION AND INTIALIZATION ENDS

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private imageuploadService: ImageUploadService,
    private fetchDateService: FetchDataService,
    private dialogService: DialogBoxService,
    private BackendUrls: UtilsModule
  ) {
    this.initializeForm();
    this.fetchCategoriesAndBrands();

    this.allSubscriptions.push(
      this.dialogService.responseEmitter.subscribe({
        next: (res: any) => {
          if (res) {
            this.fetchDateService
              .HTTPPOST(
                this.BackendUrls.URLs.deleteOffer,
                this.OfferBodyDeleted
              )
              .subscribe((response: any) => {
                if (!response.data.length) {
                  this.totalCount = 0;
                  this.allOffers = [];
                  return;
                }
                this.allOffers = response.data[0]?.document;
                this.totalCount = response.data[0]?.count;
              });
          }
        },
      })
    );
  }

  ngOnInit() {
    this.getAllOffers();
  }

  fetchData() {
    this.TemplatePagination.active = this.activeOffers;
    this.getAllOffers();
  }
  getAllOffers() {
    this.allSubscriptions.push(
      this.fetchDateService
        .HTTPPOST(this.BackendUrls.URLs.getOffers, this.TemplatePagination)
        .subscribe((data: any) => {
          if (!data.length) {
            // this.notData = true;
            this.totalCount = 0;
            this.allOffers = [];
            return;
          }
          this.allOffers = data[0]?.document;
          this.totalCount = data[0]?.count;
        })
    );
  }

  initializeForm() {
    this.OfferForm = this.fb.group(
      {
        Image: ['', [Validators.required]],
        OfferType: ['', [Validators.required]],
        Title: ['', [Validators.required]],
        Description: ['', [Validators.required]],
        discountType: ['', [Validators.required]],
        discountAmount: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        maximumDiscount: ['', [Validators.required]],
      },
      { validator: this.DateValidator }
    );
  }

  // FIND CATEGORIES AND BRANDS
  fetchCategoriesAndBrands() {
    const body = ['categories', 'brands'];
    this.allSubscriptions.push(
      this.fetchDateService
        .HTTPPOST(this.BackendUrls.URLs.fetchFeatures, body)
        .subscribe((data: any) => {
          this.Brands = data.brands;
          this.Categories = data.categories;
        })
    );
  }

  // BRANDS HANDLER
  BrandsHandler(event: any) {
    this.OfferForm.get('ExtraInfo')?.get('brands')?.patchValue(event);
  }

  //CATEGORY HANDLER
  CategoriesHandler(event: any) {
    this.OfferForm.get('ExtraInfo')?.get('categories')?.patchValue(event);
  }

  //  SEARCH OFFER INPUT HANDLER
  updateFields(event: String) {
    if (!event) {
      this.pageChange(1);
      return;
    }
    this.pageChange(1, event);
  }

  // ADD OFFER
  addOffer() {
    this.show = true;
  }

  // DELETE OFFER
  deleteAllOffers() {
    let template = {
      title: 'Proceed with Deletion?',
      subtitle:
        'The Offer will be permanently deleted, and recovery will not be possible. Are you sure you want to proceed?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };

    this.OfferBodyDeleted = {
      data: this.deleteList,
      parameters: this.TemplatePagination,
    };
    this.dialogService.confirmationDialogBox(template);
  }

  // OFFER TYPE HANDLER
  OfferTypeHandler(event: String, couponType: any = null) {
    let controls: any = [
      { name: 'couponCode', validator: this.CouponCodeValidator },
      { name: 'couponType' },
      { name: 'minimumPurchaseAmount' },
    ];

    this.OfferForm.get('OfferType')?.setValue(event);

    if (event == 'coupon') {
      if (couponType != 'custom') {
        this.OfferForm?.removeControl('ExtraInfo');
        controls.push({ name: 'couponUsersLimit' });
      }
      controls.forEach((el: any) => {
        if (el.validator) {
          this.OfferForm.addControl(
            el.name,
            this.fb.control('', [Validators.required, el.validator])
          );
        } else {
          this.OfferForm.addControl(
            el.name,
            this.fb.control('', [Validators.required])
          );
        }
      });
    }

    if (event == 'discount') {
      controls.forEach((el: any) => {
        this.OfferForm.removeControl(el.name);
      });

      this.OfferForm?.removeControl('UserEmails');
      this.OfferForm?.removeControl('couponUsersLimit');
      let ExtraInfo = this.fb.group({
        categories: [],
        brands: [],
      });

      this.OfferForm.addControl('ExtraInfo', ExtraInfo);
    }
  }

  // DISCOUNT TYPE HANDLER
  DiscountTypeHandler(event: String) {
    this.OfferForm.get('discountType')?.patchValue(event);
    if (event == 'percentage') {
      this.OfferForm.get('discountAmount')?.setValidators([
        this.PercentageValidator,
      ]);
      this.OfferForm.addControl(
        'maximumDiscount',
        this.fb.control('', [Validators.required])
      );
    } else {
      this.OfferForm.get('discountAmount')?.removeValidators(
        this.PercentageValidator
      );
      this.OfferForm.removeControl('maximumDiscount');
    }
  }

  // COUPON TYPE HANDLER
  CouponTypeHandler(event: String) {
    this?.OfferForm?.get('couponType')?.patchValue(event);
    if (event == 'custom') {
      this.OfferForm.addControl('UserEmails', this.fb.array([]));
      this.AddEmailFormControl();
      this.OfferForm.removeControl('couponUsersLimit');
    } else {
      this.OfferForm.addControl(
        'couponUsersLimit',
        this.fb.control('', [Validators.required])
      );
      this.OfferForm.removeControl('UserEmails');
    }
  }

  offerSubmit() {
    console.log('offer form is ', this.OfferForm);

    this.loading = true;
    if (!this.getOfferImage()) {
      this.toastService.errorToast({
        title:
          'Please upload image or if already uploaded than wait until its finish uploading',
      });
      this.loading = false;
      return;
    }

    this.OfferForm.get('startDate')?.setValue(
      new Date(this.OfferForm.get('startDate')?.value)
    );

    let endDate: any = new Date(this.OfferForm.get('endDate')?.value);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setMinutes(endDate.getMinutes() - 1);
    this.OfferForm.get('endDate')?.setValue(endDate);
    let url;
    let body: any = this.OfferForm.value;
    if (this.EditRequest) {
      url = this.BackendUrls.URLs.updateOffer;
      body.id = this.EditRequest;
    } else {
      url = this.BackendUrls.URLs.createOffer;
    }
    this.allSubscriptions.push(
      this.fetchDateService.HTTPPOST(url, body).subscribe({
        next: (data) => {
          if (this.EditRequest) {
            this.allOffers[this.EditIndex] = data;
            this.EditRequest = false;
          } else {
            this.allOffers?.unshift(data);
          }
          this.show = false;
          this.loading = false;
          this.clearForm();
        },
        error: () => {
          this.show = false;
          this.loading = false;
          this.clearForm();
        },
      })
    );
  }

  // CLEAR FORM
  clearForm() {
    if (this.OfferForm?.get('UserEmails')?.value) {
      this.clearFormArray(this.OfferForm?.get('UserEmails'));
    }
    this.OfferForm.reset();
  }

  clearFormArray = (formArray: any) => {
    while (formArray?.length !== 0) {
      formArray?.removeAt(0);
    }
  };

  // FORM ARRAY PART USER EMAILS START
  getEmailArray() {
    return (<FormArray>this.OfferForm.get('UserEmails'))?.controls;
  }

  getEmailFormControl(index: number) {
    return <FormArray>this.OfferForm.get('UserEmails')?.get(String(index));
  }

  AddEmailFormControl(data: any = false) {
    if (!data) {
      (<FormArray>this.OfferForm.get('UserEmails')).push(
        this.fb.group({
          email: ['', [Validators.required, Validators.email]],
        })
      );
    }

    if (data) {
      this.OfferForm.addControl('UserEmails', this.fb.array([]));
      data.forEach((el: any) => {
        (<FormArray>this.OfferForm.get('UserEmails')).push(
          this.fb.group({
            email: this.fb.control(['', Validators.required, Validators.email]),
          })
        );
      });
    }
  }

  RemoveEmailFormControl(i: number) {
    (<FormArray>this.OfferForm.get('UserEmails')).removeAt(i);
  }

  // FORM ARRAY PART USER EMAILS ENDS

  // VALIDATORS start
  DateValidator(form: FormGroup) {
    let startDate = new Date(form.get('startDate')?.value).getTime();
    let endDate = new Date(form.get('endDate')?.value).getTime();
    endDate += 60 * 60 * 24 * 1000;
    if (startDate >= endDate) {
      form.get('endDate')?.setErrors({ format: 'incorrect' });
    }
    return null;
  }

  // for offer start date to be today date
  CurrentDate() {
    let dtToday = new Date();
    let month: any = dtToday.getMonth() + 1;
    let day: any = dtToday.getDate();
    let year: any = dtToday.getFullYear();
    if (month < 10) month = '0' + month.toString();
    if (day < 10) day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;
    return maxDate;
  }

  CouponCodeValidator(control: FormControl) {
    if (!control.value) return null;
    if (control.value.includes(' ')) {
      return { error: true };
    }
    return null;
  }

  PercentageValidator(control: AbstractControl) {
    if (control.value >= 0 && control.value <= 100) {
      return null;
    }
    return { error: true };
  }
  // VALIDATORS end

  // MAKE OFFER ACTIVE
  ActiveStatus(event: any, data: any, index: any) {
    const body = {
      data,
      status: event.target.checked,
      parameters: this.TemplatePagination,
    };
    this.allSubscriptions.push(
      this.fetchDateService
        .HTTPPATCH(this.BackendUrls.URLs.updateOfferStatus, body)
        .subscribe({
          next: (response: any) => {
            if (!response.data.length) {
              this.allOffers = [];
              this.totalCount = 0;
              return;
            }

            this.allOffers = response.data[0]?.document;
            this.totalCount = response.data[0]?.count;
          },
          error: (error) => {
            if (error) {
              this.allOffers[index].status.active = false;
            }
          },
        })
    );
  }

  // EDIT OFFER
  EditOffer(data: any, index: any) {
    this.EditIndex = index;
    this.EditRequest = data._id;
    data.startDate = data.startDate.split('T')[0];
    data.endDate = data.endDate.split('T')[0];
    this.OfferTypeHandler(data.OfferType, data.couponType);
    this.DiscountTypeHandler(data.discountType);
    if (data?.UserEmails?.length > 0) {
      this.AddEmailFormControl(data.UserEmails);
    }
    this.OfferForm.patchValue(data);
    this.show = true;
  }

  // DELETE OFFER
  DeleteOffer(event: any) {
    this.deleteId = event._id;
    let template = {
      title: 'Proceed with Deletion?',
      subtitle:
        'The Offer will be permanently deleted, and recovery will not be possible. Are you sure you want to proceed?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };

    this.OfferBodyDeleted = {
      id: this.deleteId,
      parameters: this.TemplatePagination,
    };
    this.dialogService.confirmationDialogBox(template);
  }

  // DRAWER HANDLER
  ChangeHanlder(event: boolean) {
    this.show = event;
    this.clearForm();
  }

  pageChange(pageNo: any, searchWord: String = '') {
    this.currentPage = pageNo;
    this.TemplatePagination.search = searchWord;
    this.getAllOffers();
  }

  // IMAGE UPLOAD PART start
  ShowUpload() {
    this.OfferForm.get('Image')?.setValue('');
  }

  getOfferImage() {
    return this.OfferForm.get('Image')?.value;
  }

  bannerImageUpload(event: any) {
    this.uploading = true;
    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.imageuploadService.fileupload([{ file: file }]).then((url: any) => {
      this.OfferForm.get('Image')?.setValue(url[0]);
      this.uploading = false;
    });
  }

  // IMAGE UPLOAD PART end

  // ABHISHEK CODE
  toggleSelectAll() {
    this.allOffers.forEach((offer: any) => {
      offer.checked = this.selectAll;
    });
  }

  updateCheckList() {
    this.deleteList = [];
    this.allOffers.forEach((offer: any) => {
      if (offer.checked) this.deleteList.push(offer._id);
    });
  }

  checkboxChanged(index: number) {
    if (this.isAllcheckboxChecked()) this.selectAll = true;
    else this.selectAll = false;
  }

  isAllcheckboxChecked() {
    return this.allOffers.every((offer: any) => offer.checked);
  }

  tableGenerator(len: number) {
    let temp = [];
    for (let i = 0; i < len; i++) {
      temp.push(0);
    }
    return temp;
  }
}
