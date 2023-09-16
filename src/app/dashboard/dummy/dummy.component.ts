import { Component } from '@angular/core';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.css']
})
export class DummyComponent {
  handleEmiiterData(ev:any){
    console.log('eve is ',ev);
    
  }
}
