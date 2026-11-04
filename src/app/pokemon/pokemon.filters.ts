export interface PokemonFilterOption {
  readonly value: string;
  readonly label: string;
}

export const generations: readonly PokemonFilterOption[] = [
  { value: 'generation-i', label: 'Generation I' },
  { value: 'generation-ii', label: 'Generation II' },
  { value: 'generation-iii', label: 'Generation III' },
  { value: 'generation-iv', label: 'Generation IV' },
  { value: 'generation-v', label: 'Generation V' },
  { value: 'generation-vi', label: 'Generation VI' },
  { value: 'generation-vii', label: 'Generation VII' },
  { value: 'generation-viii', label: 'Generation VIII' },
  { value: 'generation-ix', label: 'Generation IX' },
];

export const regionalPokedexes: readonly PokemonFilterOption[] = [
  { value: 'kanto', label: 'Kanto' },
  { value: 'original-johto', label: 'Johto' },
  { value: 'hoenn', label: 'Hoenn' },
  { value: 'original-sinnoh', label: 'Sinnoh' },
  { value: 'original-unova', label: 'Unova' },
  { value: 'kalos-central', label: 'Kalos Central' },
  { value: 'original-alola', label: 'Alola' },
  { value: 'galar', label: 'Galar' },
  { value: 'hisui', label: 'Hisui' },
  { value: 'paldea', label: 'Paldea' },
];
