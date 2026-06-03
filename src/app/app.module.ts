import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { GlobalDataService } from './global-data.service';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SdpLoaderComponent } from './sdp-loader/sdp-loader.component';
import { ToastComponent } from './toast/toast.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './feed/header/header.component';
import { WeatherComponent } from './feed/weather/weather.component';
import { FashionCardsComponent } from './feed/fashion-cards/fashion-cards.component';
import { ClosetComponent } from './closet/closet.component';
import { OutfitComponent } from './outfit/outfit.component';
import { ProfileComponent } from './profile/profile.component';
import { StylingComponent } from './styling/styling.component';
import { MenuComponent } from './menu/menu.component';
import { FeedComponent } from './feed/feed.component';
import { FavoritesComponent } from './closet/favorites/favorites.component';
import { ArchiveComponent } from './closet/archive/archive.component';

export function initApp(authService: AuthService) {
  return () => authService.initializeLogin();
}

@NgModule({
  declarations: [      
    AppComponent,
    SdpLoaderComponent,
    ToastComponent,    
    HeaderComponent,
    WeatherComponent,    
    FashionCardsComponent,
    ClosetComponent,
    OutfitComponent,
    ProfileComponent,
    StylingComponent,
    MenuComponent,
    FeedComponent,
    FavoritesComponent,
    ArchiveComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    FormsModule,
    HttpClientModule,
    NgbModule,  
    CommonModule    
  ],
  providers: [    
    { provide: ErrorHandler },
    GlobalDataService,
    DatePipe,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AuthService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {}
}