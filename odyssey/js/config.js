/**
 * ODYSSEY — Core Configuration
 * Live Theatrical Experience at Regal Theatre Perth
 * Presented by Starlight Anthem
 */

const ODYSSEY_CONFIG = {
  ticketUrl: "https://premier.ticketek.com.au/shows/show.aspx?eg=PRESALE&ep=EARLYBIRD&sh=ODYSSEYP26",
  eventDate: "2027-04-10T19:30:00+08:00",
  venue: "Regal Theatre, Subiaco WA",
  city: "Perth, Western Australia",
  performanceTime: "7:30 PM AWST",
  timing: {
    boxOffice: "5:30 PM (2 hrs prior)",
    doors: "6:30 PM (1 hr prior)",
    act1: "7:30 PM",
    interval: "8:10 PM",
    act2: "8:28 PM",
    approxEnd: "9:03 PM"
  },
  creativeForce: {
    creator: "Donovan Fisher",
    roles: "Created · Written · Composed · Animated · Directed",
    advisor: "Antwone Fisher",
    advisorRole: "Artistic Advisor",
    presenter: "Starlight Anthem"
  }
};

const ODYSSEY_ASSETS = {
  hero: "assets/images/hero.jpg",
  story: "assets/images/story.jpg",
  music: "assets/images/music.jpg",
  theatre: "assets/images/theatre.jpg",
  audience: "assets/images/audience.jpg",
  final: "assets/images/final.jpg"
};

// Export to window for global access
if (typeof window !== "undefined") {
  window.ODYSSEY_CONFIG = ODYSSEY_CONFIG;
  window.ODYSSEY_ASSETS = ODYSSEY_ASSETS;
}
