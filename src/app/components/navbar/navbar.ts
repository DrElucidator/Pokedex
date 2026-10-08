import { Component } from '@angular/core';

interface NavbarItem {
  title: string;
  url: string;
}

@Component({
  imports: [],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly navbarItems: NavbarItem[] = [
    {
      title: 'Home', url: '#'
    }
  ] 
}
