import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service'; // Asegúrate de que la ruta a services sea correcta

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchTerm: string = '';
  pokemon: any = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private pokemonService: PokemonService) {}

  searchPokemon() {
    if (!this.searchTerm.trim()) return;

    this.loading = true;
    this.errorMessage = '';
    this.pokemon = null;

    this.pokemonService.getPokemon(this.searchTerm).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se encontró el Pokémon. Intenta con otro nombre o ID.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}