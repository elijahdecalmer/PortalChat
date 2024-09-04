import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BrowseGroupsComponent } from './browse-groups/browse-groups.component';
import { ViewChannelComponent } from './view-channel/view-channel.component';
import { ViewGroupComponent } from './view-group/view-group.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { ManageUsersComponent } from './manage-users/manage-users.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'browsegroups',
    component: BrowseGroupsComponent,
  },
  {
    path: 'viewchannel/:groupid/:channelid',
    component: ViewChannelComponent,
  },
  {
    path: 'viewgroup/:groupid',
    component: ViewGroupComponent,
  },
  {
    path: 'manageusers',
    component: ManageUsersComponent,
  },
];
