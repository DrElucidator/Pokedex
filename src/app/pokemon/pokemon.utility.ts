import { PkmTypeViewModel } from './pokemon.model';

export const DEFAULT_TYPE_COLOR = '#6C757D';

export const TYPE_COLORS: Readonly<Record<string, string>> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export function toTypesViewModel(types: readonly string[]): readonly PkmTypeViewModel[] {
  return types.map((type) => ({
    name: type,
    displayName: displayTitleCase(type),
    color: GetTypeColor(type.toLowerCase()),
  }));
}

export function GetTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? DEFAULT_TYPE_COLOR;
}

export function displayTitleCase(text: string): string {
  // (/\b\w/g) = regex to find the first letter within a text
  return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export function GetTypeBackgroundColor(types: readonly PkmTypeViewModel[]): string {
    const fstColor = types[0]?.color ?? DEFAULT_TYPE_COLOR;
    const sndColor = types[1]?.color ?? fstColor; 

    return `linear-gradient(var(--bs-card-bg), var(--bs-card-bg)) padding-box, linear-gradient(135deg, ${fstColor} 0 50%, ${sndColor} 50% 100%) border-box`;
}