import { Component, inject } from '@angular/core';
import { FavService } from './favlist.service';
import { RouterLink } from '@angular/router';
import { displayTitleCase } from '../pokemon.utility';

@Component({
  imports: [RouterLink],
  selector: 'app-favlist',
  templateUrl: './favlist.html',
})
export class Favlist {
  private readonly FavService = inject(FavService);

  protected readonly favorites = this.FavService.favorites;

  protected readonly displayTitleCase = displayTitleCase;

  protected readonly favlistActivated = this.FavService.favlistActivated;
}
