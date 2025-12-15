
# Přednáška: Bayesovský Multi-Object Tracking (btrack)
**Publikum:** Matematici, statistici, datoví vědci  
**Délka:** 10 minut  
**Jazyk:** Čeština  
**Aplikace (Visual Aid):** btrack-viz.app

---

## 0:00 – 1:30 | Úvod: Od detekce k inferenci
*(Pozice v aplikaci: **Hero Scene** - úvodní 3D vizualizace)*

"Dobrý den. Dnes se podíváme na **btrack** – pythonovskou knihovnu pro rekonstrukci trajektorií v komplexních dynamických systémech. Ačkoliv byla vyvinuta primárně pro buněčnou biologii, její matematické jádro je univerzální."

"Představte si, že máte zašuměná data z časosběrné mikroskopie. Vidíte mračno bodů. Úlohou 'trackingu' není jen spojit nejbližší body v čase $t$ a $t+1$. To je naivní, deterministický přístup, který selhává, jakmile dojde k okluzi nebo křížení."

"btrack přistupuje k problému jinak. Nedefinuje tracking jako geometrický problém, ale jako problém **Bayesovské inference**. Ptáme se: *Jaká je nejpravděpodobnější sada trajektorií, která vysvětluje naše pozorování při daných fyzikálních omezeních?*"

---

## 1:30 – 3:30 | Stavový prostor a Kalmanův filtr
*(Scroll na sekci: **Metodika / Kalmanův filtr**. Interakce: Spusťte **TrackingSimulation** přepínáním mezi 'Greedy' a 'Bayesian'.)*

"Základním stavebním kamenem je lokální model pohybu. Zde opouštíme euklidovský prostor souřadnic a vstupujeme do **stavového prostoru**."

"Podívejte se na tuto simulaci:
1.  V režimu **Greedy** algoritmus slepo spojuje nejbližší detekci. Vidíte ten chaos při šumu?
2.  V režimu **Bayesian** vidíte stabilizaci."

"Matematicky je každý objekt popsán stavovým vektorem $\mathbf{x}$, který obsahuje nejen polohu, ale i rychlost, případně akceleraci. Nejistotu tohoto stavu držíme v kovarianční matici $\mathbf{P}$."

"Používáme standardní Kalmanův filtr. Máme dva kroky:
1.  **Predikce (Prior):** $\mathbf{x}_{t|t-1} = \mathbf{F}\mathbf{x}_{t-1}$. Modelujeme fyziku systému. Pokud má částice hybnost, očekáváme ji jinde, než kde byla naposledy.
2.  **Update (Posterior):** Když přijde měření $\mathbf{z}_t$, nebereme ho jako absolutní pravdu. Vypočítáme tzv. *Kalman Gain* $\mathbf{K}$, který váží důvěru mezi naším modelem (procesní šum $\mathbf{Q}$) a senzorem (chyba měření $\mathbf{R}$)."

---

## 3:30 – 5:00 | Statistické hledání: Mahalanobisova metrika
*(Scroll na sekci: **Adaptivní Gating**. Interakce: Přepínejte mezi 'Euclidean' a 'Mahalanobis'.)*

"Když máme predikci, musíme ji spárovat s novou detekcí. Naivní přístup hledá v kruhu – Euklidovská vzdálenost. Ale podívejte se sem."

*(Ukázat na vizualizaci)*

"Euklidovská metrika (kruh) ignoruje korelaci proměnných. Pokud se objekt pohybuje rychle doprava, nejistota polohy není kruhová, ale eliptická ve směru pohybu."

"btrack využívá **Mahalanobisovu vzdálenost**. Ta normalizuje rozdíl mezi predikcí a měřením pomocí inverzní kovarianční matice inovace $\mathbf{S}^{-1}$. Efektivně to znamená, že algoritmus 'hledá' tam, kam statisticky dává smysl, aby se objekt pohnul. To nám umožňuje správně přiřadit i vzdálené detekce (bod D1), pokud odpovídají dynamice pohybu, a zamítnout blízké detekce (bod D2), které jsou fyzikálně nesmyslné."

---

## 5:00 – 7:30 | Globální optimalizace a Graf hypotéz
*(Scroll na sekci: **Hypotézy** a následně **Crossing Visual**.)*

"Zatím jsme mluvili o lokálním sledování – frame-to-frame. To ale nestačí na složité jevy jako dělení buněk nebo dlouhodobé okluze. Zde přichází na řadu **globální optimalizace**."

"btrack nejprve vytvoří tzv. **tracklety** – krátké, vysoce spolehlivé úseky trajektorií. Následně zkonstruuje orientovaný acyklický graf (DAG) všech možných propojení těchto trackletů."

*(Ukažte na Hypothesis Tree)*

"Pro konec každého trackletu generujeme hypotézy:
1.  **Link:** Pokračování v jiném trackletu.
2.  **Apoptóza:** Zánik objektu (s penalizací, pokud to neodpovídá biologii).
3.  **Mitóza:** Větvení grafu (dělení buňky). Zde se kontroluje zákon zachování hmoty/objemu."

*(Scroll na Crossing Visual - ukázka ID Swap)*

"Proč je to nutné? Podívejte se na problém křížení. Greedy algoritmus v bodě průniku selže a prohodí identity, protože objekty jsou u sebe blízko. Globální model ale ví, že zachování hybnosti a kontinuity dává vyšší celkovou věrohodnost (Likelihood) scénáři, kde se trajektorie překříží, než scénáři, kde se odrazí."

---

## 7:30 – 9:00 | ILP Solver: Řešení jako tok v grafu
*(Scroll na sekci: **Optimalizace**.)*

"Jak z toho grafu vybereme tu jednu správnou realitu? Formulujeme to jako problém **Celočíselného lineárního programování (ILP)**."

"Cílovou funkcí je maximalizace log-likelihoodu celého systému:

$$ \mathcal{L} = \sum_{h \in \mathcal{H}} w_h x_h $$

Kde $x_h$ je binární proměnná (vybráno/nevybráno) a $w_h$ je váha hypotézy odvozená z pravděpodobností přechodů."

"Řešíme to jako *Network Flow Problem*. Musí platit zákony zachování toku – počet vstupů do uzlu se musí rovnat počtu výstupů (pokud nejde o zrod nebo zánik). Díky tomu je výsledné řešení matematicky **globálně optimální** v rámci daného časového okna."

---

## 9:00 – 10:00 | Závěr a Výsledky
*(Scroll na sekci: **Benchmark Chart**.)*

"Výsledky mluví jasně. Zatímco prostý Kalmanův filtr (zde uprostřed) zlepšuje přesnost oproti Greedy metodě, teprve přidání globální optimalizace hypotéz (btrack) eliminuje většinu chyb typu 'Identity Switch'."

"Shrnuto: btrack není jen 'spojování teček'. Je to **pravděpodobnostní rámec**, který kombinuje lokální dynamiku (Kalman) s globální strukturou (ILP) a biologickými priory. Díky tomu dokážeme v datech najít signál tam, kde by deterministické metody viděly jen šum."

"Děkuji za pozornost."
