import { ClosetService } from './../closet.service';
import { GlobalDataService } from '../../global-data.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-archive',
  standalone: false,
  templateUrl: './archive.component.html',
  styleUrl: '.././closet.component.scss'
})
export class ArchiveComponent {
  @Input() isArchive:boolean = false;
  @Output() isArchiveChange = new EventEmitter<boolean>();

  ArchiveList:any[] = [];
  isAllowed:boolean = false;

  constructor(private closetService:ClosetService, public globalDataService:GlobalDataService) { }

  ngOnInit(): void {    
    this.Archive();
  }

  Archive(){
    this.globalDataService.setIsLoading(true);
    this.closetService.Archive().subscribe(data => { 
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.ArchiveList = [];
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.isAllowed =  true; 
        this.ArchiveList = response;      
        this.globalDataService.setIsLoading(false);
      }
    });
  }

  ItemArchive(ItemID, Archive){
    this.globalDataService.setIsLoading(true);
    this.closetService.ArchiveItem(ItemID, !Archive).subscribe(data => {    
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        else {
          this.ArchiveList = [];
          this.Archive(); 
        }
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.Archive();
        this.globalDataService.setIsLoading(false);
      }
    }); 
  }

  BacktoClosets(){
    this.isArchive = false;
    this.ArchiveList = [];
    this.isArchiveChange.emit(false);
    this.globalDataService.setIsLoading(false);
  }
}