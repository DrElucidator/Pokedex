import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { from, map, mergeMap, Observable, scan, startWith, switchMap } from 'rxjs';
import { PkmDetails, Pokemon } from '../pokemon.model';
import { UrlObjRequest, UrlPokemon } from './pokemon.dto';

export const POKE_API_URL = new InjectionToken<string>('POKE_API_URL');

const INITIAL_POKEMON_LIMIT = 151;
const DETAILS_CONCURRENCY = 6;

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

  list(limit = INITIAL_POKEMON_LIMIT): Observable<Pokemon[]> {
    return this.http.get<UrlObjRequest>(`${this.apiUrl}?limit=${limit}`).pipe(
      switchMap(({ results }) =>
        from(results).pipe(
          mergeMap(
            ({ url }) => this.http.get<UrlPokemon>(url).pipe(map(mapPokeRequest)),
            DETAILS_CONCURRENCY,
          ),
          scan(
            (pokemon, current) =>
              [...pokemon, current].sort((first, second) => first.id - second.id),
            [] as Pokemon[],
          ),
          startWith([] as Pokemon[]),
        ),
      ),
    );
  }

  getByName(name: string): Observable<PkmDetails> {
    const nameNormalized = name.trim().toLowerCase();

    return this.http
      .get<UrlPokemon>(`${this.apiUrl}${encodeURIComponent(nameNormalized)}`)
      .pipe(map(mapPokeDetailsRequest));
  }

  getById(id: number): Observable<PkmDetails> {
    return this.http.get<UrlPokemon>(`${this.apiUrl}${id}`).pipe(map(mapPokeDetailsRequest));
  }
}
