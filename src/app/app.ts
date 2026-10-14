import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Favlist } from './pokemon/favorites/favlist';

@Component({
  imports: [Navbar, RouterOutlet, Favlist],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App { }
