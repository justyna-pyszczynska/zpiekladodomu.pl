---
title: "Przykładowy artykuł - Szablon z wszystkimi elementami"
excerpt: "To jest przykładowy artykuł pokazujący wszystkie możliwe elementy, które możesz użyć: nagłówki, pogrubiony tekst, obrazy, Facebook embeds i więcej."
category: "Poradniki"
date: "2024-12-15"
read_time: "5 min czytania"
image: "images/dog-1.jpg"
content: |
  <!-- GŁÓWNY NAGŁÓWEK H2 (McLaren, 1.4rem) -->
  ## Wprowadzenie do artykułu
  
  <!-- ZWYKŁY TEKST Z POGRUBIENIEM -->
  To jest zwykły tekst artykułu. Możesz używać **pogrubionego tekstu** poprzez użycie podwójnych gwiazdek. To jest bardzo przydatne, gdy chcesz **podkreślić ważne informacje**.
  
  <!-- NAGŁÓWEK H3 (Poppins bold, 1.3rem) -->
  ### Mniejszy nagłówek
  
  Kolejny akapit tekstu. Możesz dodawać tyle akapitów, ile chcesz.
  
  <!-- OBRAZ - PEŁNA SZEROKOŚĆ Z ZAOKRĄGLONYMI ROGAMI -->
  <img src="images/dog-2.jpg" alt="Opis zdjęcia" style="width: 100%; border-radius: 1rem; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  
  <!-- ŹRÓDŁO POD ZDJĘCIEM (opcjonalne) -->
  <p style="margin-top: -1.5rem; margin-bottom: 2rem; font-size: 0.75rem; color: #6b7280; text-align: left;">Źródło: <a href="https://example.com" target="_blank" style="color: #6b7280; text-decoration: underline;">Nazwa źródła</a></p>
  
  <!-- OBRAZ - STANDARDOWY, WYCENTROWANY (45% szerokości - preferowany rozmiar) -->
  <img src="images/dog-3.jpg" alt="Opis zdjęcia" style="width: 45%; border-radius: 1rem; margin: 2rem auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <p style="margin-top: -1rem; margin-bottom: 2rem; font-size: 0.75rem; color: #6b7280; text-align: center;">Opis pod zdjęciem</p>
  
  <!-- POJEDYNCZE FACEBOOK VIDEO - PIONOWE (jak w 3-video row) -->
  <div style="display: flex; justify-content: center; margin: 2rem 0;">
    <div style="max-width: 350px;">
      <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F123456789%2F&show_text=false&width=267" width="267" height="476" style="border:none;overflow:hidden;width:100%;border-radius:0.75rem;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>
    </div>
  </div>
  
  <!-- PEŁNA SZEROKOŚĆ ZDJĘCIA (używaj rzadko, tylko dla bardzo ważnych zdjęć) -->
  <img src="images/dog-4.jpg" alt="Duże zdjęcie" style="width: 100%; border-radius: 1rem; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  
  ## Kolejna sekcja
  
  Tekst po zdjęciu pełnej szerokości. Możesz kontynuować swoją historię tutaj.
  
  <!-- LISTA PUNKTOWANA -->
  ### Lista rzeczy do zapamiętania:
  
  - Pierwszy punkt listy
  - Drugi punkt listy z **pogrubieniem**
  - Trzeci punkt listy
  - Czwarty punkt listy
  
  <!-- TRZY FACEBOOK EMBEDY OBOK SIEBIE - PIONOWE (9:16 aspect ratio dla stories/reels) -->
  <!-- UWAGA: Użyj parametrów width=267&height=476 dla pionowych wideo (stories/reels) -->
  ## Sekcja z trzema wideo
  
  Tekst przed trzema wideo. Te embeddy układają się obok siebie na desktop i pionowo na mobile.
  
  <div class="facebook-embeds-row" style="display: flex; gap: 1.5rem; justify-content: center; align-items: center; margin-top: 2rem; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 267px; max-width: 350px;">
      <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F123456789%2F&show_text=false&width=267" width="267" height="476" style="border:none;overflow:hidden;width:100%;border-radius:0.75rem;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>
    </div>
    <div style="flex: 1; min-width: 267px; max-width: 350px;">
      <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F987654321%2F&show_text=false&width=267" width="267" height="476" style="border:none;overflow:hidden;width:100%;border-radius:0.75rem;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>
    </div>
    <div style="flex: 1; min-width: 267px; max-width: 350px;">
      <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F555555555%2F&show_text=false&width=267" width="267" height="476" style="border:none;overflow:hidden;width:100%;border-radius:0.75rem;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>
    </div>
  </div>
  
  <!-- OBRAZ O PEŁNEJ SZEROKOŚCI Z ZAOKRĄGLONYMI ROGAMI -->
  <img src="images/dog-3.jpg" alt="Kolejne zdjęcie" style="width: 100%; border-radius: 1rem; margin-top: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <p style="margin-top: 0.25rem; font-size: 0.75rem; color: #6b7280; text-align: left;">Źródło zdjęcia z linkiem</p>
  
  <!-- FINALNA SEKCJA -->
  ## Podsumowanie
  
  To jest końcowy tekst artykułu. Pamiętaj, że możesz:
  
  - Używać nagłówków ## i ###
  - Dodawać **pogrubiony tekst**
  - Wstawiać obrazy używając znacznika `<img>`
  - Embedować wideo z Facebooka używając `<iframe>`
  - Embedować tweety z Twittera/X
  - Tworzyć listy punktowane
  - Dodawać linki i wiele więcej!
  
  <!-- UWAGI KOŃCOWE -->
  <!-- 
  WAŻNE WSKAZÓWKI:
  
  1. OBRAZY:
     - Pełna szerokość: width: 100%
     - Średnie, wycentrowane: width: 60% (preferowane), margin: 2rem auto, display: block
     - Mniejsze, wycentrowane: width: 50%
     - Tekst obok zdjęcia: użyj div z display: flex, gap: 3rem
  
  2. FACEBOOK VIDEO:
     - TYLKO trzy wideo w rzędzie: width=267&height=476 (format 9:16)
     - Zawsze użyj Facebook plugin URL (nie bezpośredniego linka)
     - Format: https://www.facebook.com/plugins/video.php?height=476&href=ENCODED_URL&show_text=false&width=267
     - Zawsze umieszczaj w div z class="facebook-embeds-row"
  
  3. TWITTER: Użyj pełnego kodu embed z blockquote + script (opcjonalne)
  
  4. LISTY: Rozpocznij każdą linię od "- " (myślnik i spacja)
  
  5. NAGŁÓWKI: Użyj ## dla dużych nagłówków, ### dla mniejszych
  
  6. POGRUBIENIE: Użyj **tekst** (podwójne gwiazdki)
  
  7. AKAPITY: Dodaj pustą linię między akapitami
  
  8. TEKST OBOK ZDJĘĆ:
     - Tekst 60%, zdjęcie 40%: <div style="display: flex; gap: 3rem;..."> z flex: 3 i flex: 2
     - Zawsze używaj gap: 3rem dla spójności
     - Automatycznie układa się pionowo na mobile!
  
  9. ZDJĘCIA - ROZMIARY (zawsze wycentrowane):
     - PREFEROWANE: width: 45% (standardowy rozmiar, wygląda najlepiej)
     - Pełna szerokość: width: 100% (tylko dla bardzo ważnych zdjęć)
     - Małe: width: 35% (rzadko używane)
  
  10. FACEBOOK EMBEDY - TYLKO PIONOWY FORMAT:
     - Pojedyncze wideo: Wycentrowane w div z max-width: 350px
     - Trzy wideo w rzędzie: Każde w div z max-width: 350px
     - ZAWSZE: width=267, height=476 (pionowy format 9:16)
     - Format URL: https://www.facebook.com/plugins/video.php?height=476&href=ENCODED_URL&show_text=false&width=267
  
  11. STYLE: Dodawaj inline style dla precyzyjnej kontroli wyglądu
  -->
---
