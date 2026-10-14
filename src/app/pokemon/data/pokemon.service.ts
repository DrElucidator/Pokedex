import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { PkmDetails, Pokemon } from '../pokemon.model';
import { UrlObjRequest, UrlPokemon } from './pokemon.dto';

export const POKE_API_URL = new InjectionToken<string>('POKE_API_URL');

function mapPokeRequest(dto: UrlPokemon): Pokemon {
  return {
    id: dto.id,
    name: dto.name,
    types: dto.types.map((item) => item.type.name),
    spriteUrl: dto.sprites.front_default,
  };
}

function mapPokeDetailsRequest(dto: UrlPokemon): PkmDetails {
  return {
    ...mapPokeRequest(dto),
    imgUrl: dto.sprites.other?.['official-artwork']?.front_default ?? dto.sprites.front_default,
    audioUrl: dto.cries?.latest ?? dto.cries?.legacy ?? null,
    height: dto.height,
    weight: dto.weight,
    abilities: dto.abilities.map(({ ability }) => ability.name),
    stats: dto.stats.map(({ stat, base_stat }) => ({ name: stat.name, baseValue: base_stat })),
  };
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
      map((details: UrlPokemon[]): Pokemon[] => details.map(mapPokeRequest)),
    );
  }

  getByName(name: string): Observable<PkmDetails> {
    const nameNormalized = name.trim().toLowerCase();

    return this.http
      .get<UrlPokemon>(`${this.apiUrl}${encodeURIComponent(nameNormalized)}`)
      .pipe(map(mapPokeDetailsRequest));
  }

  getById(id: number): Observable<PkmDetails> {
    return this.http
      .get<UrlPokemon>(`${this.apiUrl}${id}`)
      .pipe(map(mapPokeDetailsRequest));
  }
}
