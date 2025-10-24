// Dog Data System
// This file contains all dog information and handles dynamic loading

const dogData = {
  kokos: {
    name: "Kokos",
    image: "images/dog-1.jpg",
    description: "Kokos to wspaniały pies, który szuka swojego wymarzonego domu. Jest bardzo przyjazny, lubi zabawę i jest doskonałym towarzyszem dla całej rodziny. Ma około 3 lata i jest w pełni zaszczepiony. Kocha spacery i jest bardzo posłuszny. Idealny dla rodzin z dziećmi lub osób, które szukają wiernego przyjaciela.",
    age: "3 lata",
    gender: "Samiec",
    size: "Średni",
    status: "Dostępny",
    specialFeatures: ["Przyjazny wobec dzieci", "Lubi spacery", "Posłuszny", "Zaszczepiony"],
    story: "Kokos został uratowany z trudnych warunków w Turcji. Mimo trudnych początków, jest bardzo ufny i kochający. Uwielbia zabawę z piłką i długie spacery. Jest idealnym kandydatem na pierwszego psa dla rodziny.",
    adoptionRequirements: "Kokos potrzebuje domu z ogrodem lub regularnych spacerów. Idealny dla rodzin z dziećmi powyżej 6 roku życia. Wymaga cierpliwości podczas adaptacji w nowym domu."
  },
  dzeki: {
    name: "Dżeki",
    image: "images/dog-2.jpg",
    description: "Dżeki to energiczny i radosny pies, który uwielbia aktywność fizyczną. Jest bardzo inteligentny i szybko się uczy nowych komend.",
    age: "2 lata",
    gender: "Samiec",
    size: "Duży",
    status: "Dostępny",
    specialFeatures: ["Bardzo energiczny", "Inteligentny", "Lubi bieganie", "Przyjazny wobec ludzi"],
    story: "Dżeki został znaleziony jako szczeniak na ulicach Stambułu. Mimo młodego wieku, już pokazuje się jako bardzo mądry i posłuszny pies. Uwielbia zabawy z innymi psami i jest bardzo towarzyski.",
    adoptionRequirements: "Dżeki potrzebuje aktywnego opiekuna, który zapewni mu dużo ruchu. Idealny dla osób uprawiających sport lub rodzin z dużym ogrodem. Wymaga konsekwentnego szkolenia."
  },
  gaja: {
    name: "Gaja",
    image: "images/dog-3.jpg",
    description: "Gaja to spokojna i delikatna suczka, która szuka cichego i kochającego domu. Jest bardzo wrażliwa i potrzebuje cierpliwego opiekuna.",
    age: "4 lata",
    gender: "Samica",
    size: "Mały",
    status: "Dostępny",
    specialFeatures: ["Spokojna", "Delikatna", "Dobrze wychowana", "Lubi spokój"],
    story: "Gaja została uratowana z bardzo trudnej sytuacji. Potrzebowała dużo czasu, aby nauczyć się ufać ludziom. Teraz jest gotowa na nowy dom i nową miłość. Jest bardzo wdzięczna za każdy gest dobroci.",
    adoptionRequirements: "Gaja potrzebuje spokojnego domu bez małych dzieci. Idealna dla osób starszych lub par bez dzieci. Wymaga cierpliwości i zrozumienia jej przeszłości. Potrzebuje cichego miejsca do odpoczynku."
  }
};

// Function to get dog data by name
function getDogData(dogName) {
  return dogData[dogName] || null;
}

// Function to load dog content into the page
function loadDogContent(dogName) {
  const dog = getDogData(dogName);
  if (!dog) {
    console.error('Dog not found:', dogName);
    return;
  }

  // Update page title
  document.title = `${dog.name} - Z Piekła do Domu`;

  // Update hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.backgroundImage = `url('${dog.image}')`;
  }

  // Update hero title
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.textContent = dog.name;
  }

  // Update main card content
  const cardContent = document.querySelector('.big-card .muted');
  if (cardContent) {
    cardContent.textContent = dog.description;
  }

  // Update dog images array for navigation
  window.dogImages = [dog.image];
  window.currentDogIndex = 0;
}

// Function to get URL parameter
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Initialize dog content when page loads
document.addEventListener('DOMContentLoaded', function() {
  const dogName = getUrlParameter('dog');
  if (dogName) {
    loadDogContent(dogName);
  }
});









