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
import { AuthService } from './services/auth-service.service';
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
  groupRequests: any[] = [];
  isSuperAdmin = false;
  isGroupAdmin = false;
  isLoggedIn = false;
  userSession: any = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Subscribing to the current user observable from the AuthServiceService
    this.authService.user.subscribe((user) => {
      this.userSession = user;
      console.log('User session:', this.userSession);
      if (user) {
        this.isLoggedIn = true;
        this.groups = user.groups || [];
        this.groupRequests = user.groupRequests || [];
        this.isSuperAdmin = user.role === "super_admin" || false;
        this.isGroupAdmin = user.role === "group_admin" || false;
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
    // Call logout method from the AuthServiceService
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    // Using deleteAccount method from the AuthServiceService
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

  refetchUser() {
    this.authService.refetchUser().subscribe((user) => {
      
    });
  }
}
