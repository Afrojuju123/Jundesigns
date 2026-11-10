export interface WorkshopGalleryItem {
  id: string;
  title: string;
  description: string;
  src: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "2/1" | "square" | "landscape" | "portrait";
}

export interface Workshop {
  name: string;
  slug: string;
  subtitle: string;
  intro: string;
  cardLine: string;
  about: string;
  aboutHeading?: string;
  callout: string;
  included: string;
  whatToBring: string;
  priceRwf: number;
  duration: string;
  availability: string;
  timeSlots: string;
  locationText: string;
  photoCrop?: "tall" | "square" | "4/3";
  heroImages: {
    large: string;
    small1: string;
    small2: string;
  };
  aboutPhotos: {
    photo1: string;
    photo2: string;
  };
  detailsPhoto: string;
  gallery: WorkshopGalleryItem[];
}

export const workshops: Workshop[] = [
  {
    name: "Imigongo Painting",
    slug: "imigongo-painting",
    subtitle: "Rwandan Unique Designs",
    intro:
      "Paint your own Imigongo board in the bold geometric style Rwanda is known for, with the hills of Kigali in front of you. Our guide shows you each step, from the first line to the final colour.",
    cardLine: "Learn the sacred 18th-century geometric art form.",
    about:
      "Imigongo is built from sharp, repeating shapes: diamonds, zigzags and spirals. In two hours you will learn how the patterns are planned, how to keep your lines clean, and how to choose colours that work together. You leave with a board you painted yourself.",
    callout: "No painting experience needed. Your guide helps you at every step.",
    included:
      "All painting materials, your own board to take home, and a guide throughout. A short introduction to the history of Imigongo.",
    whatToBring:
      "Bring a bottle of water or snacks if you think you will need them. Mornings and evenings can be cool, so bring warm clothes.",
    priceRwf: 30000,
    duration: "Two hours",
    availability: "Every day",
    timeSlots: "Morning 10:00am, Afternoon 4:00pm",
    locationText:
      "Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro, near CANAL Olympia. Street KK 557 St, Kigali.",
    heroImages: {
      large: "/images/imigongo-easel-kigali.jpg",
      small1: "/images/imigongo/imigongo-easel-round.jpg",
      small2: "/images/imigongo-detail-painting.jpg",
    },
    aboutPhotos: {
      photo1: "/images/imigongo/imigongo-table-man.jpg",
      photo2: "/images/imigongo/imigongo-table-concentric.jpg",
    },
    detailsPhoto: "/images/imigongo/imigongo-easel-diamond.jpg",
    gallery: [
      {
        id: "imi-1",
        title: "Painting at the Easel Overlooking Kigali",
        description: "Outdoor session with panoramic valley views from Rebero hill.",
        src: "/images/imigongo-easel-kigali.jpg",
        aspectRatio: "16/9",
      },
      {
        id: "imi-2",
        title: "Circular Diamond Geometry",
        description: "Applying natural mineral red ochre and white kaolin pigments.",
        src: "/images/imigongo/imigongo-easel-round.jpg",
        aspectRatio: "3/4",
      },
      {
        id: "imi-3",
        title: "Table Workshop with Cotton Apron",
        description: "Guest working carefully along cured geometric relief ridges.",
        src: "/images/imigongo/imigongo-table-man.jpg",
        aspectRatio: "3/4",
      },
      {
        id: "imi-4",
        title: "Hand-Painting Curved Traditional Shapes",
        description: "Mixing soot black and natural pigments onto the board surface.",
        src: "/images/imigongo/imigongo-table-concentric.jpg",
        aspectRatio: "3/4",
      },
      {
        id: "imi-5",
        title: "Finished Zigzag Relief Board",
        description: "Proud guest presenting completed black, white, and red Imigongo piece.",
        src: "/images/imigongo/imigongo-holding-zigzag.jpg",
        aspectRatio: "3/4",
      },
      {
        id: "imi-6",
        title: "Diamond Spiral Composition",
        description: "Studio guest painting geometric angles in the morning light at Rebero.",
        src: "/images/imigongo/imigongo-easel-diamond.jpg",
        aspectRatio: "3/4",
      },
    ],
  },
  {
    name: "Traditional Rwandan Dance",
    slug: "traditional-dance",
    subtitle: "Movement and Story",
    intro:
      "Learn traditional Rwandan dance with local dancers. You will practise the movements, hear the history behind them, and dance together as a group.",
    cardLine: "Experience energetic movements and royal history.",
    about:
      "Rwandan dance is energetic and full of meaning. Your guide breaks each movement into simple steps, explains where it comes from, and teaches you at a pace anyone can follow. By the end you will be dancing with the group.",
    aboutHeading: "Rwandan Dance, A *Living Tradition*",
    callout: "No experience needed. Wear comfortable clothes you can move in.",
    included:
      "Instruction from local dancers, a short introduction to the history of the dance, and any costume pieces needed for the session.",
    whatToBring:
      "Comfortable clothes and shoes you can move in. Bring a bottle of water, and warm clothes for the weather.",
    priceRwf: 30000,
    duration: "Two hours",
    availability: "Every day",
    timeSlots: "Morning 10:00am, Afternoon 4:00pm",
    locationText:
      "Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro, near CANAL Olympia. Street KK 557 St, Kigali.",
    photoCrop: "4/3",
    heroImages: {
      large: "/images/dance/dance-intore-headdress.jpg",
      small1: "/images/dance/dance-guest-yellow-dancer.jpg",
      small2: "/images/dance/dance-group-circle.jpg",
    },
    aboutPhotos: {
      photo1: "/images/dance/dance-courtyard-performance.jpg",
      photo2: "/images/dance/dance-guest-yellow-dancer.jpg",
    },
    detailsPhoto: "/images/dance/dance-group-circle.jpg",
    gallery: [
      {
        id: "dance-1",
        title: "Traditional Intore Warrior Dance",
        description: "Dancer wearing traditional headdress holding ceremonial spear and shield with high energy.",
        src: "/images/dance/dance-intore-headdress.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "dance-2",
        title: "Learning the Arm Movements",
        description: "Guest learning expressive Rwandan dance postures alongside a resident dancer.",
        src: "/images/dance/dance-guest-yellow-dancer.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "dance-3",
        title: "Dancing Together as a Group",
        description: "Guests and dancers connecting hands in a vibrant group circle on the veranda.",
        src: "/images/dance/dance-group-circle.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "dance-4",
        title: "Courtyard Dance Performance",
        description: "Full group performance on the Rebero terrace with visitors and dancers celebrating together.",
        src: "/images/dance/dance-courtyard-performance.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "dance-5",
        title: "Outdoor Traditional Dance Instruction",
        description: "Instructor guiding guests through foundational posture and arm cadence.",
        src: "/images/traditional-dance-outdoor.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "dance-6",
        title: "Pavilion Group Dance Gathering",
        description: "Practising traditional rhythm and footwork steps in the thatched pavilion on Rebero hill.",
        src: "/images/schools/schools-dance-pavilion.jpg",
        aspectRatio: "4/3",
      },
    ],
  },
  {
    name: "Carpet Hand-Weaving",
    slug: "hand-weaving",
    subtitle: "Ancient Rwandan Craft",
    intro:
      "Weave your own small carpet from sisal using the traditional hand technique. Your guide teaches you the method and stays with you until your piece is finished.",
    cardLine: "Master the ancient craft of sisal weaving.",
    about:
      "Sisal is a strong natural fibre that Rwandan artisans have long used for weaving. Jun Designs provides all the sisal and tools you need. You will learn how to set up the weave, keep the tension even, and build a pattern row by row.",
    callout:
      "Patience matters more than skill here. Most guests finish a small piece in the two hours.",
    included:
      "All the materials needed for the weaving session and a guide. A short introduction to Rwandan history and culture.",
    whatToBring:
      "Bring a bottle of water or snacks if you think you will need them. Mornings and evenings can be cool, so bring warm clothes.",
    priceRwf: 30000,
    duration: "Two hours",
    availability: "Every day",
    timeSlots: "Morning 10:00am, Afternoon 4:00pm",
    locationText:
      "Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro, near CANAL Olympia. Street KK 557 St, Kigali.",
    heroImages: {
      large: "/images/weaving/weaving-veranda-woman.jpg",
      small1: "/images/weaving/weaving-hands-loom.jpg",
      small2: "/images/weaving/weaving-closeup-rows.jpg",
    },
    aboutPhotos: {
      photo1: "/images/weaving/weaving-veranda-man.jpg",
      photo2: "/images/weaving/weaving-closeup-rows.jpg",
    },
    detailsPhoto: "/images/weaving/weaving-hands-loom.jpg",
    gallery: [
      {
        id: "weave-1",
        title: "Weaving on the Covered Veranda",
        description: "Guest working at the table with views over the Kigali hills.",
        src: "/images/weaving/weaving-veranda-woman.jpg",
        aspectRatio: "16/9",
      },
      {
        id: "weave-2",
        title: "Hands Weaving on a Small Loom",
        description: "Setting warp tension and threading natural sisal fiber.",
        src: "/images/weaving/weaving-hands-loom.jpg",
        aspectRatio: "3/4",
      },
      {
        id: "weave-3",
        title: "Close-Up of Finished Rows",
        description: "Fine hand-coiled sisal rows showing consistent tension and texture.",
        src: "/images/weaving/weaving-closeup-rows.jpg",
        aspectRatio: "3/4",
      },
      {
        id: "weave-4",
        title: "Weaving on a Frame Loom",
        description: "Guest focusing on row alignment under master artisan guidance.",
        src: "/images/weaving/weaving-veranda-man.jpg",
        aspectRatio: "3/4",
      },
      {
        id: "weave-5",
        title: "Building Patterns Row by Row",
        description: "Detail of the wooden frame loom and hand-woven sisal carpet.",
        src: "/images/weaving/weaving-man-focus.jpg",
        aspectRatio: "3/4",
      },
      {
        id: "weave-6",
        title: "Natural Sisal Fiber Spooling",
        description: "Fine agave fibers hand-separated and prepared for the table frame loom.",
        src: "/images/weaving/weaving-closeup-rows.jpg",
        aspectRatio: "3/4",
      },
    ],
  },
  {
    name: "Igisoro Game",
    slug: "igisoro-game",
    subtitle: "Traditional Rwandan Game",
    intro:
      "Learn igisoro, a two-player strategy game played with seeds on a carved wooden board. Your guide teaches the rules, then you play.",
    cardLine: "Challenge your mind with this historic tactical board game.",
    about:
      "Playing igisoro requires deep strategic thinking, mathematics, and mental agility. It is a fantastic way to connect with the culture and challenge your mind.",
    aboutHeading: "A Historic Game, A *Living Tradition*",
    callout:
      "We provide a short introduction of Rwanda history and guide you while playing the game with all the necessary things needed. Just bring your strategic mind and sense of adventure.",
    included:
      "A short introduction to Rwandan history, plus a guide who teaches the rules and plays alongside you. The board and seeds are provided.",
    whatToBring:
      "Bring a bottle of water or snacks if you think you will need them. Mornings and evenings can be cool, so bring warm clothes.",
    priceRwf: 25000,
    duration: "Two hours",
    availability: "Every day",
    timeSlots: "Morning 10:00am, Afternoon 4:00pm",
    locationText:
      "Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro, near CANAL Olympia. Street KK 557 St, Kigali.",
    photoCrop: "4/3",
    heroImages: {
      large: "/images/igisoro/igisoro-board-perspective.jpg",
      small1: "/images/igisoro/igisoro-hand-seeds.jpg",
      small2: "/images/igisoro/igisoro-board-book.jpg",
    },
    aboutPhotos: {
      photo1: "/images/igisoro/igisoro-board-book.jpg",
      photo2: "/images/igisoro/igisoro-hand-seeds.jpg",
    },
    detailsPhoto: "/images/igisoro/igisoro-board-perspective.jpg",
    gallery: [
      {
        id: "igi-1",
        title: "Carved Wooden Igisoro Board",
        description: "Solid wooden folding board with carved pits and dark seeds ready for play.",
        src: "/images/igisoro/igisoro-board-perspective.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "igi-2",
        title: "Sowing Seeds in the Pits",
        description: "Hand placing seeds into the carved cups during strategic gameplay.",
        src: "/images/igisoro/igisoro-hand-seeds.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "igi-3",
        title: "Board and Rwandan Cultural History",
        description: "The traditional game board paired with historical texts at the Rebero studio.",
        src: "/images/igisoro/igisoro-board-book.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "igi-4",
        title: "Tactical Seed Distribution",
        description: "Arranging seeds into opening sets across the 32 carved pits.",
        src: "/images/igisoro-board-seeds.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "igi-5",
        title: "Inyambutsi Seed Sowing Motion",
        description: "Close-up of fingers scooping and sowing seeds during rapid relay play.",
        src: "/images/igisoro/igisoro-hand-seeds.jpg",
        aspectRatio: "4/3",
      },
      {
        id: "igi-6",
        title: "Studio Strategic Match Play",
        description: "Two-player tactical match guided step-by-step by local players on Rebero hill.",
        src: "/images/igisoro/igisoro-board-perspective.jpg",
        aspectRatio: "4/3",
      },
    ],
  },
];
