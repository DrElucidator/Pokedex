# Pokédex

Aplicação web responsiva para explorar Pokémon, consultar detalhes e manter uma lista local de favoritos.

**[Acessar Pokédex](https://drelucidator.github.io/Pokedex/pokemon)**

## Recursos

- Catálogo progressivo dos 151 Pokémon iniciais.
- Cards carregados gradualmente para priorizar a primeira visualização.
- Tela de detalhes com tipos, atributos, habilidades, dimensões e cries.
- Favoritos persistidos no navegador com LocalStorage.
- Interface responsiva com suporte a tema visual.

## Tecnologias

- Angular 22
- TypeScript e RxJS
- Signals
- Bootstrap 5 e Bootstrap Icons
- SCSS
- [PokéAPI](https://pokeapi.co/)
- GitHub Pages

## Executar localmente

```bash
git clone https://github.com/DrElucidator/Pokedex.git
cd Pokedex
npm ci
npm start
```

Abra `http://localhost:4200` no navegador.

## Qualidade

```bash
npm test
npm run build
```
