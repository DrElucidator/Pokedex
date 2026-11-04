import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  bufferCount,
  concatMap,
  from,
  map,
  mergeMap,
  Observable,
  scan,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { PkmDetails, Pokemon } from '../pokemon.model';
import { UrlGeneration, UrlPokedex, UrlPokemon } from './pokemon.dto';

export const POKE_API_URL = new InjectionToken<string>('POKE_API_URL');
export const POKE_API_ROOT_URL = new InjectionToken<string>('POKE_API_ROOT_URL');

const DETAILS_CONCURRENCY = 6;
const DETAILS_BATCH_SIZE = 6;
const BACKGROUND_BATCH_PAUSE_MS = 150;

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

function getIdFromUrl(url: string): number {
  const id = Number(url.split('/').filter(Boolean).at(-1));

  if (!Number.isInteger(id)) {
    throw new Error(`Unable to extract an identifier from ${url}.`);
  }

  return id;
}

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(POKE_API_URL);
  private readonly apiRootUrl = inject(POKE_API_ROOT_URL);

  list(): Observable<Pokemon[]> {
    return this.http.get<UrlPokedex>(`${this.apiRootUrl}pokedex/national/`).pipe(
      switchMap(({ pokemon_entries: entries }) =>
        from(entries).pipe(
          bufferCount(DETAILS_BATCH_SIZE),
          concatMap((batch, batchIndex) =>
            timer(batchIndex === 0 ? 0 : BACKGROUND_BATCH_PAUSE_MS).pipe(
              switchMap(() =>
                from(batch).pipe(
                  mergeMap(
                    ({ entry_number }) =>
                      this.http
                        .get<UrlPokemon>(`${this.apiUrl}${entry_number}`)
                        .pipe(map(mapPokeRequest)),
                    DETAILS_CONCURRENCY,
                  ),
                ),
              ),
            ),
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

  getGenerationIds(generation: string): Observable<ReadonlySet<number>> {
    return this.http.get<UrlGeneration>(`${this.apiRootUrl}generation/${generation}/`).pipe(
      map(({ pokemon_species }) => new Set(pokemon_species.map(({ url }) => getIdFromUrl(url)))),
    );
  }

  getRegionalPokedexIds(pokedex: string): Observable<ReadonlySet<number>> {
    return this.http.get<UrlPokedex>(`${this.apiRootUrl}pokedex/${pokedex}/`).pipe(
      map(({ pokemon_entries }) => new Set(pokemon_entries.map(({ entry_number }) => entry_number))),
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
