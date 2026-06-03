import { ClosetService } from './../closet.service';
import { GlobalDataService } from '../../global-data.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.component.html',
  styleUrl: '.././closet.component.scss'
})
export class FavoritesComponent {
  @Input() isFavorite:boolean = false;
  @Output() isFavoriteChange = new EventEmitter<boolean>();

  FavoriteList:any[] = [];
  isAllowed:boolean = false;

  constructor(private closetService:ClosetService, public globalDataService:GlobalDataService) { }

  ngOnInit(): void {    
    this.Favorites();
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

  ItemPreferred(ItemID, Preferred){    
    this.globalDataService.setIsLoading(true);
    this.closetService.PreferredItem(ItemID, !Preferred).subscribe(data => {    
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        else{
          this.FavoriteList = [];
          this.Favorites();      
        }       
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.Favorites();
        this.globalDataService.setIsLoading(false);
      }
    });     
  }

  BacktoClosets(){
    this.isFavorite = false;
    this.FavoriteList = [];
    this.isFavoriteChange.emit(false);
    this.globalDataService.setIsLoading(false);
  }
}