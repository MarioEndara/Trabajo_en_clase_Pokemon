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
  
  // Galería de imágenes procesada para el Pokémon seleccionado
  pokemonImages: string[] = [];
  animatedSprite: string = '';

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
        this.processPokemonData(data);
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
        this.processPokemonData(data);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Procesa los datos para extraer la galería de 5+ imágenes y el GIF animado
  processPokemonData(data: any) {
    this.selectedPokemon = data;
    
    const sprites = data.sprites;
    
    // 1. Galería de al menos 5 imágenes estáticas
    this.pokemonImages = [
      sprites.front_default,
      sprites.back_default,
      sprites.front_shiny,
      sprites.back_shiny,
      sprites.other?.['official-artwork']?.front_default || sprites.front_default
    ].filter(Boolean); // Filtra nulos si alguno no viniera

    // 2. Obtener el GIF animado (versión GIF de Showdown o Gen 5)
    this.animatedSprite = 
      sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
      sprites.front_default;
  }

  // Reproducir el sonido oficial del Pokémon
  playSound() {
    if (this.selectedPokemon && this.selectedPokemon.cries) {
      // La PokeAPI provee un audio en formato .ogg (compatible con móviles y navegadores)
      const audioUrl = this.selectedPokemon.cries.latest || this.selectedPokemon.cries.legacy;
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch(err => console.log('Error al reproducir audio:', err));
      }
    }
  }

  getPokemonId(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }
}