export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string | null;
}

export interface PkmTypeViewModel {
  readonly name: string;
  readonly displayName: string;
  readonly color: string;
}