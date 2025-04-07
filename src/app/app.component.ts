import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class AppComponent implements OnInit {
  title = 'mocafi-interview';
  isAuthenticated = false;
  
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        // Redirect to users page if authenticated
        if (isAuthenticated) {
          this.router.navigate(['/users']);
        }
      }
    );
  }
  
  logout(): void {
    this.authService.logout();
    // Navigate to signup page after logout
    this.router.navigate(['/signup']);
  }
}
