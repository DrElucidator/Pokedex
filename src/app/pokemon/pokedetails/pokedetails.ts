import { map, switchMap } from 'rxjs';

import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PokemonService } from '../data/pokemon.service';
import { PkmDetails, PkmTypeViewModel } from '../pokemon.model';
import { displayTitleCase, GetTypeBackgroundColor, toTypesViewModel } from '../pokemon.utility';

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
  readonly types: readonly PkmTypeViewModel[];
  readonly abilities: readonly PkmAbilityViewModel[];
  readonly stats: readonly PkmStatViewModel[];
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

function toDetailsViewModel(dto: PkmDetails): PkmDetailsViewModel {
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
    types: types,
    abilities: dto.abilities.map((name) => ({ name: name, displayName: displayTitleCase(name) })),
    stats: dto.stats.map(({ name, baseValue }) => ({
      name: name,
      displayName: displayTitleCase(name),
      value: baseValue,
      percentage: getStatPercentage(baseValue),
    })),
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

  protected readonly pokemon = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('name') ?? ''),
      switchMap((name) => this.pokemonService.getByName(name)),
      map(toDetailsViewModel),
    ),
  );
}
