import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Pokelist } from './pokemon/pokelist/pokelist';

@Component({
  imports: [Navbar, Pokelist],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App { }
