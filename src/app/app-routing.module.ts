import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './feed/header/header.component';

const routes: Routes = [
  { path: '', component: HeaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    initialNavigation: 'enabledBlocking',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }