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
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'PortalChat';
  isSidebarOpen = false;
  groups: any[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      if (user) {
        this.groups = user.groups || [];
      } else {
        this.groups = [];
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;

        if (!this.authService.user && currentUrl !== '/register') {
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
}
