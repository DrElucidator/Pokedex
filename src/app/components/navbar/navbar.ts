import { Component, signal } from '@angular/core';

interface NavbarItem {
  title: string;
  url: string;
}

@Component({
  imports: [],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly navbarItems: NavbarItem[] = [{ title: 'Home', url: '#' }];

  protected readonly menuOpen = signal(false);

  protected menuToggle(): void {
    this.menuOpen.update((open) => !open);
  }

  protected menuClose(): void {
    this.menuOpen.set(false);
  }
}