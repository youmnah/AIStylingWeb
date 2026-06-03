import { Component } from '@angular/core';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  activeTab:string = 'explore';
    
  constructor(public globalDataService:GlobalDataService) {} 
  
  ngOnInit(): void {}

  selectTab(tab: string) {
    this.activeTab = tab;  
  }
}