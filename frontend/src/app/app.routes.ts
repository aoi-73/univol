import { Routes } from '@angular/router';
import { SignupPage } from './pages/signup-page/signup-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'signup', component: SignupPage },
    { path: '**', redirectTo: '' }   
];
