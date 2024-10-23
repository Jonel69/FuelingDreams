import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  isSlideOut = true;
  constructor(private router: Router){}

  toggleSlideOut(): void{
    this.isSlideOut = !this.isSlideOut;
 
  }

  onDash(){
    this.router.navigate(['/professional-connect/dashboard']);
  }  
  onProfile(){
    this.router.navigate(['/professional-connect/profile']);
  }
  
  onHistory(){
    this.router.navigate(['/professional-connect/history']);
  }

  onLogout(){
    this.router.navigate(['/professional-connect/login']);
  }

}

  
