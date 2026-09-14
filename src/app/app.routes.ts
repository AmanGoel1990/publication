import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Signin } from './signin/signin';
import { Register } from './register/register';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'signin', component: Signin },
    { path: 'register', component: Register }
];
