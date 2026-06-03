import { Component } from '@angular/core';
import { OutfitService } from './outfit.service';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'app-outfit',
  standalone: false,
  templateUrl: './outfit.component.html',
  styleUrl: './outfit.component.scss'
})
export class OutfitComponent {
    
  monthName:string;
  year:number;
  month:number;
  selectedMonth:string;  
  mostwornOutfits: any;
  recentOutfits: any;
  isAllowed:boolean = false;
  visibleOutfits: any[] = []; // Subset to display
  itemsToShow = 3;
  currentIndex = 0;
  constructor(private outfitService:OutfitService, public globalDataService:GlobalDataService) { }
  
  ngOnInit(): void {  
    const date = new Date();
    this.monthName = date.toLocaleString('default', { month: 'long' });
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.selectedMonth = this.year + "-" + (this.month + 1).toString().padStart(2, '0'); 
    this.isAllowed = true;           
    this.GetRecentOutfit(new Date(this.year, this.month, 1));
    this.MostWorn(new Date(this.year, this.month, 1));
  } 
  
  onMonthChange(newValue: string) {   
    this.recentOutfits = [];
    this.mostwornOutfits = [];     
    this.GetRecentOutfit(new Date(newValue));
    this.MostWorn(new Date(newValue));
  }

  GetRecentOutfit(date){     
    this.monthName = date.toLocaleString('default', { month: 'long' });
    this.year = date.getFullYear();
    this.month = date.getMonth();    
    this.globalDataService.setIsLoading(true);
    var data = { "YearID": this.year, "MonthID": this.month + 1 };
    this.outfitService.GetMonthlyOutfits(data).subscribe(data => { 
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;          
        this.globalDataService.setIsLoading(false);
      }
      else {   
        this.isAllowed =  true;
        this.recentOutfits = data; 
        this.LoadMore();
        this.globalDataService.setIsLoading(false);
      }
    });
  }

  MostWorn(date){     
    this.monthName = date.toLocaleString('default', { month: 'long' });
    this.year = date.getFullYear();
    this.month = date.getMonth();   
    this.globalDataService.setIsLoading(true);    
    var data = { "YearID": this.year, "MonthID": this.month + 1 };
    this.outfitService.MostWorn(data).subscribe(data => { 
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;          
        this.globalDataService.setIsLoading(false);
      }
      else {   
        this.isAllowed =  true;
        this.mostwornOutfits = data;        
        this.globalDataService.setIsLoading(false);
      }
    });
  }
  
  LoadMore() {
    const nextItems = this.recentOutfits.slice(this.currentIndex, this.currentIndex + this.itemsToShow);
    this.visibleOutfits = this.visibleOutfits.concat(nextItems);
    this.currentIndex += this.itemsToShow;
  }

  hasMoreItems(): boolean {
    return this.currentIndex < this.recentOutfits.length;
  }
}