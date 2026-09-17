import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Signin } from './signin/signin';
import { Register } from './register/register';
import { Publication } from './publication/publication';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'publication', component: Publication },
    { path: 'signin', component: Signin },
    { path: 'register', component: Register }
];
