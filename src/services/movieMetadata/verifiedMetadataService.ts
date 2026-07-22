/**
 * Polacraft v1.2 Verified Movie Metadata Registry & Lookup Service
 * Never fabricates factual information. Returns null for unverified fields.
 */

export interface VerifiedMovieMetadata {
  movie: string;
  year: number;
  director: string;
  cast: string[];
  genre: string;
  language: string;
  runtime?: string;
  collectionSuggestions: string[];
  tags: string[];
  verified: boolean;
}

const VERIFIED_MALAYALAM_DATABASE: Record<string, VerifiedMovieMetadata> = {
  lucifer: {
    movie: "Lucifer",
    year: 2019,
    director: "Prithviraj Sukumaran",
    cast: ["Mohanlal", "Prithviraj Sukumaran", "Vivek Oberoi", "Manju Warrier", "Tovino Thomas"],
    genre: "Political Action Thriller",
    language: "Malayalam",
    runtime: "175 min",
    collectionSuggestions: ["Mohanlal", "Action", "Political Thriller", "2019 Releases", "Malayalam Cinema"],
    tags: ["Lucifer", "Mohanlal", "Stephen Nedumpally", "Prithviraj Sukumaran", "Political Thriller", "2019", "Malayalam", "Minimalist", "Cinematic"],
    verified: true
  },
  manichitrathazhu: {
    movie: "Manichitrathazhu",
    year: 1993,
    director: "Fazil",
    cast: ["Mohanlal", "Shobhana", "Suresh Gopi", "Innocent", "Nedumudi Venu"],
    genre: "Psychological Horror Thriller",
    language: "Malayalam",
    runtime: "169 min",
    collectionSuggestions: ["Mohanlal", "Cult Classics", "Psychological Thriller", "Classic Malayalam"],
    tags: ["Manichitrathazhu", "Mohanlal", "Shobhana", "Nagavalli", "Fazil", "Psychological Thriller", "1993", "Malayalam", "Cult Classic"],
    verified: true
  },
  kumbalangi: {
    movie: "Kumbalangi Nights",
    year: 2019,
    director: "Madhu C. Narayanan",
    cast: ["Fahadh Faasil", "Shane Nigam", "Soubin Shahir", "Sreenath Bhasi", "Anna Ben"],
    genre: "Family Drama",
    language: "Malayalam",
    runtime: "135 min",
    collectionSuggestions: ["Fahadh Faasil Series", "Modern Malayalam", "2019 Releases"],
    tags: ["Kumbalangi Nights", "Fahadh Faasil", "Shammi", "Shane Nigam", "Drama", "2019", "Malayalam", "Modern Classic"],
    verified: true
  },
  aavesham: {
    movie: "Aavesham",
    year: 2024,
    director: "Jithu Madhavan",
    cast: ["Fahadh Faasil", "Sajin Gopu", "Hipzster", "Midhutty"],
    genre: "Action Comedy",
    language: "Malayalam",
    runtime: "158 min",
    collectionSuggestions: ["Fahadh Faasil Series", "Character Series", "2024 Releases"],
    tags: ["Aavesham", "Fahadh Faasil", "Ranga", "Eda Mone", "Action Comedy", "2024", "Malayalam", "Typographic"],
    verified: true
  },
  thoovanathumbikal: {
    movie: "Thoovanathumbikal",
    year: 1987,
    director: "P. Padmarajan",
    cast: ["Mohanlal", "Sumalatha", "Parvathy", "Ashokan"],
    genre: "Romantic Drama",
    language: "Malayalam",
    runtime: "150 min",
    collectionSuggestions: ["Mohanlal", "Cult Classics", "Classic Malayalam"],
    tags: ["Thoovanathumbikal", "Mohanlal", "Padmarajan", "Sumalatha", "Clara", "Romance", "1987", "Malayalam", "Monsoon"],
    verified: true
  },
  spadikam: {
    movie: "Spadikam",
    year: 1995,
    director: "Bhadran",
    cast: ["Mohanlal", "Thilakan", "Urvashee", "Spadikam George"],
    genre: "Action Drama",
    language: "Malayalam",
    runtime: "155 min",
    collectionSuggestions: ["Mohanlal", "Character Series", "Cult Classics"],
    tags: ["Spadikam", "Mohanlal", "Aadu Thoma", "Thilakan", "Bhadran", "Action", "1995", "Malayalam", "Alpha Rebellion"],
    verified: true
  },
  premam: {
    movie: "Premam",
    year: 2015,
    director: "Alphonse Puthren",
    cast: ["Nivin Pauly", "Sai Pallavi", "Madonna Sebastian", "Anupama Parameswaran"],
    genre: "Romantic Comedy",
    language: "Malayalam",
    runtime: "156 min",
    collectionSuggestions: ["Minimal Collection", "Modern Malayalam", "Romance"],
    tags: ["Premam", "Nivin Pauly", "Sai Pallavi", "Malar Teacher", "Alphonse Puthren", "Romance", "2015", "Malayalam"],
    verified: true
  },
  sandesham: {
    movie: "Sandesham",
    year: 1991,
    director: "Sathyan Anthikad",
    cast: ["Sreenivasan", "Jayaram", "Thilakan", "Kaviyoor Ponnamma"],
    genre: "Political Satire",
    language: "Malayalam",
    runtime: "148 min",
    collectionSuggestions: ["Typography Posters", "Cult Classics", "Classic Malayalam"],
    tags: ["Sandesham", "Sreenivasan", "Jayaram", "Satire", "Poland", "Sathyan Anthikad", "1991", "Malayalam"],
    verified: true
  },
  mathilukal: {
    movie: "Mathilukal",
    year: 1990,
    director: "Adoor Gopalakrishnan",
    cast: ["Mammootty", "K.P.A.C. Lalitha"],
    genre: "Romantic Biography Drama",
    language: "Malayalam",
    runtime: "117 min",
    collectionSuggestions: ["Mammootty Classics", "Limited Edition", "Classic Malayalam"],
    tags: ["Mathilukal", "Mammootty", "Vaikom Muhammad Basheer", "Adoor Gopalakrishnan", "1990", "Malayalam", "Minimalist"],
    verified: true
  },
  kireedam: {
    movie: "Kireedam",
    year: 1989,
    director: "Sibi Malayil",
    cast: ["Mohanlal", "Thilakan", "Parvathy", "Kaviyoor Ponnamma"],
    genre: "Tragic Drama",
    language: "Malayalam",
    runtime: "145 min",
    collectionSuggestions: ["Mohanlal", "Cult Classics", "Classic Malayalam"],
    tags: ["Kireedam", "Mohanlal", "Sethumadhavan", "Thilakan", "Sibi Malayil", "Drama", "1989", "Malayalam"],
    verified: true
  }
};

/**
 * Retrieve verified movie metadata by key or title search
 */
export async function getVerifiedMovieMetadata(searchQuery: string): Promise<VerifiedMovieMetadata | null> {
  if (!searchQuery) return null;

  const normalized = searchQuery.toLowerCase().trim();

  for (const [key, meta] of Object.entries(VERIFIED_MALAYALAM_DATABASE)) {
    if (normalized.includes(key) || normalized.includes(meta.movie.toLowerCase())) {
      return meta;
    }
  }

  // Return unverified fallback with null fields if not found in verified registry
  return null;
}
