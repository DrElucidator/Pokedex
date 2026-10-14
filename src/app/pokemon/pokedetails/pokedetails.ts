import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PokemonService } from '../data/pokemon.service';
import { PkmDetails, PkmTypeViewModel } from '../pokemon.model';
import { displayTitleCase, GetTypeBackgroundColor, toTypesViewModel } from '../pokemon.utility';
import { FavService } from '../favorites/favlist.service';

interface PkmAbilityViewModel {
  readonly name: string;
  readonly displayName: string;
}

interface PkmStatViewModel {
  readonly name: string;
  readonly displayName: string;
  readonly value: number;
  readonly percentage: number;
}

interface PkmNavigationViewModel {
  readonly id: number;
  readonly number: string;
  readonly name: string;
  readonly displayName: string;
  readonly spriteUrl: string | null;
  readonly spriteAlt: string;
}

interface PkmDetailsViewModel {
  readonly id: number;
  readonly number: string;
  readonly name: string;
  readonly displayName: string;
  readonly background: string;
  readonly spriteUrl: string | null;
  readonly imgUrl: string | null;
  readonly imgAlt: string;
  readonly audioUrl: string | null;
  readonly height: string;
  readonly weight: string;
  readonly abilities: readonly PkmAbilityViewModel[];
  readonly stats: readonly PkmStatViewModel[];
  readonly previous: PkmNavigationViewModel | null;
  readonly next: PkmNavigationViewModel | null;
}

const STAT_LABELS: Readonly<Record<string, string>> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Special Attack',
  'special-defense': 'Special Defense',
  speed: 'Speed',
};

function toPkmNumber(id: number): string {
  return `#${id.toString().padStart(3, '0')}`;
}

function toPkmHeight(height: number): string {
  return `${(height / 10).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} m`;
}

function toPkmWeight(weight: number): string {
  return `${(weight / 10).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`;
}

function toStatName(name: string): string {
  return STAT_LABELS[name] ?? displayTitleCase(name);
}

function getStatPercentage(value: number): number {
  return Math.min((value / 255) * 100, 100);
}

function toNavigationViewModel(dto: PkmDetails | null): PkmNavigationViewModel | null {
  if (!dto) {
    return null;
  }

  const displayName = displayTitleCase(dto.name);

  return {
    id: dto.id,
    number: toPkmNumber(dto.id),
    name: dto.name,
    displayName: displayName,
    spriteUrl: dto.spriteUrl,
    spriteAlt: `${displayName}'s sprite`,
  };
}

function toDetailsViewModel(
  dto: PkmDetails,
  previous: PkmDetails | null,
  next: PkmDetails | null,
): PkmDetailsViewModel {
  const displayName = displayTitleCase(dto.name);
  const types = toTypesViewModel(dto.types);

  return {
    id: dto.id,
    number: toPkmNumber(dto.id),
    name: dto.name,
    displayName: displayName,
    background: GetTypeBackgroundColor(types),
    spriteUrl: dto.spriteUrl,
    imgUrl: dto.imgUrl,
    imgAlt: `${displayName} image`,
    audioUrl: dto.audioUrl,
    height: toPkmHeight(dto.height),
    weight: toPkmWeight(dto.weight),
    abilities: dto.abilities.map((name) => ({ name: name, displayName: displayTitleCase(name) })),
    stats: dto.stats.map(({ name, baseValue }) => ({
      name: name,
      displayName: toStatName(name),
      value: baseValue,
      percentage: getStatPercentage(baseValue),
    })),

    previous: toNavigationViewModel(previous),
    next: toNavigationViewModel(next),
  };
}

@Component({
  imports: [RouterLink],
  selector: 'app-pokedetails',
  styleUrl: './pokedetails.scss',
  templateUrl: './pokedetails.html',
})
export class PokeDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly pokemonService = inject(PokemonService);
  private readonly favService = inject(FavService);

  protected readonly pokemon = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('name') ?? ''),
      switchMap((name) => this.pokemonService.getByName(name)),
      switchMap((pokemon) =>
        forkJoin({
          pokemon: of(pokemon),
          previous: this.getNeighbor(pokemon.id - 1),
          next: this.getNeighbor(pokemon.id + 1),
        }),
      ),
      map(({ pokemon, previous, next }) => toDetailsViewModel(pokemon, previous, next)),
    ),
  );

  readonly favorited = computed(() => this.favService.favorited(this.pokemon()!.id));

  switchFavStatus(): void {
    const selectedPokemon = this.pokemon();

    if (!selectedPokemon) return;

    this.favService.switchFav({
      id: selectedPokemon.id,
      name: selectedPokemon.name,
      spriteUrl: selectedPokemon.spriteUrl
    });
  }

  private getNeighbor(id: number): Observable<PkmDetails | null> {
    if (id < 1) {
      return of(null);
    }

    return this.pokemonService.getById(id).pipe(catchError(() => of(null)));
  }
}
