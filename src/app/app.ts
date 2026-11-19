import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Menu } from './menu/menu';
// import { Signin } from './signin/signin';



const LAST_PAGE_KEY = 'mdniy-last-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly isAdminArea = signal(false);
  readonly showBackToTop = signal(false);
  readonly currentYear = new Date().getFullYear();

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.showBackToTop.set(window.scrollY > 300);
    }
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  constructor(private router: Router) {
    this.isAdminArea.set(this.matchesAdminArea(this.router.url));

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminArea.set(this.matchesAdminArea(event.urlAfterRedirects));
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(LAST_PAGE_KEY, event.urlAfterRedirects || '/');
        }
      }
    });
  }

  private matchesAdminArea(url: string): boolean {
    const path = url.split(/[?#]/, 1)[0].replace(/\/+$/, '');
    return path === '/admin' || path === '/dashboard';
  }
}
