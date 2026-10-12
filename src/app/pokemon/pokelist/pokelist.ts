import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '../data/pokemon.service';
import { Pokemon } from '../pokemon.model';

export function displayTitleCase(text: string): string {
    // (/\b\w/g) = regex to find the first letter within a text
    return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

@Component({
  imports: [],
  selector: 'app-pokelist',
  templateUrl: './pokelist.html',
})
export class Pokelist {
  protected readonly pokemonService = inject(PokemonService);

  protected readonly pokeList = toSignal(
    this.pokemonService.list(), 
    { initialValue: [] as Pokemon[] }
  );

  protected readonly displayTitleCase = displayTitleCase;
}
