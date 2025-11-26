import { Routes } from '@angular/router';
import { SignupPage } from './pages/signup-page/signup-page';
import { HomePage } from './pages/home-page/home-page';
import { CreateEventPage } from './pages/create-event-page/create-event-page';
import { LoginPage } from './pages/login-page/login-page';
import { EventDetailPage } from './pages/event-detail-page/event-detail-page';
import { MyApplicationsPage } from './pages/my-applications-page/my-applications-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { EventApplicationsPage } from './pages/event-applications-page/event-applications-page';
import { authGuard, organizacionGuard, postulanteGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component: LoginPage },
    { path: 'signup', component: SignupPage },
    { path: 'eventos/:id', component: EventDetailPage },
    { path: 'eventos/:id/postulaciones', component: EventApplicationsPage, canActivate: [authGuard, organizacionGuard] },
    { path: 'create-event', component: CreateEventPage, canActivate: [authGuard, organizacionGuard] },
    { path: 'mis-postulaciones', component: MyApplicationsPage, canActivate: [authGuard, postulanteGuard] },
    { path: 'perfil', component: ProfilePage, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }   
];
