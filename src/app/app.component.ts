import { Component, OnInit } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  NavigationEnd,
} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    LoginComponent,
    HomeComponent,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'PortalChat';
  isSidebarOpen = false;
  groups: any[] = [];
  isSuperAdmin = false;
  isLoggedIn = false;
  userSession: any = null; // Variable to store user session data

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.userSession = user;
      console.log('User session:', this.userSession);
      if (user) {
        this.isLoggedIn = true;
        this.groups = user.groups || [];
        console.log('User groups:', this.groups);
        this.isSuperAdmin = user.roles?.includes('Super Admin') || false;
      } else {
        this.groups = [];
        this.isSuperAdmin = false;
        this.isLoggedIn = false;
      }
      console.log('Current user:', user);
      console.log('Current groups:', this.groups);
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.isLoggedIn && this.router.url !== '/register') {
          this.router.navigate(['/login']);
        }
      });
  }

  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    this.authService
      .deleteAccount()
      .pipe(
        tap(() => {
          console.log('Account deleted successfully');
          this.router.navigate(['/register']);
        }),
        catchError((error) => {
          console.error('Error deleting account:', error);
          return of(null);
        })
      )
      .subscribe();
  }
}
