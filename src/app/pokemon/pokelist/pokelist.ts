import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '../data/pokemon.service';
import { PkmTypeViewModel, Pokemon } from '../pokemon.model';
import { finalize, map, of, startWith, switchMap } from 'rxjs';
import { GetTypeBackgroundColor, displayTitleCase, toTypesViewModel } from '../pokemon.utility';
import { RouterLink } from '@angular/router';
import { generations, regionalPokedexes } from '../pokemon.filters';

type PokemonIdsFilter = ReadonlySet<number> | null | undefined;

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

  protected readonly emCarregamento = signal(true);
  protected readonly termoBusca = signal('');
  protected readonly geracaoSelecionada = signal('all');
  protected readonly pokedexRegionalSelecionada = signal('all');

  protected readonly generations = generations;
  protected readonly regionalPokedexes = regionalPokedexes;

  protected readonly pokeList = toSignal(
    this.pokemonService.list().pipe(
      map((pokemon) => pokemon.map(toCardViewModel)),
      finalize(() => this.emCarregamento.set(false)),
    ),
    { initialValue: [] as PkmCardViewModel[] },
  );

  protected readonly idsDaGeracao = toSignal<PokemonIdsFilter>(
    toObservable(this.geracaoSelecionada).pipe(
      switchMap((generation) =>
        generation === 'all'
          ? of<PokemonIdsFilter>(null)
          : this.pokemonService
              .getGenerationIds(generation)
              .pipe(map((ids) => ids as PokemonIdsFilter), startWith(undefined)),
      ),
    ),
    { initialValue: null },
  );

  protected readonly idsDaPokedexRegional = toSignal<PokemonIdsFilter>(
    toObservable(this.pokedexRegionalSelecionada).pipe(
      switchMap((pokedex) =>
        pokedex === 'all'
          ? of<PokemonIdsFilter>(null)
          : this.pokemonService
              .getRegionalPokedexIds(pokedex)
              .pipe(map((ids) => ids as PokemonIdsFilter), startWith(undefined)),
      ),
    ),
    { initialValue: null },
  );

  protected readonly filtrosCarregando = computed(
    () => this.idsDaGeracao() === undefined || this.idsDaPokedexRegional() === undefined,
  );

  protected readonly pokemonFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    const idsDaGeracao = this.idsDaGeracao();
    const idsDaPokedexRegional = this.idsDaPokedexRegional();

    if (idsDaGeracao === undefined || idsDaPokedexRegional === undefined) {
      return [];
    }

    return this.pokeList().filter((pokemon) => {
      const atendeBusca =
        !termo || pokemon.name.includes(termo) || String(pokemon.id).includes(termo);
      const atendeGeracao = !idsDaGeracao || idsDaGeracao.has(pokemon.id);
      const atendePokedexRegional = !idsDaPokedexRegional || idsDaPokedexRegional.has(pokemon.id);

      return atendeBusca && atendeGeracao && atendePokedexRegional;
    });
  });

  protected readonly esqueletos = computed(() =>
    Array.from({
      length: this.filtrosCarregando() ? 12 : Math.max(0, 12 - this.pokemonFiltrados().length),
    }),
  );

  protected atualizarBusca(event: Event): void {
    this.termoBusca.set((event.target as HTMLInputElement).value);
  }

  protected atualizarGeracao(event: Event): void {
    this.geracaoSelecionada.set((event.target as HTMLSelectElement).value);
  }

  protected atualizarPokedexRegional(event: Event): void {
    this.pokedexRegionalSelecionada.set((event.target as HTMLSelectElement).value);
  }
}
