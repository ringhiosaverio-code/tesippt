# Galtieri Immersive Thesis Experience

Presentazione web interattiva 16:9 per la discussione della tesi magistrale **“Dal mangime al valore sostenibile: valutazione ambientale, reporting ESG e Business Model Canvas nel caso Specialmangimi Galtieri S.p.A.”**.

## Avvio

```bash
npm install
npm run dev
```

Build di produzione:

```bash
npm run build
npm run preview
```

## Comandi presentazione

- `→`, `Space`, `PageDown`: slide successiva
- `←`, `PageUp`: slide precedente
- `F`: fullscreen
- `H`: nasconde/mostra interfaccia
- `N`: note del relatore
- `M`: indice / mini-map
- `Esc`: chiude gli overlay
- Touch: swipe orizzontale

## Dati utilizzati

Il progetto è stato riallineato alla versione **“TESI AGGIORNATA con bibliografia.docx”** presente nella Library, perché alcuni numeri del prompt iniziale risultavano superati.

Valori principali usati nell'interfaccia:

- produzione 2025: **89.450 t**;
- consumo elettrico: **1.750.000 kWh**;
- intensità elettrica: **19,56 kWh/t**;
- intensità energetica complessiva: **45,3 kWh/t**;
- GPL: **174.910 kg**;
- fotovoltaico installato: **≈460 kWp**;
- quota FV del **40%**: parametro di scenario, non autoconsumo effettivo misurato;
- componente climatica scenario principale: **10,26 kg CO₂/t**;
- Scope 1: **5,84 kg CO₂/t**; Scope 2 modellato: **4,42 kg CO₂/t**;
- Monte Carlo: mediana **10,47**, media **10,49**, P2,5 **9,72**, P97,5 **11,32 kg CO₂/t**, deviazione standard **0,42**, **200.000** estrazioni;
- costo aggregato 2025: **638,14 €/t**;
- materie prime, sussidiarie e di consumo: **463,91 €/t**, **72,7%**;
- sistema indicatori: **49** totali — A **32**, B **10**, C **7**.

Le classi A/B/C sono rappresentate come **disponibilità informativa**, non come rating o performance ESG.

## Asset reali

La hero usa una fotografia reale dello stabilimento pubblicata da *la Repubblica Bari* e il marchio viene mostrato tramite un ritaglio visuale da una confezione Galtieri reale. Per una versione finale da distribuire pubblicamente, è preferibile sostituire gli asset remoti con fotografie e logo ufficiali forniti direttamente dall'azienda, salvandoli in `public/` e aggiornando le costanti `FACTORY_IMAGE` e `BAG_IMAGE` in `src/App.tsx`.

Fonti web di riferimento consultate durante la costruzione:

- sito ufficiale: https://galtieri.it/
- pagina aziendale: https://galtieri.it/azienda/
- fotografia stabilimento: https://bari.repubblica.it/cronaca/2023/09/02/news/i_50_anni_di_galtieri_la_storica_azienda_dei_mangimi_vola_a_70_mln_di_fatturato_la_qualita_del_cibo_parte_da_qui-413083388/

## Principi scientifici implementati

- perimetro ambientale visualizzato come gate-to-gate e limitato ai vettori energetici della trasformazione;
- separazione tra dato osservato, grandezza derivata, scenario e proposta;
- nessun uso del 40% FV come misura diretta dell'autoconsumo;
- nessuna definizione dell'indicatore energetico come carbon footprint completa del mangime;
- nessun uso dei 49 KPI come rating ESG;
- costi ed emissioni affiancati perché normalizzati sulla tonnellata, ma non sommati e non trattati come perimetri equivalenti;
- roadmap e ottimizzazione presentate come sviluppi futuri.
