import { ChangeDetectorRef, Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.css'],
  encapsulation: ViewEncapsulation.Emulated

})

export class EditHomeComponent {

  @ViewChild('hero') hero!: TemplateRef<any>;
  @ViewChild('collection') collection!: TemplateRef<any>;
  @ViewChild('deal') deal!: TemplateRef<any>;
  @ViewChild('latestProducts') latestProducts!: TemplateRef<any>;
  @ViewChild('offers') offers!: TemplateRef<any>;
  @ViewChild('productCarousel') productCarousel!: TemplateRef<any>;

  elements: String[] = ['hero', 'collection', 'deal', 'latestProducts', 'offers', 'productCarousel']; // default direction
  States: any = {};
  edited: Boolean = false;
  Direction: any[] = [];
  popUpDirection:any='popup';
  showingPopUp: boolean = false;
  
  loadingData: Boolean = false;
  layouts: any = [];
  currentLayout: any = {};

  constructor(private fetchDataService: FetchDataService, private cdr: ChangeDetectorRef, private backendUrls: UtilsModule, private toastService: ToastService){}

  ngOnInit(){
   this.fetchLayouts();
  }

  fetchLayouts(created: boolean = false){
    this.loadingData = true;
    this.fetchDataService.HTTPGET(this.backendUrls.URLs.getAllHomeLayouts)
    .subscribe((data: any)=>{
      this.layouts = data;
      
      let findQuery = ()=>{
        if(created){
          return ( (item: any)=> item.name === this.currentLayout.name ) ;
        }
        return ( (item: any)=> item.active === true );
      }

      this.currentLayout = JSON.parse(JSON.stringify(this.layouts.find(findQuery())));
      this.loadingData = false;
    });
  }

  switchStatus(event: any, name: String){
    const index = this.getIndexFromName(name);
    const newStatus = (<HTMLInputElement>event.target).checked;
    
    this.currentLayout.layout[index].active = newStatus;
    this.edited = true;
  }

  moveUp(name: String){
    const index = this.getIndexFromName(name);

    if(index > 1){
      const tempCurrentVal = this.currentLayout.layout[index];
      this.currentLayout.layout[index] = this.currentLayout.layout[index - 1];
      this.currentLayout.layout[index - 1] = tempCurrentVal;
    }

    this.edited = true;
  }

  moveDown(name: String){
    const index = this.getIndexFromName(name);

    if(index >= 1){
      const tempCurrentVal = this.currentLayout.layout[index];
      this.currentLayout.layout[index] = this.currentLayout.layout[index + 1];
      this.currentLayout.layout[index + 1] = tempCurrentVal;
    }

    this.edited = true;
  }

  createNewLayout(){
    let newLayout = {
      name: 'layout ' + (this.layouts.length + 1),
      layout: <any>[]
    }

    this.elements.forEach((item)=>{
      newLayout.layout.push(
        { 'name': item }
      );
    })
    
    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.createOrUpdateHomeLayout, newLayout)
    .subscribe(()=>{
      this.currentLayout.name = newLayout.name;
      this.fetchLayouts(true);
      this.edited = false;
    });
  }

  updateLayout(){
    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.createOrUpdateHomeLayout, this.currentLayout)
    .subscribe(()=>{
      this.edited = false;
      this.fetchLayouts(true);
      this.toastService.successToast({
        title: 'Successfully updated ' + this.currentLayout.name
      });
    });
  }

  deleteLayout(){
    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.deleteHomeLayout, {id: this.currentLayout._id})
    .subscribe(()=>{
      this.edited = false;
      this.showingPopUp = false;
      this.toastService.successToast({
        title: 'Successfully deleted ' + this.currentLayout.name
      });
      this.fetchLayouts();
    });
  }

  activateLayout(){
    this.currentLayout.active = true;
    this.updateLayout();
    this.toastService.successToast({
      title: this.currentLayout.name + ' is Now Active'
    });
  }

  // helpers:
  getIndexFromName(name: String){
    return this.currentLayout.layout.findIndex((item: any) => item.name === name);
  }

  // sortElementsAccordingIndex(){
  //   this.currentLayout.layout.sort((a, b) => a.index - b.index);
  // }

  selectLayout(event: any){
    this.edited = false;
    this.currentLayout = this.layouts.find((item: any) => item.name === event);
  }

  getLayoutsNames(){
    return this.layouts.map((item: any) => item = item.name);
  }

  getTemplate(item: string): TemplateRef<any> {
    switch (item) {
      case 'hero':
        return this.hero;
      case 'collection':
        return this.collection;
      case 'deal':
        return this.deal;
      case 'latestProducts':
        return this.latestProducts;
      case 'offers':
        return this.offers;
      case 'productCarousel':
        return this.productCarousel;
      default:
        return null!;
    }
  }

  PopUpChangeHanlder(event: any){
    this.showingPopUp = event;
  }
}
