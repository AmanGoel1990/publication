import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Signin } from './signin/signin';
import { Register } from './register/register';
import { Publication } from './publication/publication';
import { Dashboard } from './dashboard/dashboard';
import { Contact } from './contact/contact';
import { Cart } from './cart/cart';
import { About } from './about/about';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'dashboard', component: Dashboard },
    { path: 'cart', component: Cart },
    { path: 'publication', component: Publication },
    { path: 'about', component: About },
    { path: 'signin', component: Signin },
    { path: 'register', component: Register },
    // { path: 'contact', loadComponent: () => import('./contact/contact').then((module) => module.Contact) },
    { path: 'contact', component: Contact }
];
