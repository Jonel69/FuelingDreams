// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';


// @Component({
//   selector: 'app-forget-pass',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule ,FormsModule],
//   templateUrl: './forget-pass.component.html',
//   styleUrl: './forget-pass.component.scss'
// })
// export class ForgetPassComponent {

//   activeForm: 'forgetpass' | 'emailotp' | 'resetpass' = 'forgetpass';

//   toggleForm(form: 'forgetpass' | 'emailotp' | 'resetpass') {
//     this.activeForm = form;
//   }

//   constructor(public router: Router) { }
//   onSignin(){
//     this.router.navigate(['/professional-connect/login']);
//   }

//   onregister(){
//     this.router.navigate(['/professional-connect/register']);
//   }

//   otp: string[] = ['', '', '', ''];

//   // Method to move to the next input field
//   moveToNext(index: number): void {
//     if (this.otp[index] && this.otp[index].length === 1 && index < this.otp.length - 1) {
//       const nextInput = document.getElementById(`input${index + 2}`);
//       if (nextInput) {
//         (nextInput as HTMLInputElement).focus();
//       }
//     }
//   }

//   // Move to the previous input on backspace
//   moveToPrevious(event: KeyboardEvent, index: number): void {
//     if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
//       const prevInput = document.getElementById(`input${index}`);
//       if (prevInput) {
//         (prevInput as HTMLInputElement).focus();
//       }
//     }
//   }

// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss']
})
export class ForgetPassComponent implements OnInit {
  activeForm: 'forgetpass' | 'emailotp' | 'resetpass' = 'forgetpass';
  forgotPasswordForm!: FormGroup;
  otpForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder, public router: Router) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    });
  }

  toggleForm(form: 'forgetpass' | 'emailotp' | 'resetpass') {
    this.activeForm = form;
  }

  onSignin() {
    this.router.navigate(['/professional-connect/login']);
  }

  onRegister() {
    this.router.navigate(['/professional-connect/register']);
  }

  requestPasswordReset() {
    if (this.forgotPasswordForm.valid) {
      // Handle password reset request
      console.log(this.forgotPasswordForm.value);
    }
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      // Handle OTP verification
      console.log(this.otpForm.value);
    }
  }

  resendOtp() {
    // Handle resending OTP
    console.log("OTP resent");
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      // Handle password reset
      console.log(this.resetPasswordForm.value);
    }
  }

  otp: string[] = ['', '', '', ''];

  // Method to move to the next input field
  moveToNext(index: number): void {
    if (this.otp[index] && this.otp[index].length === 1 && index < this.otp.length - 1) {
      const nextInput = document.getElementById(`input${index + 2}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  }

  // Move to the previous input on backspace
  moveToPrevious(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      const prevInput = document.getElementById(`input${index}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  }
}
