// Countries confirmed by Casa Kruyff for the artist directory and attribution.
const countries: Record<string, string> = {
  "Galatiss Art Gallery": "Grecia",
  "Caroline Rovithi": "Grecia",
  "Bord de l’Eau": "Grecia",
  "Carlos Gunther Maier · House Armida": "México",
  "Carlos Gunther Maier para House Armida": "México",
  "Sandra Roldán": "Colombia",
};

export function artistOrigin(name: string): string | undefined {
  return countries[name];
}
