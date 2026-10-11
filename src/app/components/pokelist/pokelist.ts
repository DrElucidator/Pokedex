import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

interface UrlObjResult {
  name: string;
  url: string;
}

interface UrlObjRequest {
  count: number;
  next: string | null;
  preview: string | null;
  results: UrlObjResult[];
}

@Component({
  imports: [],
  selector: 'app-pokelist',
  templateUrl: './pokelist.html',
})

export class Pokelist {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  protected readonly pokeList = toSignal(
    this.http.get<UrlObjRequest>(this.apiUrl), 
    { initialValue: null }
  );
}
