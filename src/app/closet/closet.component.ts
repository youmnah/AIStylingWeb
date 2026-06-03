import { ClosetService } from './closet.service';
import { GlobalDataService } from '../global-data.service';
import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-closet',
  standalone: false,
  templateUrl: './closet.component.html',
  styleUrl: './closet.component.scss'
})
export class ClosetComponent {
  @Output() changeTab = new EventEmitter<string>();

  enableDrag:boolean[] = [];
  showPopup:boolean[] = [];
  isNew:boolean = true;
  data:any;
  closet:any;
  closetdata:any;
  Showitems:boolean = false;
  Showitem:boolean = false;
  Categories:any[] = [];
  selectedSeasons: string[] = [];
  selectedOccasions: string[] = [];
  selectedColor: string;  
  selectedCategory: string;
  selectedMaterial: string;
  selectedPattern: string;
  imageUrl: string | null = null;
  originalName: string = '';
  file:any;
  styling:boolean = false;
  favorite:boolean = false;
  archive:boolean = false;
  isAllowed:boolean = false;
  ArchiveList:any[] = [];
  isArchive:boolean = false;
  FavoriteList:any[] = [];
  isFavorite:boolean = false;
  item:any = {    
    "ItemID": 0,
    "ImagePath": "",
    "SeasonID": 0,
    "OccasionID": 0,
    "ColorID": 0,
    "CategoryID": 0,
    "MaterialID": 0,
    "PatternID": 0,    
    "Preferred": 0,
    "ClosetID": 0 ,
    "Archive": 0  
  }
  searchTerm: string = '';
  filteredClosets:any[] = [];

  constructor(private closetService:ClosetService, public globalDataService:GlobalDataService) { }
  
  ngOnInit(): void {    
    this.getClosets();
  }

  getClosets() {
    this.showPopup.length = 0;
    this.enableDrag.length = 0;
    this.globalDataService.setIsLoading(true);  
    this.closetService.getClosets().subscribe(data => {
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);   
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        else
          this.isAllowed =  true;     
        this.globalDataService.setIsLoading(false);
      }
      else {    
        this.isAllowed =  true;           
        this.data = data;
        this.filteredClosets = JSON.parse(JSON.stringify(this.data));
        this.data.sort((a, b) => a.ClosetOrder - b.ClosetOrder);  
        this.filteredClosets.sort((a, b) => a.ClosetOrder - b.ClosetOrder);  
        this.globalDataService.setIsLoading(false);    
      }
    }); 
  }  

  CreateCloset() {
    this.isNew = false;
    this.closet = {};
  }

  SaveCloset(){
    if (this.closet.ClosetName !== this.originalName) {
      this.globalDataService.setIsLoading(true);
      if(!this.closet.ClosetID)
        this.closet.ClosetID = 0;
      this.closetService.saveCloset(this.closet.ClosetName, this.closet.ClosetID).subscribe(data => { 
        var response = JSON.parse(JSON.stringify(data));
        if(response.error_message){
          this.globalDataService.handleMessages(response.error_message, "danger", 2000);
          if(response.error_message === "inactive user")
            this.isAllowed =  false;
          this.globalDataService.setIsLoading(false);
        }
        else {         
          this.isAllowed =  true; 
          var tempResponse = JSON.parse(JSON.stringify((data)));
          if(this.closet.ClosetID == 0) {
            this.closet.ClosetID = tempResponse.ClosetID;
            this.closetService.getCloset(this.closet.ClosetID).subscribe(data => {             
              this.closetdata = JSON.parse(JSON.stringify((data)));
              this.closet = this.closetdata.Closet;
              this.originalName = this.closet.ClosetName; 
              this.AddItem(); 
              this.globalDataService.setIsLoading(false);
            });
          }
          this.closet.ClosetID = tempResponse.ClosetID;
          this.globalDataService.setIsLoading(false);
        }
      });
    }

    if(this.closet.Items && this.closet.Items.length > 0){
      this.ItemsSorting();    
    }
    else {
      this.Showitem = true;
      this.Showitems = false;      
    }
  }

  ItemsSorting(){
    this.Showitems = true;
      this.Categories.length = 0;
      this.Categories.push({
        categoryID: -1,
        categoryName: "Recently Added",
        Items: this.closet.Items.sort((a, b) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime()).slice(0, 3)
      });
      const ids = new Set(this.closet.Items.map(item => item.CategoryID));
      const cats = this.closetdata.Categories.filter(cat => ids.has(cat.categoryID));      
      cats.forEach(element => {
        this.Categories.push({
          categoryID: element.categoryID,
          categoryName: element.categoryName,
          Items: this.closet.Items.filter(item => item.CategoryID == element.categoryID).slice(0, 5)
        }); 
      });
  }

  AllItems(){
    this.Showitems = true;
    this.Showitem = false;
    this.Categories.length = 0;
    this.Categories.push({
      categoryID: -1,
      categoryName: "All Items",
      Items: this.closet.Items
    });
  }

  AddItem(){
    this.Showitem = true;
    this.Showitems = false;
    this.item = {};
    this.imageUrl = null;
    this.selectedCategory = "";
    this.selectedMaterial = "";
    this.selectedPattern = "";
    this.selectedColor = "";
    this.selectedSeasons.length = 0;
    this.selectedOccasions.length = 0;
    this.favorite = false;
    this.archive = false;
  }

  ShowItemDetails(item){
    this.Showitem = true;
    this.Showitems = false;
    this.item.SeasonID = item.SeasonID;
    this.selectedSeasons.length = 0;
    this.selectedSeasons.push(this.closetdata.Seasons.find(a => a.seasonID == item.SeasonID).seasonName);
    this.item.OccasionID = item.OccasionID;
    this.selectedOccasions.length = 0;
    this.selectedOccasions.push(this.closetdata.Occasions.find(a => a.occasionID == item.OccasionID).occasionName);
    this.item.ColorID = item.ColorID;
    this.selectedColor = this.closetdata.Colors.find(a => a.ColorID == item.ColorID).ColorName;    
    this.item.CategoryID = item.CategoryID;        
    this.selectedCategory = this.closetdata.Categories.find(a => a.categoryID == item.CategoryID).categoryName;  
    this.item.MaterialID = item.MaterialID;
    this.selectedMaterial = this.closetdata.Materials.find(a => a.materialID == item.MaterialID).materialName;    
    this.item.PatternID = item.PatternID;
    this.selectedPattern = this.closetdata.Patterns.find(a => a.patternID == item.PatternID).patternName; 
    this.imageUrl = item.ImagePath;

    this.item.ItemID = item.ItemID;
    this.item.ImagePath = item.ImagePath;
    this.item.Preferred = item.Preferred;
    this.favorite = item.Preferred;
    this.archive = item.Archive;
    this.item.ClosetID = this.closet.ClosetID;
  }

  onColorChange(){
    const selected = this.closetdata.Colors.find(c => c.ColorName === this.selectedColor);
    if (selected) {
      this.item.ColorID = selected.ColorID;
    }
  }

  onCategoryChange(){   
    const selected = this.closetdata.Categories.find(c => c.categoryName.toLowerCase === this.selectedCategory.toLowerCase);
    if (selected) {
      this.item.CategoryID = selected.categoryID;
    }
  }

  onMaterialChange(){
    const selected = this.closetdata.Materials.find(c => c.materialName === this.selectedMaterial);
    if (selected) {
      this.item.MaterialID = selected.materialID;
    }
  }

  onPatternChange(){
    const selected = this.closetdata.Patterns.find(c => c.patternName === this.selectedPattern);
    if (selected) {
      this.item.PatternID = selected.patternID;
    }
  }

  ItemPreferred(ItemID, Preferred){    
    this.globalDataService.setIsLoading(true);
    this.closetService.PreferredItem(ItemID, !Preferred).subscribe(data => {    
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.EditCloset(this.closet.ClosetID, false);
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
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.EditCloset(this.closet.ClosetID, false);
        this.globalDataService.setIsLoading(false);
      }
    }); 
  }

  togglePreferred() {
    this.favorite = !this.favorite;
    this.item.Preferred = this.favorite;
  }
  
  toggleArchive() {
    this.archive = !this.archive;
    this.item.Archive = this.archive;
  }

  Sort(){
    this.ItemsSorting();
  }

  EditCloset(Id, flag:boolean){
    this.globalDataService.setIsLoading(true);
    this.closetService.getCloset(Id).subscribe(data => {    
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.isAllowed =  true;           
        this.closetdata = JSON.parse(JSON.stringify((data)));
        this.closet = this.closetdata.Closet;
        this.originalName = this.closet.ClosetName;

        this.isNew = false;      
        this.Showitems = flag;
        if(this.closet.Items && this.closet.Items.length > 0)
          this.AllItems();
        if(flag == true){
          this.ItemsSorting();
        }
        this.Showitem = false;
        this.globalDataService.setIsLoading(false);
      }
    }); 
  }

  Back(){
    this.isNew = false;    
    if(this.closet.Items && this.closet.Items.length > 0){  
      this.Showitems = true;      
    }
    this.Showitem = false;
  }

  BacktoClosets(){
    this.Showitems = false;
    this.Showitem = false;
    this.isNew = true;
    this.getClosets();
  }

  toggleSeason(season) {    
    this.item.SeasonID = season.seasonID;
    this.selectedSeasons.length = 0
    this.selectedSeasons.push(season.seasonName);    
  }
  
  toggleOccasion(occasion) {
    this.item.OccasionID = occasion.occasionID;
    this.selectedOccasions.length = 0
    this.selectedOccasions.push(occasion.occasionName);    
  }
  
  toggleSelection(list: string[], value: string) {
    const index = list.indexOf(value);
    if (index > -1) list.splice(index, 1);
    else list.push(value);
  }

  onImageUpload(event: any) {
    this.globalDataService.setIsLoading(true);
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = () => this.imageUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
    this.globalDataService.setIsLoading(false);
  }

  editUpload(fileInput: HTMLInputElement) {  
    this.imageUrl = null;
    this.file = null;
    fileInput.value = '';    
    fileInput.click();
  }

  SaveItem(){    
    this.globalDataService.setIsLoading(true);
    this.closetService.saveItem(this.item).subscribe(data => { 
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.isAllowed =  true;  
        this.EditCloset(this.closet.ClosetID, true);      
        this.globalDataService.setIsLoading(false);
      }
    });
  }

  CheckImage(){
    if(this.imageUrl == null){
      return true;
    }
    else {
      this.globalDataService.setIsLoading(true);
      this.closetService.checkImage(this.file).subscribe(data => {   
        var response = JSON.parse(JSON.stringify(data));
        if(response.error_message){
          this.globalDataService.handleMessages(response.error_message, "danger", 2000);
          if(response.error_message === "inactive user")
            this.isAllowed =  false;
          this.globalDataService.setIsLoading(false);
        }
        else {         
          this.isAllowed =  true;   
          var tempResponse = JSON.parse(JSON.stringify((data)));
          if(tempResponse.AI !== undefined && tempResponse.AI != null){
            var AI = tempResponse.AI.ID;        
            var season = this.closetdata.Seasons.find(a => a.seasonID == AI.seasonID);
            this.item.SeasonID = season.seasonID;
            this.selectedSeasons.length = 0;
            this.selectedSeasons.push(season.seasonName);
            var occ = this.closetdata.Occasions.find(a => a.occasionID == AI.styleID);
            this.item.OccasionID = occ.occasionID;
            this.selectedOccasions.length = 0;
            this.selectedOccasions.push(occ.occasionName);
            var color = this.closetdata.Colors.find(a => a.ColorID == AI.colorID);
            this.item.ColorID = color.ColorID;
            this.selectedColor = color.ColorName; 
            var cat = this.closetdata.Categories.find(a => a.categoryID == AI.categoryID);
            this.item.CategoryID = cat.categoryID;
            this.selectedCategory = cat.categoryName;
            var mat  = this.closetdata.Materials.find(a => a.materialID == AI.materialsID);
            this.item.MaterialID = mat.materialID;
            this.selectedMaterial = mat.materialName;              
            var pat = this.closetdata.Patterns.find(a => a.patternID == AI.patternID);
            this.item.PatternID = pat.patternID;
            this.selectedPattern = pat.patternName;

            this.imageUrl = tempResponse.fileUrl;
        
            this.item.ItemID = 0;
            this.item.ImagePath = tempResponse.fileUrl;
            this.item.Preferred = this.favorite;
            this.item.Archive = this.archive;
            this.item.ClosetID = this.closet.ClosetID;
            this.globalDataService.setIsLoading(false);
          }        
          else 
            return false;
        }
      });
    }
  }

  AIStyling(){
    this.styling = true;
  }

  ShowPopup(ClosetID){
    if (this.showPopup[ClosetID]) 
    {
      this.showPopup.length = 0;
    }
    else
    {
      this.showPopup.length = 0; 
      this.showPopup[ClosetID] = true;
    }   
  }

  DeleteCloset(ClosetID){
    const confirmed = window.confirm('Are you sure you want to delete this closet?');
    if (confirmed) {
      this.globalDataService.setIsLoading(true);
      this.closetService.deleteCloset(ClosetID).subscribe(data => { 
        var response = JSON.parse(JSON.stringify(data));
        if(response.error_message){
          this.globalDataService.handleMessages(response.error_message, "danger", 2000);
          if(response.error_message === "inactive user")
            this.isAllowed =  false;
          this.globalDataService.setIsLoading(false);
        }
        else {         
          this.isAllowed =  true; 
          this.getClosets();
          this.globalDataService.setIsLoading(false);
        }
      });
    }
  }

  toggleDrag(ClosetOrder) {
    this.showPopup.length = 0;
    this.enableDrag.length = 0;
    this.enableDrag[ClosetOrder] = true;
  }

  drag(event: DragEvent, ClosetOrder) {   
    if (!this.enableDrag[ClosetOrder]) {
      event.preventDefault();
      return;
    }
    event.dataTransfer?.setData("text/plain", ClosetOrder.toString());
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    this.enableDrag.length = 0;
    const sourceIndex = +event.dataTransfer?.getData("text/plain")!;            
    const sourceItem = this.filteredClosets.find(a => a.ClosetOrder === sourceIndex);
    const targetItem = this.filteredClosets.find(a => a.ClosetOrder === targetIndex);

    if (sourceItem && targetItem) {
      const temp = sourceItem.ClosetOrder;
      sourceItem.ClosetOrder = targetItem.ClosetOrder;
      targetItem.ClosetOrder = temp;
    }
            
    this.globalDataService.setIsLoading(true);
    this.closetService.EditClosetOrder(this.filteredClosets).subscribe(data => { 
      var response = JSON.parse(JSON.stringify(data));
      if(response.error_message){
        this.globalDataService.handleMessages(response.error_message, "danger", 2000);
        if(response.error_message === "inactive user")
          this.isAllowed =  false;
        this.globalDataService.setIsLoading(false);
      }
      else {         
        this.isAllowed =  true; 
        this.getClosets();
        this.globalDataService.setIsLoading(false);
      }
    });
  }

  Archive(){
    this.isArchive = true;
  }

  Favorites(){
    this.isFavorite = true;
  } 
  
  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredClosets = JSON.parse(JSON.stringify(this.data));         
      this.filteredClosets.sort((a, b) => a.ClosetOrder - b.ClosetOrder);  
      return;
    }
  
    this.filteredClosets = this.data.filter(closet =>
      closet.ClosetName.toLowerCase().includes(term)
    );
  }
}