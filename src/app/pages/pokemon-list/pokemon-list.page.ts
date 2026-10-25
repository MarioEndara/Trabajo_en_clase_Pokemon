import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  pokemonList: any[] = [];
  filteredPokemonList: any[] = [];
  searchTerm: string = '';
  selectedPokemon: any = null;
  loading: boolean = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemonList();
  }

  loadPokemonList() {
    this.loading = true;
    this.pokemonService.getPokemonList(30).subscribe({
      next: (data) => {
        this.pokemonList = data.results;
        this.filteredPokemonList = data.results;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterPokemons() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPokemonList = this.pokemonList;
      this.selectedPokemon = null;
      return;
    }

    this.filteredPokemonList = this.pokemonList.filter(p => p.name.includes(term));
    
    if (this.filteredPokemonList.length === 0) {
      this.searchDirect(term);
    }
  }

  searchDirect(term: string) {
    this.pokemonService.getPokemon(term).subscribe({
      next: (data) => {
        this.selectedPokemon = data;
      },
      error: () => {
        this.selectedPokemon = null;
      }
    });
  }

  selectPokemon(url: string) {
    this.loading = true;
    this.pokemonService.getPokemon(url).subscribe({
      next: (data) => {
        this.selectedPokemon = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  getPokemonId(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }
}