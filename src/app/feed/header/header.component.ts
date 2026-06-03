import { HeaderService } from './header.service';
import { GlobalDataService } from '../../global-data.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  data:any = {};  
  isAllowed:boolean = false;
  @Output() changeTab = new EventEmitter<string>();

  constructor(public globalDataService:GlobalDataService, public headerService:HeaderService) {} 

  ngOnInit(): void {
    this.globalDataService.setIsLoading(true);
    this.GetProfilePic();
    this.globalDataService.setIsLoading(false);
  } 
  
  reloadPage() {
    window.location.reload();
  } 
  
  GetProfilePic() {
    this.data.ProfileName = "User";
    this.data.ProfileImage = "./assets/drawables/ProfileIcon.png";
   
    this.globalDataService.setIsLoading(true);  
    this.headerService.GetProfilePic().subscribe(data => {
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);   
        if(response.error_message === "inactive user")
          this.isAllowed =  false;       
        this.globalDataService.setIsLoading(false);
      }
      else {    
        this.isAllowed =  true;      
        if(response.Nickname != null && response.Nickname != undefined && response.Nickname != "")
          this.data.ProfileName = response.Nickname;        
        if(response.ProfilePicture != null && response.ProfilePicture != undefined && response.ProfilePicture != "")       
          this.data.ProfileImage = response.ProfilePicture;         
        this.globalDataService.setIsLoading(false);    
      }
    }); 
  }

  gotoProfile(){
    this.globalDataService.setIsLoading(true);
    this.changeTab.emit('profile');
    this.globalDataService.setIsLoading(false);
  }
}