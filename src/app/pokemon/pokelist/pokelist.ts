import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '../data/pokemon.service';
import { PkmTypeViewModel, Pokemon } from '../pokemon.model';
import { map } from 'rxjs';
import { GetTypeBackgroundColor, displayTitleCase, toTypesViewModel } from '../pokemon.utility';
import { RouterLink } from '@angular/router';

interface PkmCardViewModel {
  readonly id: number;
  readonly displayName: string;
  readonly name: string;
  readonly imgUrl: string | null;
  readonly imgAlt: string;
  readonly types: readonly PkmTypeViewModel[];
  readonly background: string;
}

function toCardViewModel(dto: Pokemon): PkmCardViewModel {
  const displayName = displayTitleCase(dto.name);
  const types = toTypesViewModel(dto.types);

  return {
    id: dto.id,
    name: dto.name,
    displayName: displayName,
    imgUrl: dto.spriteUrl,
    imgAlt: `${displayName} image`,
    types: types,
    background: GetTypeBackgroundColor(types),
  };
}

@Component({
  imports: [RouterLink],
  selector: 'app-pokelist',
  styleUrl: './pokelist.scss',
  templateUrl: './pokelist.html',
})
export class Pokelist {
  protected readonly pokemonService = inject(PokemonService);

  protected readonly pokeList = toSignal(
    this.pokemonService.list().pipe(map((pokemon) => pokemon.map(toCardViewModel))),
    { initialValue: [] as PkmCardViewModel[] },
  );
}
