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
  id: number;
  name: string;
  types: UrlPokeType[];
  sprites: {
    front_default: string | null;
  };
}