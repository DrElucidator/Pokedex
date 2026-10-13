export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string | null;
}

export interface PokeStats {
  readonly name: string;
  readonly baseValue: number;
}

export interface PkmDetails extends Pokemon {
  readonly imgUrl: string | null;
  readonly audioUrl: string | null;
  readonly height: number;
  readonly weight: number;
  readonly abilities: readonly string[];
  readonly stats: readonly PokeStats[];
}

export interface PkmTypeViewModel {
  readonly name: string;
  readonly displayName: string;
  readonly color: string;
}