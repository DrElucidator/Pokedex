import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '../data/pokemon.service';
import { Pokemon } from '../pokemon.model';
import { map } from 'rxjs';

interface PkmTypeViewModel {
  readonly name: string;
  readonly displayName: string;
}

interface PkmCardViewModel {
  readonly id: number;
  readonly displayName: string;
  readonly imgUrl: string | null;
  readonly imgAlt: string;
  readonly types: readonly PkmTypeViewModel[];
}

export function displayTitleCase(text: string): string {
    // (/\b\w/g) = regex to find the first letter within a text
    return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

function toCardViewModel(dto: Pokemon): PkmCardViewModel {
  const displayName = displayTitleCase(dto.name);
  const types = dto.types.map(type => ({
    name: type,
    displayName: displayTitleCase(type)
  }));

  return {
    id: dto.id,
    displayName: displayName,
    imgUrl: dto.sprite,
    imgAlt: `${displayName} image`,
    types: types
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
    { initialValue: [] as PkmCardViewModel[] }
  );
}
