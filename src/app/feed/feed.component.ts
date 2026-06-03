import { FeedService } from './feed.service';
import { GlobalDataService } from '../global-data.service';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-feed',
  standalone: false,
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
 
  outfits: any [] = [];
  closets: any [] = [];
  isAllowed:boolean = false;
  @Output() changeTab = new EventEmitter<string>();

  constructor(public globalDataService:GlobalDataService, public feedService:FeedService) {} 
  
  ngOnInit(): void {
    this.globalDataService.setIsLoading(true);
    this.GetRecentOutfit();
    this.getClosets();
    this.globalDataService.setIsLoading(false);
  }

  GetRecentOutfit() {
    this.globalDataService.setIsLoading(true);  
    this.feedService.GetRecentOutfit().subscribe(data => {
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);   
        if(response.error_message === "inactive user")
          this.isAllowed =  false;       
        this.globalDataService.setIsLoading(false);
      }
      else {    
        this.isAllowed =  true;      
        this.outfits = response;        
        this.globalDataService.setIsLoading(false);    
      }
    }); 
  }

  getClosets() {
    this.globalDataService.setIsLoading(true);  
    this.feedService.getClosets().subscribe(data => {
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);   
        if(response.error_message === "inactive user")
          this.isAllowed =  false;       
        this.globalDataService.setIsLoading(false);
      }
      else {    
        this.isAllowed =  true;           
        this.closets = response;    
        this.globalDataService.setIsLoading(false);    
      }
    }); 
  }  

  showMoreOutfits() {
    this.globalDataService.setIsLoading(true);
    this.changeTab.emit('outfit');
    this.globalDataService.setIsLoading(false);
  }

  showMoreClosets() {
    this.globalDataService.setIsLoading(true);
    this.changeTab.emit('closet');
    this.globalDataService.setIsLoading(false);
  }

  gotoProfile(data){
    this.globalDataService.setIsLoading(true);
    this.changeTab.emit(data);
    this.globalDataService.setIsLoading(false);
  }
}