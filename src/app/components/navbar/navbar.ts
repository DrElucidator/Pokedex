import { Component, inject, signal } from '@angular/core';
import { FavService } from '../../pokemon/favorites/favlist.service';
import { RouterLink } from '@angular/router';

interface NavbarItem {
  title: string;
  url: string;
}

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly favService = inject(FavService);

  protected onNavbarItemClick(item: NavbarItem, event: Event): void {
    event.preventDefault();

    if (item.title === 'Favorites') {
      this.favService.toggleFavlistActivated();
    }
    this.menuClose();
  }

  protected readonly navbarItems: NavbarItem[] = [
    { title: 'Home', url: '/pokemon' },
    { title: 'Favorites', url: '#' },
  ];

  protected readonly menuOpen = signal(false);

  protected menuToggle(): void {
    this.menuOpen.update((open) => !open);
  }

  protected menuClose(): void {
    this.menuOpen.set(false);
  }
}
