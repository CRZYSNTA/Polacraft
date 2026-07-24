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
  mahaan: {
    movie: "Mahaan",
    year: 2022,
    director: "Karthik Subbaraj",
    cast: ["Vikram", "Dhruv Vikram", "Simran", "Bobby Simha"],
    genre: "Action Drama",
    language: "Tamil",
    runtime: "162 min",
    collectionSuggestions: ["Action Classics", "Tamil Cinema", "Minimalist Posters"],
    tags: ["Mahaan", "Vikram", "Dhruv Vikram", "Karthik Subbaraj", "Action", "2022"],
    verified: true,
  },
  drishyam: {
    movie: "Drishyam",
    year: 2013,
    director: "Jeethu Joseph",
    cast: ["Mohanlal", "Meena", "Ansiba Hassan", "Esther Anil", "Asha Sarath"],
    genre: "Crime Thriller",
    language: "Malayalam",
    runtime: "164 min",
    collectionSuggestions: ["Mohanlal", "Cult Classics", "Crime Thriller", "Classic Malayalam"],
    tags: ["Drishyam", "Mohanlal", "Georgekutty", "Jeethu Joseph", "Thriller", "2013", "Malayalam"],
    verified: true,
  },
  lucifer: {
    movie: "Lucifer",
    year: 2019,
    director: "Prithviraj Sukumaran",
    cast: ["Mohanlal", "Prithviraj Sukumaran", "Vivek Oberoi", "Manju Warrier", "Tovino Thomas"],
    genre: "Political Action Thriller",
    language: "Malayalam",
    runtime: "175 min",
    collectionSuggestions: ["Mohanlal", "Action", "Political Thriller", "2019 Releases"],
    tags: ["Lucifer", "Mohanlal", "Stephen Nedumpally", "Prithviraj Sukumaran", "Political Thriller", "2019"],
    verified: true,
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
    tags: ["Manichitrathazhu", "Mohanlal", "Shobhana", "Nagavalli", "Fazil", "1993"],
    verified: true,
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
    tags: ["Kumbalangi Nights", "Fahadh Faasil", "Shammi", "Shane Nigam", "Drama", "2019"],
    verified: true,
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
    tags: ["Aavesham", "Fahadh Faasil", "Ranga", "Eda Mone", "Action Comedy", "2024"],
    verified: true,
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
    tags: ["Spadikam", "Mohanlal", "Aadu Thoma", "Thilakan", "Bhadran", "Action", "1995"],
    verified: true,
  },
  ravanaprabhu: {
    movie: "Ravanaprabhu",
    year: 2001,
    director: "Ranjith",
    cast: ["Mohanlal", "Vasundhara Das", "Siddique", "Napoleon", "Saikumar"],
    genre: "Action Drama",
    language: "Malayalam",
    runtime: "165 min",
    collectionSuggestions: ["Mohanlal", "Action Classics", "Cult Classics"],
    tags: ["Ravanaprabhu", "Mohanlal", "Mundakkal Shekharan", "Mangalassery Neelakandan", "2001"],
    verified: true,
  },
  devasuram: {
    movie: "Devasuram",
    year: 1993,
    director: "I. V. Sasi",
    cast: ["Mohanlal", "Revathi", "Napoleon", "Innocent"],
    genre: "Dramatic Action",
    language: "Malayalam",
    runtime: "160 min",
    collectionSuggestions: ["Mohanlal", "Cult Classics", "Classic Malayalam"],
    tags: ["Devasuram", "Mohanlal", "Neelakandan", "Revathi", "1993"],
    verified: true,
  },
  chithram: {
    movie: "Chithram",
    year: 1988,
    director: "Priyadarshan",
    cast: ["Mohanlal", "Ranjini", "Nedumudi Venu", "Sreenivasan", "Poornam Vishwanathan"],
    genre: "Romantic Comedy Drama",
    language: "Malayalam",
    runtime: "164 min",
    collectionSuggestions: ["Mohanlal", "Priyadarshan Classics", "Classic Malayalam"],
    tags: ["Chithram", "Mohanlal", "Vishnu", "Priyadarshan", "1988"],
    verified: true,
  },
  vandanam: {
    movie: "Vandanam",
    year: 1989,
    director: "Priyadarshan",
    cast: ["Mohanlal", "Girija Shettar", "Mukesh", "Nedumudi Venu"],
    genre: "Romantic Comedy Action",
    language: "Malayalam",
    runtime: "168 min",
    collectionSuggestions: ["Mohanlal", "Priyadarshan Classics", "Classic Malayalam"],
    tags: ["Vandanam", "Mohanlal", "Unnikrishnan", "Priyadarshan", "1989"],
    verified: true,
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
    tags: ["Kireedam", "Mohanlal", "Sethumadhavan", "Thilakan", "Sibi Malayil", "1989"],
    verified: true,
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
    tags: ["Premam", "Nivin Pauly", "Sai Pallavi", "Malar Teacher", "Alphonse Puthren", "2015"],
    verified: true,
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
    tags: ["Sandesham", "Sreenivasan", "Jayaram", "Satire", "Poland", "1991"],
    verified: true,
  },
  bramayugam: {
    movie: "Bramayugam",
    year: 2024,
    director: "Rahul Sadasivan",
    cast: ["Mammootty", "Arjun Ashokan", "Sidarth Bharathan"],
    genre: "Period Horror Mystery",
    language: "Malayalam",
    runtime: "139 min",
    collectionSuggestions: ["Mammootty Classics", "Horror", "2024 Releases"],
    tags: ["Bramayugam", "Mammootty", "Kodumon Potti", "Horror", "2024"],
    verified: true,
  },
  bheeshma: {
    movie: "Bheeshma Parvam",
    year: 2022,
    director: "Amal Neerad",
    cast: ["Mammootty", "Soubin Shahir", "Sreenath Bhasi", "Shine Tom Chacko"],
    genre: "Action Crime Drama",
    language: "Malayalam",
    runtime: "144 min",
    collectionSuggestions: ["Mammootty Classics", "Action", "Amal Neerad"],
    tags: ["Bheeshma Parvam", "Mammootty", "Michael", "Amal Neerad", "2022"],
    verified: true,
  },
  minnal: {
    movie: "Minnal Murali",
    year: 2021,
    director: "Basil Joseph",
    cast: ["Tovino Thomas", "Guru Soman", "Femina George"],
    genre: "Superhero Action Drama",
    language: "Malayalam",
    runtime: "158 min",
    collectionSuggestions: ["Superhero", "Modern Malayalam", "Tovino Thomas"],
    tags: ["Minnal Murali", "Tovino Thomas", "Basil Joseph", "Shibu", "2021"],
    verified: true,
  },
  bangalore: {
    movie: "Bangalore Days",
    year: 2014,
    director: "Anjali Menon",
    cast: ["Dulquer Salmaan", "Nivin Pauly", "Nazriya Nazim", "Fahadh Faasil"],
    genre: "Romantic Drama",
    language: "Malayalam",
    runtime: "171 min",
    collectionSuggestions: ["Dulquer Salmaan", "Modern Malayalam", "Cult Classics"],
    tags: ["Bangalore Days", "Dulquer Salmaan", "Nivin Pauly", "Nazriya", "2014"],
    verified: true,
  },
  jailer: {
    movie: "Jailer",
    year: 2023,
    director: "Nelson Dilipkumar",
    cast: ["Rajinikanth", "Mohanlal", "Shivarajkumar", "Vinayakan"],
    genre: "Action Thriller",
    language: "Tamil",
    runtime: "168 min",
    collectionSuggestions: ["Action Classics", "Tamil Cinema", "2023 Releases"],
    tags: ["Jailer", "Rajinikanth", "Mohanlal", "Mathew", "Nelson", "2023"],
    verified: true,
  },
  vikram: {
    movie: "Vikram",
    year: 2022,
    director: "Lokesh Kanagaraj",
    cast: ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Suriya"],
    genre: "Action Crime Thriller",
    language: "Tamil",
    runtime: "175 min",
    collectionSuggestions: ["Action Classics", "Tamil Cinema", "LCU"],
    tags: ["Vikram", "Kamal Haasan", "Fahadh Faasil", "Suriya", "Rolex", "2022"],
    verified: true,
  },
  leo: {
    movie: "Leo",
    year: 2023,
    director: "Lokesh Kanagaraj",
    cast: ["Vijay", "Trisha", "Sanjay Dutt", "Arjun Sarja"],
    genre: "Action Thriller",
    language: "Tamil",
    runtime: "164 min",
    collectionSuggestions: ["Action Classics", "Tamil Cinema", "LCU"],
    tags: ["Leo", "Vijay", "Parthi", "Lokesh Kanagaraj", "2023"],
    verified: true,
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
    tags: ["Thoovanathumbikal", "Mohanlal", "Padmarajan", "Sumalatha", "1987"],
    verified: true,
  },
};

/**
 * Retrieve verified movie metadata by key or title search
 */
export async function getVerifiedMovieMetadata(searchQuery: string): Promise<VerifiedMovieMetadata | null> {
  if (!searchQuery || typeof searchQuery !== "string") return null;

  // Clean searchQuery: remove hashtags, emojis, extra noise words (e.g. Alternative, Poster, Fanart, Print, Vector, #...)
  let clean = searchQuery.toLowerCase().trim();
  clean = clean.replace(/#[a-z0-9_]+/gi, "");
  clean = clean.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
  clean = clean.replace(/\b(alternative|poster|fanart|illustration|print|vector|hd|4k|highres|wallpaper|artwork|concept|minimalist|design|style)\b/gi, "");
  clean = clean.replace(/[-_+]/g, " ").trim();

  if (!clean) return null;

  for (const [key, meta] of Object.entries(VERIFIED_MALAYALAM_DATABASE)) {
    if (clean.includes(key) || clean.includes(meta.movie.toLowerCase()) || meta.movie.toLowerCase().includes(clean)) {
      return meta;
    }
  }

  return null;
}
