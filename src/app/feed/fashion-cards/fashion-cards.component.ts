import { Component, OnInit } from '@angular/core';
import { FashionCardsService } from './fashion-cards.service';
import { GlobalDataService } from '../../global-data.service';

@Component({
  selector: 'app-fashion-cards',
  templateUrl: './fashion-cards.component.html',
  styleUrls: ['./fashion-cards.component.scss'],
  standalone: false
})
export class FashionCardsComponent implements OnInit {
  articles: any[] = [];
  isAllowed:boolean = false;
  constructor(private fashionCardsService: FashionCardsService, public globalDataService:GlobalDataService) { }

  ngOnInit(): void {
    this.globalDataService.setIsLoading(true);
    this.fashionCardsService.getFashionStylingArticles().subscribe(data => {
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;      
        this.globalDataService.setIsLoading(false);
      }
      else { 
        this.isAllowed =  true;          
        this.articles = (data as any[]);
        this.globalDataService.setIsLoading(false);
      }
    }); 
  }

  isValidImage(url: string): boolean {
    if (!url) return false;
    const img = new Image();
    img.src = url;
    return img.complete && img.naturalHeight !== 0;
  }
}