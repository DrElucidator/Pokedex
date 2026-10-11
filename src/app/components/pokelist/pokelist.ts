import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map, switchMap } from 'rxjs';

interface UrlObjResult {
  name: string;
  url: string;
}

interface UrlObjRequest {
  count: number;
  next: string | null;
  preview: string | null;
  results: UrlObjResult[];
}

interface UrlPokeType {
  type: {
    name: string;
  };
}

interface UrlPokemon {
  id: number;
  name: string;
  types: UrlPokeType[];
  sprites: {
    front_default: string | null;
  };
}

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string | null;
}

@Component({
  imports: [],
  selector: 'app-pokelist',
  templateUrl: './pokelist.html',
})
export class Pokelist {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  protected readonly pokeList = toSignal(
    this.http.get<UrlObjRequest>(this.apiUrl).pipe(
      switchMap((obj) => {
        const requests = obj.results.map((r) => this.http.get<UrlPokemon>(r.url));

        return forkJoin(requests);
      }),
      map((details: UrlPokemon[]): Pokemon[] =>
        details.map((detail) => ({
          id: detail.id,
          name: detail.name,
          types: detail.types.map((item) => item.type.name),
          sprite: detail.sprites.front_default,
        })),
      ),
    ),
    { initialValue: null },
  );

  protected displayTitleCase(text: string): string {
    // (/\b\w/g) = regex to find the first letter within a text
    return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}
