import { ProfileService } from './profile.service';
import { GlobalDataService } from '../global-data.service';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {
    
  data:any;
  isAllowed:boolean = false;
  imageUrl: string | null = null;
  file:any;
  @Output() changeTab = new EventEmitter<string>();

  constructor(private profileService:ProfileService, public globalDataService:GlobalDataService) { }

  ngOnInit(): void {    
    this.getProfile();
  }

  getProfile() {
    this.globalDataService.setIsLoading(true);
    this.profileService.getProfile().subscribe(data => {   
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.isAllowed =  true;    
        this.data = data;
        this.imageUrl = this.data.ProfileData.ProfilePicture || null;     
        this.globalDataService.setIsLoading(false);
      }
    }); 
  }

  Save(){
    this.globalDataService.setIsLoading(true);
    this.profileService.SaveProfile(this.data.ProfileData).subscribe(data => {  
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.isAllowed =  true;             
        this.changeTab.emit('explore');
        this.globalDataService.setIsLoading(false);
      }
    }); 
  }

  getValueById(CatId, Id){
    return this.data.ProfileParameters[CatId].ProfileParamValue.find(item => item.id === Id)?.value;
  }

  onImageUpload(event: any) {
    if(this.imageUrl !=null)
    {  
        this.imageUrl = null;
        this.file = null;      
    }
    this.globalDataService.setIsLoading(true);
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = () => this.imageUrl = reader.result as string;
      reader.readAsDataURL(file);

      this.profileService.SaveProfileImage(this.file).subscribe(data => {   
        var response = JSON.parse(JSON.stringify(data));
        if(response.error){
          this.globalDataService.handleMessages(response.error.message, "danger", 2000);          
          this.globalDataService.setIsLoading(false);
        }
        else {                     
          var tempResponse = JSON.parse(JSON.stringify((data)));
          this.imageUrl = tempResponse.fileUrl;
          this.data.ProfileData.ProfilePicture = tempResponse.fileUrl;
          this.globalDataService.setIsLoading(false);
        }        
      });
    }
    this.globalDataService.setIsLoading(false);
  }

  onTabChange(tabName: string) {
    this.globalDataService.setIsLoading(true);
    this.changeTab.emit(tabName);
    this.globalDataService.setIsLoading(false);
  }
}