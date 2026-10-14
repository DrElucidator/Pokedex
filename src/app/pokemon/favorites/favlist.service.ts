import { Injectable, signal } from '@angular/core';
import { PokeFavorite } from './favlist.model';

@Injectable({ providedIn: 'root' })
export class FavService {
  private readonly favState = signal<PokeFavorite[]>(this.load());

  readonly favorites = this.favState.asReadonly();

  readonly favlistActivated = signal(false);

  toggleFavlistActivated(): void {
    this.favlistActivated.update((visible) => !visible);
  }

  favorited(id: number): boolean {
    return this.favState().some((favorite) => favorite.id === id);
  }

  switchFav(pokemon: PokeFavorite): void {
    if (this.favorited(pokemon.id)) {
      this.remove(pokemon.id);
      return;
    }

    this.favState.update((favorites) => [...favorites, pokemon]);
    this.save();
  }

  private remove(id: number): void {
    this.favState.update((favorites) => favorites.filter((f) => f.id !== id));
    this.save();
  }

  private load(): PokeFavorite[] {
    return JSON.parse(localStorage.getItem('pokedex:favorites') ?? '[]') as PokeFavorite[];
  }

  private save(): void {
    const jsonString = JSON.stringify(this.favState());

    localStorage.setItem('pokedex:favorites', jsonString);
  }
}
