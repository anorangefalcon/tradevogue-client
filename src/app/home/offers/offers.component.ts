import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SalesService } from 'src/app/shared/services/custom-UI/sales.service';
import { Router, RouterModule } from '@angular/router';

interface SaleData {
  _id: string;
  backgroundImage: string;
  title: string;
  subTitle: string;
  colors: {
    titleColor: string;
    subTitleColor: string;
    buttonColor: string;
    cardColor: string;
  };
  enable: boolean;
  hover: boolean;
  buttonText: string;
  buttonLink: string;
}

@Component({
  standalone: true,
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./offers.component.css']
})
export class OffersComponent {
  saleData: SaleData[] = [];
  defaultState: SaleData[] = [];
  isHovered = false;
  timer: any;

  constructor(public salesService: SalesService, private router: Router) {}

  ngOnInit(): void {
    this.salesService.getSales().subscribe((data: any) => {
      this.saleData = data.map((item: any) => ({ ...item, hover: false }));
      this.defaultState = [...this.saleData];
    });
  }

  getLink(link: string): void {
    const parts = link.split('/').slice(3);
    const navigateUrl = parts.join('/');
    this.router.navigateByUrl(navigateUrl);
  }

  // Methods for handling hover actions
  onHover(): void {
    this.isHovered = true;
    this.pauseTimer();
  }

  onHoverOut(): void {
    this.isHovered = false;
    this.resumeTimer();
  }

  // Timer functions
  pauseTimer(): void {
    clearTimeout(this.timer);
  }

  resumeTimer(): void {
    this.timer = setTimeout(() => {
      this.saleData = [...this.defaultState];
    }, 5000);
  }

  selectItem(item: SaleData): void {
    const selectedIndex = this.saleData.findIndex(data => data._id === item._id);

    if (selectedIndex >= 1 && selectedIndex < this.saleData.length) {
      const previousIndex = selectedIndex - 1;

      for (let i = previousIndex; i >= 0; i--) {
        const temp = { ...this.saleData[i] };
        this.saleData[i] = { ...item };
        item = { ...temp };
      }
      this.isHovered ? this.pauseTimer() : this.resumeTimer();
    }
  }
}