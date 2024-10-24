import { Component, OnInit } from '@angular/core'; // Added OnInit
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Added HttpClient import
// import { SideNavComponent } from "../side-nav/side-nav.component";
import { AuthService } from '../../auth.service';
import { MatDialog } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { MatIcon, MatIconModule } from '@angular/material/icon';
// import { CropperDialoComponent } from '../UPP/cropper-dialo/cropper-dialo.component';
// import { ImageContComponent } from '../UPP/image-cont/image-cont.component';
// import { delete-acc } from './delete-acc/DeleteAccComponent.component';
// import { MatDialog } from '@angular/material/dialog';
// import { FormsModule } from '@angular/forms';  // Import FormsModule
// import { NgModule } from '@angular/core';
// import { DeleteAccComponent } from './delete-acc/delete-acc.component';

import { DeleteAccComponent } from "./delete-acc/delete-acc.component";
import { SideNavComponent } from '../../side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CropperDialoComponent } from './upp/cropper-dialo/cropper-dialo.component';
import { ImageContComponent } from './upp/image-cont/image-cont.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SideNavComponent,HttpClientModule,CommonModule, MatIconModule, DeleteAccComponent,CropperDialoComponent,ImageContComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'], // Corrected `styleUrl` to `styleUrls`
  providers:[AuthService]
})
export class ProfileComponent implements OnInit {

  profileData: any = {};

  constructor(private http: HttpClient, private matDialog:MatDialog) { }

  ngOnInit(): void {
    this.fetchProfileData();
  }

  fetchProfileData(): void {
    // Replace 'your-api-endpoint' with the actual API endpoint to fetch profile data
    const apiEndpoint = 'http://localhost:5000/api/getprofile'; 

    this.http.get(apiEndpoint).subscribe(
      (data: any) => {
        this.profileData = data;
      },
      (error) => {
        console.error('Error fetching profile data:', error);
      }
    );
  }

  imageReady(blob:Blob){
    console.log(blob);
  }

  
  openDialog(){
    this.matDialog.open(DeleteAccComponent,{
      width: '500px',
      height: '300px',
      panelClass: 'custom-DC',
    })
  }
}
