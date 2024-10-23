import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Import FormsModule
@Component({
  selector: 'app-delete-acc',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './delete-acc.component.html',
  styleUrl: './delete-acc.component.scss'
})
export class DeleteAccComponent {
  // Track the active form: 'delacc' for the first form, 'delacc1' for the second
  activeForm: 'delacc' | 'delacc1' | 'delacc2' = 'delacc';

  // Variable for holding the password input
  password: string = '';

  // Method to toggle between the forms
  toggleForm(form: 'delacc' | 'delacc1' | 'delacc2') {
    this.activeForm = form;
  }

  // Method to handle cancel action (you can define additional behavior if needed)
  onCancel() {
    // Optional: Add logic to reset form, go back, or handle the cancel action
    this.activeForm = 'delacc'; // Reset back to the first form
  }

  // Method to handle the confirm action after entering password
  onConfirm() {
    if (this.password) {
      // You can add password validation or submission logic here
      console.log('Password entered:', this.password);

      // Add your form submission or API logic here
    } else {
      alert('Please enter your password to continue.');
    }
  }

}
