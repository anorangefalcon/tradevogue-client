import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DialogBoxService } from '../shared/services/dialog-box.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
})
export class DialogBoxComponent implements AfterViewInit {

  @ViewChild('content') dialogBox!: ElementRef;

  value: string = '';
  type: string = '';
  open: boolean = false;
  currentRoute: any;

  constructor(private dialogService: DialogBoxService, private activeRoute: Router) { 
  }
  
  ngAfterViewInit() {
    this.currentRoute = window.location.href.split('4200')[1];
    
    this.dialogService.contentEmitter.subscribe((data: any) => {
      if (data) {
        this.type = data.type;
        this.value = data.value;
        this.dialogBox.nativeElement.classList.add('open');
        this.dialogService.responseEmitter.next(false);
      }
    });

    // Detect Changes in URL of Page 
    this.activeRoute.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.currentRoute && this.currentRoute != this.activeRoute.url) {
          this.cancel();
        }
      }
    });
  }

  ngOnChanges() {
    if (this.currentRoute && this.currentRoute != this.activeRoute.url) {
      this.closeDialog();
    }
  }

  ngOnDestroy() {
    this.dialogService.contentEmitter.unsubscribe();
    this.dialogService.responseEmitter.unsubscribe();
  }

  closeDialog() {
    this.dialogBox.nativeElement.classList.remove('open');
  }

  delete() {
    this.dialogService.responseEmitter.next(true);
    console.log(this.dialogService.responseEmitter);
    this.closeDialog();
  }

  cancel() {
    this.dialogService.responseEmitter.next(false);
    this.closeDialog();
    console.log(this.dialogService.responseEmitter);
  }
}
