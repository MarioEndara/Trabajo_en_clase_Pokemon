import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  // Obtener lista inicial de Pokémon
  getPokemonList(limit: number = 30): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=${limit}`);
  }

  // Obtener detalle por nombre, ID o URL completa
  getPokemon(nameOrId: string): Observable<any> {
    const url = nameOrId.startsWith('http') ? nameOrId : `${this.apiUrl}/${nameOrId.toLowerCase()}`;
    return this.http.get(url);
  }
}