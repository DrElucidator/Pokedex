import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, map, switchMap } from 'rxjs';
import { Pokemon } from '../pokemon.model';
import { UrlObjRequest, UrlPokemon } from './pokemon.dto';

export const POKE_API_URL = new InjectionToken<string>('POKE_API_URL');

function mapPokeRequest(dto: UrlPokemon): Pokemon {
    return {
          id: dto.id,
          name: dto.name,
          types: dto.types.map((item) => item.type.name),
          sprite: dto.sprites.front_default,
        }
}

@Injectable({ providedIn: 'root' })

export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(POKE_API_URL);

  list() {
    return this.http.get<UrlObjRequest>(this.apiUrl).pipe(
      switchMap((obj) => {
        const requests = obj.results.map((r) => this.http.get<UrlPokemon>(r.url));

        return forkJoin(requests);
      }),
      map((details: UrlPokemon[]): Pokemon[] =>
        details.map(mapPokeRequest)
      ),
    );
  }
}
