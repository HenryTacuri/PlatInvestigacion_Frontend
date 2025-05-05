import { Routes } from '@angular/router';
import AuthComponent from './auth/auth.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    {path:'', component:  AuthComponent},    
    {path:'auth', component:AuthComponent},
    { path: 'edit-user', component: EditUserComponent},
    { path: 'search', component: SearchComponent },
];
