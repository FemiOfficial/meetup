import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { FileSelectDirective } from 'ng2-file-upload';
import {BreadcrumbsModule} from "ng6-breadcrumbs";

import {MatExpansionModule} from '@angular/material/expansion';
import { MatToolbarModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatOptionModule, 
  MatSelectModule, 
  MatIconModule, 
  MatButtonModule, 
  MatCardModule, 
  MatTableModule, 
  MatCheckboxModule,
  MatProgressBarModule,
  MatDividerModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatSidenavModule,
  MatSnackBarModule } from '@angular/material';
  import {MatButtonToggleModule} from '@angular/material/button-toggle';
  import {MatTabsModule} from '@angular/material/tabs';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { HomeComponent } from './home/home/home.component';

import {AuthenticationService} from '../authenticaion.service';
import { ServerService } from '../server.service';
import {AuthGuardService} from '../auth-guard.service';
import { BannerComponent } from './home/banner/banner.component';
import { HeaderComponent } from './header/header/header.component';
import { UpdateProfileComponent } from './profile/update-profile/update-profile.component';
import { MainComponent } from './profile/main/main.component';
import { MessageComponent } from './profile/message/message.component';
import { MenteeComponent } from './mentee/mentee.component';
import { MentorComponent } from './mentor/mentor.component';
import { BioComponent } from './bio/bio.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent}, 
  { path: 'mentee', component: MenteeComponent},
  { path: 'mentor', component: MentorComponent},
  { path: 'bio/:id', component: BioComponent},
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'always',
    children: [
      { 
        path: '',
        component: MainComponent,
      },
      { 
        path: 'update_profile', 
        component: UpdateProfileComponent,
      },
      ]
  },


]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    BannerComponent,
    HeaderComponent,
    UpdateProfileComponent,
    MainComponent,
    MessageComponent,
    MenteeComponent,
    MentorComponent,
    BioComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    BreadcrumbsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes,  {onSameUrlNavigation: 'reload'}),
    MatSidenavModule,
    MatExpansionModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatTableModule,
    MatDividerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSnackBarModule,
    BrowserAnimationsModule
  ],
  providers: [AuthenticationService, AuthGuardService, ServerService],
  bootstrap: [AppComponent],
  entryComponents:[MessageComponent]
})
export class AppModule { }
