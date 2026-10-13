export interface UrlObjResult {
  name: string;
  url: string;
}

export interface UrlObjRequest {
  count: number;
  next: string | null;
  preview: string | null;
  results: UrlObjResult[];
}

export interface UrlPokeType {
  type: {
    name: string;
  };
}

export interface UrlPokemon {
  readonly id: number;
  readonly name: string;
  readonly types: readonly UrlPokeType[];
  readonly height: number;
  readonly weight: number;
  readonly abilities: readonly UrlPokeAbility[];
  readonly stats: readonly UrlPokeStat[];
  readonly cries?: UrlPokeCry;
  readonly sprites: {
    readonly front_default: string | null;
    readonly other?: {
      readonly 'official-artwork'?: {
        readonly front_default: string | null;
      }
    }
  };
}

export interface UrlPokeCry {
  readonly latest: string | null;
  readonly legacy: string | null;
}

export interface UrlPokeAbility {
  readonly ability: {
    readonly name: string;
  }
}

export interface UrlPokeStat {
  readonly base_stat: number;
  readonly stat: {
    readonly name: string;
  }
}