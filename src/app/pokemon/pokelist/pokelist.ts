import { Component, inject, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '../data/pokemon.service';
import { Pokemon } from '../pokemon.model';
import { map } from 'rxjs';

interface PkmTypeViewModel {
  readonly name: string;
  readonly displayName: string;
  readonly color: string;
}

interface PkmCardViewModel {
  readonly id: number;
  readonly displayName: string;
  readonly imgUrl: string | null;
  readonly imgAlt: string;
  readonly types: readonly PkmTypeViewModel[];
  readonly background: string;
}

const DEFAULT_TYPE_COLOR = '#6C757D';

const TYPE_COLORS: Readonly<Record<string, string>> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

function GetTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? DEFAULT_TYPE_COLOR;
}

export function displayTitleCase(text: string): string {
  // (/\b\w/g) = regex to find the first letter within a text
  return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

function toCardViewModel(dto: Pokemon): PkmCardViewModel {
  const displayName = displayTitleCase(dto.name);
  const types = dto.types.map((type) => ({
    name: type,
    displayName: displayTitleCase(type),
    color: GetTypeColor(type.toLowerCase()),
  }));

  const fstColor = types[0]?.color ?? DEFAULT_TYPE_COLOR;
  const sndColor = types[1]?.color ?? fstColor;

  return {
    id: dto.id,
    displayName: displayName,
    imgUrl: dto.sprite,
    imgAlt: `${displayName} image`,
    types: types,
    background:
      `linear-gradient(
        #182033,
        #182033
        ) padding-box, 
      linear-gradient(
        135deg, 
        ${fstColor} 0 50%, 
        ${sndColor} 50% 100%
      ) border-box`,
  };
}

@Component({
  imports: [],
  selector: 'app-pokelist',
  templateUrl: './pokelist.html',
})
export class Pokelist {
  protected readonly pokemonService = inject(PokemonService);

  protected readonly pokeList = toSignal(
    this.pokemonService.list().pipe(map((pokemon) => pokemon.map(toCardViewModel))),
    { initialValue: [] as PkmCardViewModel[] },
  );
}
