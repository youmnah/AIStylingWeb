import { StylingService } from './styling.service';
import { ClosetService } from '../closet/closet.service';
import { GlobalDataService } from '../global-data.service';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-styling',
  standalone: false,
  templateUrl: './styling.component.html',
  styleUrl: './styling.component.scss'
})
export class StylingComponent {

  constructor(private stylingService:StylingService, private closetService:ClosetService, public globalDataService:GlobalDataService) { }
  
  @Output() changeTab = new EventEmitter<string>();

  stylingdata: any;  
  selectedOccasions: string[] = [];
  selectedColor: string[] = [];  
  selectedDays: string[] = [];
  day: any = {};
  weather: any = {};
  closets: any = {};
  outfits: any [] = [];
  tabId:number = 0;
  season: any = {};
  selectedClosetId: number[] = [];
  whenId:number = 0;
  isAllowed:boolean = false;
  FavoriteList:any[] = [];

  ngOnInit(): void {    
    this.initiate();
  }

  initiate(){
    this.globalDataService.setIsLoading(true);
    this.tabId = 1;
    this.stylingService.GetStylingDetails().subscribe(data => { 
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);  
        if(response.error_message === "inactive user")
          this.isAllowed =  false;        
        this.globalDataService.setIsLoading(false);
      }
      else {  
        this.isAllowed =  true; 
        this.stylingdata = JSON.parse(JSON.stringify((data)));
        this.selectedColor.length = 0;
        this.selectedColor.push(this.stylingdata.ColorPreference[0].PaletteName);
        this.weather = JSON.parse(localStorage.getItem('weather'));
        this.ChooseCloset();      
        this.Favorites();
        this.globalDataService.setIsLoading(false);
      }
    });
  }

  ChooseCloset(){
    this.globalDataService.setIsLoading(true);
    this.stylingService.getClosets().subscribe(data => { 
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.isAllowed =  true; 
        this.closets = JSON.parse(JSON.stringify(data));        
        this.globalDataService.setIsLoading(false);
      }

      if (typeof this.closets === 'object' && this.closets !== null && Object.keys(this.closets).length === 0) {
        this.globalDataService.handleMessages("Start by creating your closet", "warning", 10000);
        this.GoToFavorites();
      }
    });   
  }

  toggleOccasion(occasion) {        
    this.selectedOccasions.length = 0
    this.selectedOccasions.push(occasion.occasionName);
  }

  toggleDay(day) {
    this.whenId = day.WhenID;    
    this.selectedDays.length = 0
    this.selectedDays.push(day.WhenName);    
    this.day = this.weather[day.WhenID - 1];    
  }

  togglePalette(palette) {        
    this.selectedColor.length = 0
    this.selectedColor.push(palette.PaletteName);
  }  

  Back(){
    this.tabId = 1;
  }

  selectCloset(id: number) {
    if(this.selectedClosetId.includes(id))
      this.selectedClosetId.splice(this.selectedClosetId.indexOf(id), 1);    
    else
      this.selectedClosetId.push(id);  
  }

  GetSuggestions() {
    if(this.selectedColor.length > 0 && this.selectedDays.length > 0 && this.selectedOccasions.length > 0 && this.selectedClosetId.length > 0){
      this.tabId = 3;      
      var seasonname = this.getSeasonFromTempAndMonth(this.day.temp, new Date(this.day.date).getMonth() + 1);
      this.season = this.stylingdata.Seasons.find(a => a.seasonName == seasonname);      
      
      var data = {
        "closetID": this.selectedClosetId,
        "occasionID" : this.stylingdata.Occasion.find(a => a.occasionName == this.selectedOccasions[0]).occasionID,
        "seasonID": this.season.seasonID,          
        "paletteID": this.stylingdata.ColorPreference.find(a => a.PaletteName == this.selectedColor[0]).PaletteID
      }    

      this.stylingService.GenerateOutfit(data).subscribe(data => {        
        var response = JSON.parse(JSON.stringify(data));
        if(response.error_message){
          this.globalDataService.handleMessages(response.error_message, "danger", 2000);          
          setTimeout(() => {
            this.Back();
          }, 2000);
        }
        else {
          var req =  response.AI;              
          this.stylingService.GetOutfitsSuggestions(req).subscribe(data => {          
            this.outfits = JSON.parse(JSON.stringify(data));          
            this.tabId = 4;    
          });   
        }     
      });
    }
    else
      this.globalDataService.handleMessages("Please select all the options", "danger", 2000);    
  }  

  getSeasonFromTempAndMonth(tempRange: string, month: number): string {  
    const matches = tempRange.match(/(-?\d+)\s*\/\s*(-?\d+)/);
    if (!matches || matches.length < 3) return null;

    const min = parseInt(matches[1], 10);
    const max = parseInt(matches[2], 10);
    const avgTemp = (min + max) / 2;
      
    const isWinter = [12, 1, 2].includes(month);
    const isSpring = [3, 4, 5].includes(month);
    const isSummer = [6, 7, 8].includes(month);
    const isFall   = [9, 10, 11].includes(month);
      
    if (avgTemp < 10) return 'Winter';
    if (avgTemp > 25) return 'Summer';
  
    if (avgTemp >= 10 && avgTemp <= 25) {
      if (isSpring) return 'Spring';
      if (isFall) return 'Fall';
    }
  
    if (isWinter) return 'Winter';
    if (isSpring) return 'Spring';
    if (isSummer) return 'Summer';
    if (isFall)   return 'Fall';
  
    return 'Unknown';
  }  

  SaveOutfit(outfit){
    this.globalDataService.setIsLoading(true);
    outfit.whenID = this.whenId;
    this.stylingService.SaveOutfit(outfit).subscribe(data => { 
      this.closets = JSON.parse(JSON.stringify(data));      
      this.changeTab.emit('outfit');
      this.globalDataService.setIsLoading(false);
    });
  }

  GotToOutfitTab() {    
    this.globalDataService.setIsLoading(true);
    this.changeTab.emit('outfit');
    this.globalDataService.setIsLoading(false);
  }

  Favorites(){
    this.globalDataService.setIsLoading(true);
    this.closetService.Favorite().subscribe(data => { 
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.FavoriteList = [];
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.isAllowed =  true; 
        this.FavoriteList = response;
        this.globalDataService.setIsLoading(false);
      }
    });
  }

  GoToFavorites () {
    this.globalDataService.setIsLoading(true);
    this.changeTab.emit('closet');
    this.globalDataService.setIsLoading(false);
  }
}