import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

// Define interfaces for form data types
interface LoginCredentials {
  email: string;
  pass: string;
}

interface RegistrationData {
  f_name: string;
  l_name: string;
  email: string;
  phone_no: string;
  dob: string;
  gender: string;
  country: string;
  address: string;
  pass: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  myGroup: FormGroup;
  
  countries: any[] = [];
  errorMessage: string = '';

  // Updated form group with 'pass' field instead of 'password'
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required] // Changed from password to pass to match database field
  });

  registerForm = this.fb.group({
    f_name: ['', [Validators.required, Validators.minLength(2)]],
    l_name: ['', [Validators.required, Validators.minLength(2)]],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    phone_no: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    country: ['', Validators.required],
    pass: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]],
    confirmPassword: ['', Validators.required]
  });

  activeForm: 'login' | 'register' = 'login';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.myGroup = new FormGroup({
      firstName: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadCountries();
  }

  // Fetch countries for dropdown
  loadCountries() {
    this.authService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.snackBar.open('Error loading countries', 'Close', { duration: 3000 });
      }
    });
  }

  // Toggle between login and register forms
  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
  }

  // Handle login submission
  login() {
    if (this.loginForm.valid) {
      const credentials: LoginCredentials = {
        email: this.loginForm.get('email')?.value ?? '',
        pass: this.loginForm.get('pass')?.value ?? ''
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Login error:', error);
          this.snackBar.open(error.error.error || 'Login failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // Handle registration submission
  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.get('pass')?.value !== this.registerForm.get('confirmPassword')?.value) {
        this.snackBar.open('Passwords do not match!', 'Close', { duration: 3000 });
        return;
      }

      const registrationData: RegistrationData = {
        f_name: this.registerForm.get('f_name')?.value ?? '',
        l_name: this.registerForm.get('l_name')?.value ?? '',
        email: this.registerForm.get('email')?.value ?? '',
        phone_no: this.registerForm.get('phone_no')?.value ?? '',
        dob: this.registerForm.get('dob')?.value ?? '',
        gender: this.registerForm.get('gender')?.value ?? '',
        country: this.registerForm.get('country')?.value ?? '',
        address: this.registerForm.get('address')?.value ?? '',
        pass: this.registerForm.get('pass')?.value ?? ''
      };

      this.authService.register(registrationData).subscribe({
        next: (response) => {
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
          this.activeForm = 'login';
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.snackBar.open(error.error.error || 'Registration failed', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
    }
  }

  // Redirect to forget password page
  onforget() {
    this.router.navigate(['/forget-password']);
  }
}
