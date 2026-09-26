import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, ArrowLeft, ArrowRight, BarChart3, Boxes, ChevronRight, CircleDollarSign,
  Droplets, Factory, FileCheck2, Gauge, HelpCircle, Leaf, Maximize2, Menu, Network,
  PackageCheck, PanelTopOpen, PieChart, Route, ShieldCheck, Sparkles, SunMedium, Users,
  X, Zap
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'

const FACTORY_IMAGE = 'https://www.repstatic.it/content/localirep/img/rep-bari/2023/09/02/190507573-52aa55dd-4523-40f1-8998-6b1f27936fe6.jpg'
const BAG_IMAGE = 'https://www.agriden.it/prodotti/1057/Mangime_3.png'

const GREEN = '#9fb568'
const LIGHT = '#f4f2e8'
const MUTED = 'rgba(244,242,232,.63)'

const sourceLabels = {
  thesis: 'Tesi aggiornata · caso Galtieri · dati 2025',
  method: 'Perimetro: gate-to-gate · componente energetica della trasformazione',
  scenario: 'Scenario: FV 40% non misurato come autoconsumo effettivo',
}

const slides = [
  { id: 'hero', title: 'Dal mangime al valore sostenibile', note: 'Apri con il filo logico della ricerca: non una valutazione totale della sostenibilità, ma un sistema che collega dati, misurazione, reporting e decisioni.' },
  { id: 'problem', title: 'Non basta dire sostenibile', note: 'Introduci la domanda narrativa: come trasformare energia, costi, persone, fornitori e tracciabilità in dati utilizzabili?' },
  { id: 'esg', title: 'Cosa significa ESG', note: 'Spiega ESG in termini semplici. Sottolinea che ESG non è sinonimo automatico di sostenibilità.' },
  { id: 'proof', title: 'Dichiarare ≠ dimostrare', note: 'Usa questa scena per introdurre il tema della verificabilità documentale e la distinzione tra dichiarazioni, evidenze e dati.' },
  { id: 'process', title: 'Entriamo nel mangimificio', note: 'Mostra la sequenza produttiva e delimita subito il perimetro quantitativo gate-to-gate.' },
  { id: 'energy', title: 'Energia', note: 'Presenta dati primari e grandezze derivate. La potenza FV è comunicata dall’impresa; la quota 40% è un parametro di scenario.' },
  { id: 'pv', title: 'Fotovoltaico — scenario', note: 'Muovi lo slider. Ricorda che il 40% non è una misura diretta dell’autoconsumo. Nel modello probabilistico la quota varia 26–50%, con moda 40%.' },
  { id: 'emissions', title: 'Emissioni energetiche', note: 'Il valore 10,26 kg CO₂/t riguarda i vettori energetici della trasformazione e non la carbon footprint completa del mangime.' },
  { id: 'two-lenses', title: 'Una tonnellata — due lenti', note: 'Sottolinea la stessa unità di normalizzazione ma i perimetri differenti: economico più ampio, ambientale limitato ai consumi energetici della trasformazione.' },
  { id: 'costs', title: 'Struttura dei costi', note: 'Materie prime e merci: 463,91 €/t, 72,7% del costo aggregato. Il dato non dimostra automaticamente possibilità di riduzione senza effetti su formulazione o qualità.' },
  { id: 'circularity', title: 'Materie prime e circolarità', note: 'Il conteggio delle tipologie non equivale a quota ponderale. La tesi propone infatti un futuro indicatore percentuale in peso.' },
  { id: 'kpi', title: '49 indicatori', note: 'La classificazione A/B/C misura disponibilità informativa, non performance o maturità ESG.' },
  { id: 'decisions', title: 'Dai dati alle decisioni', note: 'Fai vedere che il contributo operativo è ordinare il dato e renderlo utile alla gestione, senza attribuire riduzioni non dimostrate.' },
  { id: 'bmc', title: 'Business Model Canvas', note: 'Clicca sui nodi. Distingui sempre evidenza documentale, dichiarazione, interpretazione e proposta.' },
  { id: 'value', title: 'Dal modello ESG al valore aziendale', note: 'Il valore nasce quando il dato viene trasformato in informazione leggibile e collegato ai processi decisionali.' },
  { id: 'daily', title: 'A cosa serve domani mattina?', note: 'Presenta questi come utilizzi potenziali del sistema, non come software aziendale già implementato.' },
  { id: 'optimization', title: 'Dal monitoraggio all’ottimizzazione', note: 'Spiega che la tesi non determina direttamente il prezzo del mangime: servono contabilità analitica per prodotto e dati di formulazione.' },
  { id: 'roadmap', title: 'Roadmap', note: 'La roadmap è proposta di sviluppo. Non presentare gli step come attività già completate.' },
  { id: 'result', title: 'Cosa ha prodotto questa tesi?', note: 'Ricapitola i risultati mantenendo la portata dello studio: quadro di evidenze, analisi, indicatori, BMC e roadmap.' },
  { id: 'finale', title: 'Grazie', note: 'Chiudi tornando allo stabilimento. Frase finale: misurare per comprendere, comprendere per decidere.' },
]

type SlideProps = { active: boolean }

type DataCardProps = {
  icon?: React.ReactNode
  label: string
  value: string
  detail?: string
  foot?: string
  className?: string
}

function DataCard({ icon, label, value, detail, foot, className = '' }: DataCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.012 }} className={`glass rounded-3xl p-5 md:p-6 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="kicker">{label}</span>
        <span className="opacity-70">{icon}</span>
      </div>
      <div className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-.045em]">{value}</div>
      {detail && <p className="mt-3 text-sm md:text-base text-white/65 leading-relaxed">{detail}</p>}
      {foot && <div className="mt-5 pt-4 border-t border-white/10 text-xs text-white/45">{foot}</div>}
    </motion.div>
  )
}

function LogoCrop() {
  return <div className="logo-crop" aria-label="Marchio Galtieri tratto da confezione fotografata"><img src={BAG_IMAGE} alt="Logo Galtieri su confezione reale" /></div>
}

function Shell({ children, tone = 'dark' }: { children: React.ReactNode, tone?: 'dark' | 'light' }) {
  return (
    <div className={`slide-shell ${tone === 'light' ? 'bg-[#eef0e7] text-[#102016]' : 'bg-[#07140f] text-[#f4f2e8]'}`}>
      <div className="absolute inset-0 grid-noise opacity-70 pointer-events-none" />
      <div className="relative z-10 w-full max-w-[1480px] mx-auto">{children}</div>
    </div>
  )
}

function TitleBlock({ kicker, title, text }: { kicker: string, title: React.ReactNode, text?: React.ReactNode }) {
  return (
    <div className="max-w-4xl">
      <div className="kicker">{kicker}</div>
      <h2 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-[-.05em] leading-[.95]">{title}</h2>
      {text && <div className="mt-5 max-w-2xl text-base md:text-xl text-white/62 leading-relaxed">{text}</div>}
    </div>
  )
}

function Hero(_: SlideProps) {
  return (
    <div className="slide-shell p-0 bg-[#06120d]">
      <motion.img initial={{ scale: 1.08 }} animate={{ scale: 1.02 }} transition={{ duration: 9, ease: 'easeOut' }} src={FACTORY_IMAGE} alt="Stabilimento reale Specialmangimi Galtieri" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_28%,rgba(193,211,117,.12),transparent_28%),linear-gradient(90deg,rgba(3,11,8,.92),rgba(3,11,8,.62)_44%,rgba(3,11,8,.55))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.7))]" />
      <div className="relative z-10 w-full max-w-[1480px] mx-auto px-7 md:px-16 flex flex-col justify-between min-h-[100dvh] py-8 md:py-12">
        <div className="flex items-start justify-between gap-4">
          <LogoCrop />
          <div className="hidden md:block text-right text-xs uppercase tracking-[.22em] text-white/45">Tesi magistrale · Caso studio</div>
        </div>
        <div className="max-w-5xl pb-12 md:pb-16">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .85 }}>
            <div className="kicker !text-white/55">Specialmangimi Galtieri S.p.A.</div>
            <h1 className="mt-5 text-5xl sm:text-7xl md:text-[7.7rem] leading-[.82] tracking-[-.065em] font-semibold">
              DAL MANGIME
              <span className="block font-serif font-medium italic text-[#d5d9b8]">al valore sostenibile</span>
            </h1>
            <p className="mt-7 text-base md:text-xl max-w-3xl text-white/72 leading-relaxed">Valutazione ambientale, reporting ESG e Business Model Canvas nel caso Specialmangimi Galtieri S.p.A.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/60">
              <span>Saverio Francesco De Santis</span><span className="hidden sm:block w-px h-4 bg-white/20"/><span>LM-69 · Tesi magistrale</span>
            </div>
            <div className="mt-10 inline-flex items-center gap-3 text-xs uppercase tracking-[.22em] text-white/70">Inizia il percorso <ArrowDown size={15} className="animate-bounce" /></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Problem(_: SlideProps) {
  const words = ['ENERGIA','MATERIE PRIME','CO₂','QUALITÀ','PERSONE','FORNITORI','COSTI','TRACCIABILITÀ','GOVERNANCE']
  return <Shell><div className="grid lg:grid-cols-[.85fr_1.15fr] gap-12 items-center">
    <TitleBlock kicker="01 · La domanda" title={<>NON BASTA DIRE<br/><span className="font-serif italic text-[#cfd6aa]">“sostenibile”</span></>} text="La sostenibilità diventa utile alla gestione quando le informazioni possono essere ricondotte a dati, fonti, confini e criteri leggibili." />
    <div className="relative min-h-[460px] flex items-center justify-center">
      <motion.div animate={{ rotate: [0,1.5,-1.5,0], y:[0,-5,0] }} transition={{ duration: 7, repeat: Infinity }} className="relative z-10 w-48 h-64 rounded-[28px] border border-white/15 bg-[linear-gradient(155deg,#b69558,#7f663d)] shadow-2xl flex items-center justify-center text-center">
        <div><PackageCheck className="mx-auto mb-4"/><div className="text-xs tracking-[.25em]">MANGIME</div><div className="mt-2 text-2xl font-serif">dati dentro<br/>il prodotto</div></div>
      </motion.div>
      {words.map((w,i)=>{ const a = (i/words.length)*Math.PI*2; const x=Math.cos(a)*190; const y=Math.sin(a)*155; return <motion.div key={w} initial={{opacity:0,scale:.6}} animate={{opacity:1,scale:1,x,y}} transition={{delay:.12*i}} className="absolute text-[10px] md:text-xs tracking-[.15em] px-3 py-2 rounded-full border border-white/12 bg-black/20 backdrop-blur-md">{w}</motion.div>})}
    </div>
    <div className="lg:col-span-2 mt-2 text-center text-xl md:text-3xl font-medium">Come trasformare queste informazioni <span className="text-[#c4d38d]">in dati utili alle decisioni?</span></div>
  </div></Shell>
}

function ESG(_: SlideProps) {
  const cards = [
    {k:'E',t:'ENVIRONMENTAL',d:'Energia · emissioni · materie prime · rifiuti · acqua',icon:<Leaf/>},
    {k:'S',t:'SOCIAL',d:'Lavoratori · sicurezza · formazione · relazioni con gli stakeholder',icon:<Users/>},
    {k:'G',t:'GOVERNANCE',d:'Controlli · fornitori · tracciabilità · organizzazione',icon:<ShieldCheck/>},
  ]
  return <Shell><TitleBlock kicker="02 · Un linguaggio comune" title="Cosa significa ESG?" text="Tre lenti per organizzare informazioni diverse senza confondere rendicontazione e prestazione." />
    <div className="mt-12 grid md:grid-cols-3 gap-5">{cards.map((c,i)=><motion.div key={c.k} initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{delay:i*.12}} className="glass rounded-[32px] p-7 md:p-9 min-h-[290px] flex flex-col justify-between"><div className="flex items-center justify-between"><span className="text-7xl md:text-8xl font-serif text-[#c9d6a0]">{c.k}</span><span className="opacity-60">{c.icon}</span></div><div><div className="kicker">{c.t}</div><p className="mt-3 text-lg text-white/70">{c.d}</p></div></motion.div>)}</div>
    <div className="mt-8 text-center text-lg md:text-2xl text-white/78">ESG significa osservare l'impresa <span className="text-[#cbd7a3]">oltre il solo risultato economico</span>, senza farne un sinonimo automatico di sostenibilità.</div>
  </Shell>
}

function Proof(_: SlideProps) {
  const chain=['DICHIARAZIONE','EVIDENZA','DATO','INDICATORE','VERIFICABILITÀ']
  return <Shell><div className="text-center max-w-5xl mx-auto"><div className="kicker">03 · Robustezza dell'informazione</div><h2 className="mt-4 text-5xl md:text-8xl font-semibold tracking-[-.06em]">DICHIARARE <span className="text-[#b9c98a]">≠</span> DIMOSTRARE</h2><div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-1">{chain.map((c,i)=><React.Fragment key={c}><motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:i*.12}} className="glass rounded-full px-5 py-3 text-[11px] md:text-xs tracking-[.16em]">{c}</motion.div>{i<chain.length-1&&<ChevronRight className="rotate-90 md:rotate-0 opacity-35" size={18}/>}</React.Fragment>)}</div><p className="mt-12 text-lg md:text-2xl leading-relaxed text-white/68">Una comunicazione ambientale diventa più robusta quando può essere ricondotta a <span className="text-white">dati, fonti, confini e criteri verificabili</span>.</p></div></Shell>
}

function Process(_: SlideProps) {
  const items: [string, LucideIcon][] = [['Materie prime',Boxes],['Approvvigionamento',Route],['Trasformazione',Factory],['Energia',Zap],['Mangime',PackageCheck],['Distribuzione',Route],['Allevamento',Users]]
  return <Shell><TitleBlock kicker="04 · Perimetro" title="Entriamo nel mangimificio" text="Il processo è più ampio dell'analisi quantitativa. La tesi misura la componente energetica della fase di trasformazione all'interno dello stabilimento." />
    <div className="mt-12 grid grid-cols-2 md:grid-cols-7 gap-3 items-stretch">{items.map(([name,Icon],i)=><motion.div key={String(name)} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.08}} className={`rounded-2xl p-4 border ${i===2||i===3||i===4?'border-[#a8bc71]/50 bg-[#9fb568]/10':'border-white/10 bg-white/[.035]'}`}><Icon size={22} className="opacity-70"/><div className="mt-8 text-xs md:text-sm">{name}</div></motion.div>)}</div>
    <div className="mt-8 grid md:grid-cols-[1fr_auto_1fr] items-center gap-5"><div className="hairline"/><div className="source-pill !px-5 !py-3 text-center">GATE-TO-GATE · ricezione → stoccaggio/confezionamento</div><div className="hairline rotate-180"/></div>
    <p className="mt-7 text-center text-sm text-white/48">Esclusi dal nucleo quantitativo: produzione agricola a monte, trasporto a monte, imballaggi, distribuzione e fase d'uso.</p>
  </Shell>
}

function Energy(_: SlideProps) {
  return <Shell><TitleBlock kicker="05 · Digital twin visivo" title="Energia dentro il processo" text="Due vettori alimentano la trasformazione: elettricità e GPL. L'unità funzionale comune è 1 tonnellata di mangime prodotto." />
    <div className="mt-10 grid lg:grid-cols-[.82fr_1.18fr] gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <DataCard icon={<Zap/>} label="Intensità elettrica" value="19,56 kWh/t" detail="1.750.000 kWh / 89.450 t nel 2025" foot="Dato derivato da consumo elettrico e produzione annua"/>
        <DataCard icon={<Gauge/>} label="Intensità energetica complessiva" value="45,3 kWh/t" detail="Indicatore complessivo della fase di trasformazione" foot="Tesi aggiornata · Capitoli 4 e 6"/>
        <DataCard icon={<Factory/>} label="GPL" value="174.910 kg" detail="Consumo annuo delle due centrali termiche" foot="Dato aziendale 2025"/>
        <DataCard icon={<SunMedium/>} label="Fotovoltaico installato" value="≈ 460 kWp" detail="Presenza e potenza dell'impianto" foot="Distinto dalla quota di autoconsumo effettivo"/>
      </div>
      <div className="glass rounded-[32px] p-6 md:p-8 relative overflow-hidden min-h-[420px]">
        <div className="absolute inset-x-12 top-14 h-px bg-white/12"/><div className="absolute inset-x-12 bottom-14 h-px bg-white/12"/>
        <div className="relative h-full min-h-[360px] flex items-center justify-center">
          <motion.div animate={{boxShadow:['0 0 0 rgba(159,181,104,0)','0 0 75px rgba(159,181,104,.16)','0 0 0 rgba(159,181,104,0)']}} transition={{duration:4,repeat:Infinity}} className="w-56 h-56 md:w-72 md:h-72 rounded-[36px] border border-white/12 bg-[#0c2118] flex items-center justify-center transform rotate-[-4deg]"><div className="text-center"><Factory size={42} className="mx-auto opacity-70"/><div className="mt-4 text-sm tracking-[.18em]">TRASFORMAZIONE</div><div className="mt-2 text-xs text-white/45">Modugno · 2025</div></div></motion.div>
          <motion.div animate={{x:[-12,12,-12]}} transition={{duration:3.4,repeat:Infinity}} className="absolute left-4 md:left-10 top-20 flex items-center gap-3 text-[#d8dda9]"><Zap/><span className="text-xs tracking-[.16em]">ELETTRICITÀ</span></motion.div>
          <motion.div animate={{x:[12,-12,12]}} transition={{duration:3.8,repeat:Infinity}} className="absolute right-4 md:right-10 bottom-20 flex items-center gap-3 text-[#ddb878]"><span className="text-xs tracking-[.16em]">GPL</span><Droplets/></motion.div>
          <SunMedium className="absolute top-10 right-10 text-[#d7d9a3]"/>
        </div>
      </div>
    </div>
  </Shell>
}

function PV(_: SlideProps) {
  const [fv,setFv]=useState(40)
  const emission = 5.84 + 7.37*(1-fv/100)
  return <Shell><TitleBlock kicker="06 · Scenario" title="Fotovoltaico: misurato o modellato?" text="La presenza dell'impianto è un'evidenza. La copertura del 40% è utilizzata come parametro di scenario e non coincide con una misura diretta dell'autoconsumo." />
    <div className="mt-12 grid lg:grid-cols-[1fr_.72fr] gap-6 items-stretch">
      <div className="glass rounded-[34px] p-7 md:p-10">
        <div className="flex items-end justify-between gap-6"><div><div className="kicker">Copertura elettrica attribuita al FV</div><div className="mt-2 text-6xl md:text-8xl font-semibold tracking-[-.06em]">{fv}<span className="text-3xl md:text-4xl text-white/45">%</span></div></div><SunMedium size={44} className="text-[#ced9a3]"/></div>
        <input aria-label="Scenario fotovoltaico" className="mt-10 w-full accent-[#9fb568]" type="range" min="0" max="50" step="1" value={fv} onChange={e=>setFv(Number(e.target.value))}/>
        <div className="mt-3 flex justify-between text-xs text-white/40"><span>0%</span><span className="text-white/75">26–50% intervallo del modello Monte Carlo</span><span>50%</span></div>
        <div className="mt-8 rounded-2xl border border-[#a4b96d]/30 bg-[#a4b96d]/8 p-5 text-sm leading-relaxed text-white/70">Nel modello probabilistico: distribuzione triangolare <b className="text-white">26%–50%</b>, con <b className="text-white">moda 40%</b>. Il rapporto tra producibilità PVGIS e consumo annuo è circa 39,7%, ma la quota effettivamente autoconsumata richiede misurazione diretta.</div>
      </div>
      <div className="glass rounded-[34px] p-7 md:p-10 flex flex-col justify-between"><div><div className="kicker">Indicatore emissivo modellato</div><motion.div key={fv} initial={{opacity:.25,scale:.96}} animate={{opacity:1,scale:1}} className="mt-5 text-6xl md:text-7xl font-semibold tracking-[-.06em]">{emission.toFixed(2).replace('.',',')}</motion.div><div className="mt-2 text-xl text-white/55">kg CO₂/t</div></div><div className="mt-8 space-y-3 text-sm"><div className="flex justify-between border-b border-white/10 pb-3"><span className="text-white/50">GPL</span><b>5,84 kg CO₂/t</b></div><div className="flex justify-between border-b border-white/10 pb-3"><span className="text-white/50">Elettricità modellata</span><b>{(7.37*(1-fv/100)).toFixed(2).replace('.',',')} kg CO₂/t</b></div><div className="text-xs text-white/40 pt-2">Visualizzazione didattica dello scenario; non sostituisce il calcolo documentato in tesi.</div></div></div>
    </div>
  </Shell>
}

const distData = [
  {x:9.6,y:1},{x:9.72,y:4},{x:9.85,y:9},{x:10.0,y:18},{x:10.15,y:32},{x:10.3,y:48},{x:10.47,y:58},{x:10.6,y:55},{x:10.75,y:43},{x:10.9,y:29},{x:11.05,y:16},{x:11.2,y:7},{x:11.32,y:3},{x:11.45,y:1}
]

function Emissions(_: SlideProps) {
  return <Shell><TitleBlock kicker="07 · Risultato ambientale" title="Emissioni associate ai vettori energetici" text="Il risultato è riferito alla trasformazione industriale e non all'intero ciclo di vita del mangime." />
    <div className="mt-10 grid lg:grid-cols-[.78fr_1.22fr] gap-5">
      <div className="grid gap-4"><DataCard label="Scenario principale" value="10,26 kg CO₂/t" detail="5,84 Scope 1 + 4,42 Scope 2" foot={sourceLabels.method}/><DataCard label="Monte Carlo · mediana" value="10,47 kg CO₂/t" detail="Media 10,49 · deviazione standard 0,42" foot="200.000 estrazioni"/></div>
      <div className="glass rounded-[34px] p-6 md:p-8 min-h-[420px]"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="kicker">Distribuzione simulata</div><div className="mt-2 text-lg">P2,5 <b>9,72</b> — P97,5 <b>11,32</b> kg CO₂/t</div></div><span className="source-pill">non è un intervallo di confidenza statistico</span></div><div className="mt-6 h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={distData}><defs><linearGradient id="fillD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={GREEN} stopOpacity={.7}/><stop offset="100%" stopColor={GREEN} stopOpacity={.03}/></linearGradient></defs><XAxis dataKey="x" tick={{fill:'#b9c0b5',fontSize:11}} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip contentStyle={{background:'#0b1d15',border:'1px solid rgba(255,255,255,.12)',borderRadius:14}}/><Area type="monotone" dataKey="y" stroke={GREEN} strokeWidth={2} fill="url(#fillD)" animationDuration={1200}/></AreaChart></ResponsiveContainer></div></div>
    </div>
  </Shell>
}

function TwoLenses(_: SlideProps) {
  return <Shell><div className="text-center"><div className="kicker">08 · Stessa unità funzionale</div><h2 className="mt-4 text-5xl md:text-7xl font-semibold tracking-[-.055em]">1 TONNELLATA <span className="font-serif italic text-[#c8d49d]">di mangime</span></h2></div>
    <div className="mt-12 grid md:grid-cols-2 gap-5 relative"><DataCard label="Lente economica" value="638,14 €/t" detail="Costo contabile aziendale normalizzato per tonnellata prodotta · voce B del conto economico" foot="Perimetro economico aziendale più ampio"/><DataCard label="Lente ambientale" value="10,26 kg CO₂/t" detail="Componente climatica associata ai vettori energetici della trasformazione" foot="Perimetro gate-to-gate, componente energetica"/>
      <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 rounded-full border border-white/15 bg-[#0a1b13] px-5 py-3 text-xs tracking-[.15em] shadow-xl">AFFIANCATI · NON SOMMATI</div></div>
    <div className="mt-8 text-center text-sm md:text-base text-white/55">Stesso denominatore per rendere confrontabili le grandezze. <span className="text-white/80">Confini e significati restano distinti.</span></div>
  </Shell>
}

function Costs(_: SlideProps) {
  return <Shell><TitleBlock kicker="09 · Lettura economica" title="Dove si concentra il costo contabile?" text="Nel 2025 il costo aggregato della produzione è normalizzato sulla produzione annua di 89.450 t." />
    <div className="mt-12 grid lg:grid-cols-[.72fr_1.28fr] gap-5"><DataCard label="Costo aggregato" value="638,14 €/t" detail="Totale sezione B / tonnellate prodotte" foot="Non è una LCC completa"/><div className="glass rounded-[34px] p-7 md:p-9"><div className="flex items-end justify-between gap-6"><div><div className="kicker">Materie prime, sussidiarie e di consumo</div><div className="mt-3 text-5xl md:text-6xl font-semibold tracking-[-.05em]">463,91 €/t</div></div><div className="text-4xl md:text-5xl font-serif text-[#c8d69e]">72,7%</div></div><div className="mt-8 h-4 rounded-full bg-white/8 overflow-hidden"><motion.div initial={{width:0}} animate={{width:'72.7%'}} transition={{duration:1.2}} className="h-full rounded-full bg-[#9fb568]"/></div><p className="mt-7 text-sm md:text-base text-white/60 leading-relaxed">La principale componente contabile è legata agli approvvigionamenti. Il risultato non dimostra che la voce possa essere ridotta senza modificare prodotto, qualità, formulazione o condizioni di acquisto.</p></div></div>
  </Shell>
}

function Circularity(_: SlideProps) {
  return <Shell><TitleBlock kicker="10 · Circolarità" title="Contare le tipologie non basta" text="La documentazione segnala la presenza di co-prodotti agro-industriali. Per trasformare questo dato in un indicatore ambientale serve una misura ponderale." />
    <div className="mt-12 grid lg:grid-cols-[.8fr_1.2fr] gap-5"><div className="grid grid-cols-2 gap-4"><DataCard label="Tipologie monitorate" value="16" detail="Conteggio del paniere documentato"/><DataCard label="Co-prodotti identificati" value="8" detail="Numero di tipologie riconducibili a co-prodotti"/></div><div className="glass rounded-[34px] p-7 md:p-9"><div className="flex flex-wrap gap-2">{Array.from({length:16}).map((_,i)=><motion.div key={i} initial={{opacity:0,scale:.3}} animate={{opacity:1,scale:1}} transition={{delay:i*.035}} className={`pellet ${i<8?'ring-2 ring-[#a9be73]/50':''}`}/>)}</div><div className="mt-10 text-2xl md:text-4xl font-medium tracking-[-.03em]">8 su 16 <span className="text-white/45">≠</span> 50% in peso</div><p className="mt-4 text-white/60 leading-relaxed">La quota ponderale non è stata ricostruita. L'indicatore proposto dalla tesi è: massa dei co-prodotti utilizzati / massa totale delle materie prime utilizzate × 100.</p></div></div>
  </Shell>
}

function PelletField() {
  const pellets=useMemo(()=>Array.from({length:49},(_,i)=>({x:(i%7)-3,y:Math.floor(i/7)-3,z:((i*7)%5)-2})),[])
  return <Canvas camera={{position:[0,0,9],fov:48}}><ambientLight intensity={1.5}/><directionalLight position={[4,5,5]} intensity={2}/><group>{pellets.map((p,i)=><Float key={i} speed={1+(i%4)*.1} rotationIntensity={.35} floatIntensity={.45}><mesh position={[p.x*.7,p.y*.5,p.z*.22]}><cylinderGeometry args={[.12,.12,.35,16]}/><meshStandardMaterial color={i<32?'#b8cc7e':i<42?'#c8a66b':'#7d9485'} roughness={.8}/></mesh></Float>)}</group><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={.35}/></Canvas>
}

function KPI(_: SlideProps) {
  return <Shell><div className="grid lg:grid-cols-[.92fr_1.08fr] gap-8 items-center"><div><TitleBlock kicker="11 · Sistema informativo" title={<>49 indicatori,<br/><span className="font-serif italic text-[#cbd6a3]">non un rating ESG</span></>} text="La classificazione misura quanta informazione è disponibile o ricostruibile. Non misura quanto l'impresa sia sostenibile."/><div className="mt-8 grid grid-cols-3 gap-3"><DataCard label="A · Calcolabile" value="32" detail="65,3%"/><DataCard label="B · Da acquisire o consolidare" value="10" detail="20,4%"/><DataCard label="C · Esige nuova raccolta/misurazione" value="7" detail="14,3%"/></div></div><div className="glass rounded-[38px] h-[520px] overflow-hidden relative"><Suspense fallback={<div className="h-full flex items-center justify-center text-white/50">49 indicatori</div>}><PelletField/></Suspense><div className="absolute bottom-5 left-5 right-5 glass rounded-2xl px-4 py-3 text-xs text-white/60">A + B = 42 indicatori con fonte o procedura identificata · 85,7% del set</div></div></div></Shell>
}

function Decisions(_: SlideProps) {
  const steps=[['MISURARE','energia · emissioni · sicurezza · fornitori · dati economici'],['CAPIRE','dove si concentrano consumi, costi e carenze informative'],['DECIDERE','quali informazioni approfondire e quali interventi valutare'],['MIGLIORARE','monitoraggio, tracciabilità informativa e supporto alle decisioni']]
  return <Shell><TitleBlock kicker="12 · Dall'informazione all'azione" title="Dai dati alle decisioni" text="Il valore del sistema non è un punteggio: è la capacità di rendere leggibili dati eterogenei e far emergere priorità di approfondimento."/><div className="mt-12 grid md:grid-cols-4 gap-4">{steps.map((s,i)=><motion.div key={s[0]} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:i*.12}} className="glass rounded-[28px] p-6"><div className="text-xs text-white/40">0{i+1}</div><div className="mt-8 text-2xl font-semibold">{s[0]}</div><p className="mt-4 text-sm leading-relaxed text-white/55">{s[1]}</p>{i<3&&<ArrowRight className="hidden md:block absolute opacity-0"/>}</motion.div>)}</div><div className="mt-7 text-center text-xs text-white/42">La tesi non dimostra riduzioni economiche o ambientali già ottenute grazie al sistema.</div></Shell>
}

const bmcNodes = [
  {name:'PARTNER CHIAVE',tag:'E-doc',text:'Fornitori, rete di approvvigionamento e relazioni di filiera documentate.'},
  {name:'ATTIVITÀ CHIAVE',tag:'E-doc',text:'Produzione, formulazione, controllo qualità, tracciabilità e logistica.'},
  {name:'RISORSE CHIAVE',tag:'E-doc',text:'Stabilimento, linee produttive, laboratorio, personale, rete commerciale, fotovoltaico.'},
  {name:'PROPOSTA DI VALORE',tag:'E-doc',text:'Qualità, controllo, varietà, formulazione per specie/fase, assistenza tecnica e referenze biologiche certificate.'},
  {name:'RELAZIONI CLIENTI',tag:'I',text:'Assistenza e continuità commerciale come componenti della relazione con il cliente.'},
  {name:'CANALI',tag:'E-doc',text:'Rete commerciale, rivendite e logistica distributiva.'},
  {name:'SEGMENTI CLIENTELA',tag:'E-doc',text:'Settore zootecnico, animali da reddito e rurali, pet food e cavalli sportivi.'},
  {name:'STRUTTURA COSTI',tag:'E-doc',text:'Nel 2025 prevale la componente materie prime e merci.'},
  {name:'FLUSSI RICAVO',tag:'E-doc',text:'Ricavi disponibili in forma aggregata; non segmentati per linea nel perimetro della tesi.'},
]

function BMC(_: SlideProps) {
  const [sel,setSel]=useState(3)
  return <Shell><TitleBlock kicker="13 · Modello di business" title="Il Canvas diventa una rete" text="Clicca un nodo. Le etichette distinguono il livello di evidenza dalla lettura interpretativa."/>
    <div className="mt-8 grid lg:grid-cols-[1.2fr_.8fr] gap-5 items-stretch"><div className="glass rounded-[34px] p-5 md:p-8 min-h-[460px] relative flex items-center justify-center"><div className="absolute w-[72%] aspect-square rounded-full border border-white/8"/><div className="absolute w-[48%] aspect-square rounded-full border border-white/10"/><button className="relative z-20 w-36 h-36 rounded-full bg-[#9fb568] text-[#102016] font-semibold shadow-glow">SPECIALMANGIMI<br/>GALTIERI</button>{bmcNodes.map((n,i)=>{const a=(i/bmcNodes.length)*Math.PI*2-Math.PI/2;const r=38;return <motion.button key={n.name} onClick={()=>setSel(i)} animate={{scale:sel===i?1.08:.95,opacity:sel===i?1:.62}} whileHover={{scale:1.05,opacity:1}} style={{left:`calc(50% + ${Math.cos(a)*r}% - 66px)`,top:`calc(50% + ${Math.sin(a)*r}% - 31px)`}} className="absolute z-10 w-[132px] min-h-[62px] rounded-2xl border border-white/12 bg-[#0b1d15]/95 p-3 text-[10px] tracking-[.08em] text-center">{n.name}</motion.button>})}</div><motion.div key={sel} initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} className="glass rounded-[34px] p-7 md:p-9"><span className="source-pill">[{bmcNodes[sel].tag}]</span><h3 className="mt-6 text-3xl md:text-4xl font-semibold tracking-[-.04em]">{bmcNodes[sel].name}</h3><p className="mt-5 text-lg leading-relaxed text-white/65">{bmcNodes[sel].text}</p><div className="mt-10 pt-6 border-t border-white/10 text-xs leading-relaxed text-white/43">Legenda: E-doc evidenza documentale · E-dich evidenza dichiarativa · I interpretazione · P proposta.</div></motion.div></div>
  </Shell>
}

function Value(_: SlideProps) {
  const cards: [string, string, LucideIcon][] = ['DATI','INDICATORI','INFORMAZIONE','DECISIONE']
  const branches=['ENERGIA','APPROVVIGIONAMENTI','QUALITÀ','FORNITORI','PERSONALE','LOGISTICA','BUSINESS MODEL']
  return <Shell><div className="text-center"><div className="kicker">14 · Valore operativo</div><h2 className="mt-4 text-5xl md:text-7xl font-semibold tracking-[-.05em]">Quando l'informazione diventa <span className="font-serif italic text-[#cbd6a4]">utilizzabile</span></h2></div><div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-3">{core.map((c,i)=><React.Fragment key={c}><div className={`rounded-full px-6 py-4 text-xs tracking-[.17em] ${i===3?'bg-[#9fb568] text-[#102016] font-bold':'glass'}`}>{c}</div>{i<3&&<ArrowRight className="rotate-90 md:rotate-0 opacity-35"/>}</React.Fragment>)}</div><div className="mt-12 flex flex-wrap justify-center gap-3">{branches.map(b=><motion.div whileHover={{y:-4}} key={b} className="rounded-2xl border border-white/10 bg-white/[.035] px-5 py-4 text-xs tracking-[.12em]">{b}</motion.div>)}</div><p className="mt-10 text-center text-lg md:text-2xl text-white/66">Il valore operativo della sostenibilità nasce quando <span className="text-white">l'informazione entra nei processi decisionali</span>.</p></Shell>
}

function Daily(_: SlideProps) {
  const cards=[['ENERGIA','Quanto consumiamo per tonnellata?',Zap],['COSTI','Quali componenti incidono maggiormente?',CircleDollarSign],['MATERIE PRIME','Quali dati servono per valutare circolarità?',Boxes],['FORNITORI','Quali controlli e informazioni sono disponibili?',ShieldCheck],['ESG','Quali indicatori sono già disponibili?',BarChart3],['REPORTING','Quali dati alimentano una rendicontazione più strutturata?',FileCheck2]]
  return <Shell><TitleBlock kicker="15 · Utilità potenziale" title="A cosa serve domani mattina in azienda?" text="Una traduzione operativa del sistema costruito nella ricerca. Non funzionalità già implementate in un software aziendale."/><div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{cards.map(([a,b,Icon])=><motion.div whileHover={{y:-4,scale:1.01}} key={String(a)} className="glass rounded-[28px] p-6"><Icon size={24} className="opacity-65"/><div className="mt-8 kicker">{a}</div><div className="mt-3 text-xl md:text-2xl leading-tight">{b}</div></motion.div>)}</div></Shell>
}

function Optimization(_: SlideProps) {
  const top=['MATERIE PRIME','FORMULAZIONE','ENERGIA','LOGISTICA','CONTABILITÀ ANALITICA']
  return <Shell><TitleBlock kicker="16 · Sviluppo futuro" title="Dal monitoraggio all'ottimizzazione" text="La tesi non determina direttamente il prezzo del mangime. Per passare al costo reale per formulazione servono dati più granulari."/><div className="mt-10 flex flex-wrap justify-center gap-3">{top.map(t=><span key={t} className="glass rounded-full px-5 py-3 text-[11px] tracking-[.12em]">{t}</span>)}</div><ArrowDown className="mx-auto my-5 opacity-45"/><div className="mx-auto max-w-3xl glass rounded-[30px] px-8 py-7 text-center"><div className="kicker">Obiettivo informativo</div><div className="mt-3 text-3xl md:text-5xl font-semibold">COSTO REALE PER FORMULAZIONE</div></div><ArrowDown className="mx-auto my-5 opacity-45"/><div className="grid md:grid-cols-3 gap-4"><DataCard label="Materia prima ↑" value="costo formulazione ?" detail="Scenario concettuale"/><DataCard label="Energia ↓" value="costo/t ?" detail="Richiede allocazione di processo"/><DataCard label="Sostituzione ingrediente" value="costo + nutrizione + impatto ?" detail="Richiede vincoli di formulazione e dati ambientali"/></div></Shell>
}

function Roadmap(_: SlideProps) {
  const steps=[['OGGI','Dati disponibili'],['STEP 1','Consolidare dati B'],['STEP 2','Misurare dati C'],['STEP 3','Contabilità analitica'],['STEP 4','Integrazione formulazioni'],['STEP 5','Monitoraggio ESG'],['STEP 6','Supporto decisionale']]
  return <Shell><TitleBlock kicker="17 · Implementazione proposta" title="Una strada, non un salto" text="La roadmap distingue ciò che esiste oggi dalle capacità che richiedono raccolta, integrazione e sviluppo."/><div className="mt-12 relative"><div className="absolute left-5 md:left-0 md:top-1/2 md:-translate-y-1/2 md:right-0 md:h-px top-0 bottom-0 w-px md:w-auto bg-gradient-to-b md:bg-gradient-to-r from-[#9fb568] via-white/25 to-white/5"/><div className="relative grid md:grid-cols-7 gap-4">{steps.map((s,i)=><motion.div key={s[0]} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.09}} className="ml-10 md:ml-0 glass rounded-[24px] p-5 min-h-[145px]"><div className="w-3 h-3 rounded-full bg-[#9fb568] shadow-glow md:mx-auto md:-mt-7 mb-5"/><div className="kicker">{s[0]}</div><div className="mt-3 text-lg leading-tight">{s[1]}</div></motion.div>)}</div></div><p className="mt-9 text-center text-xs text-white/42">Sviluppo proposto · non sistema già implementato.</p></Shell>
}

function Result(_: SlideProps) {
  const items: [string, LucideIcon][] = ['UN QUADRO DELLE EVIDENZE ESG','UN’ANALISI ENERGETICO-EMISSIVA','UNA LETTURA ECONOMICA','49 INDICATORI','UN BUSINESS MODEL CANVAS','UNA BASE PER IL MONITORAGGIO','UNA ROADMAP DI MIGLIORAMENTO']
  return <Shell><div className="grid lg:grid-cols-[.82fr_1.18fr] gap-10 items-center"><TitleBlock kicker="18 · Risposta finale" title="Cosa ha prodotto questa tesi?" text="Un'integrazione metodologica tra misurazione, reporting e modello di business, entro un perimetro esplicito e con limiti dichiarati."/><div className="space-y-3">{items.map((x,i)=><motion.div key={x} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:i*.08}} className="flex items-center gap-4 glass rounded-2xl px-5 py-4"><span className="text-xs text-white/30">0{i+1}</span><span className="text-sm md:text-base tracking-[.04em]">{x}</span></motion.div>)}</div></div><div className="mt-8 text-center text-2xl md:text-4xl font-medium">DATI + SOSTENIBILITÀ + ECONOMIA + STRATEGIA <span className="text-[#c7d49a]">→ VALORE PER LE DECISIONI</span></div></Shell>
}

function Finale(_: SlideProps) {
  return <div className="slide-shell p-0 bg-[#06120d]"><motion.img initial={{scale:1.02}} animate={{scale:1}} transition={{duration:8}} src={FACTORY_IMAGE} alt="Stabilimento Specialmangimi Galtieri" className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,7,.68),rgba(3,10,7,.9))]"/><div className="relative z-10 text-center px-7 max-w-5xl mx-auto"><div className="flex justify-center mb-8"><LogoCrop/></div><div className="kicker !text-white/55">Dal mangime al valore sostenibile</div><h2 className="mt-5 text-5xl md:text-8xl font-semibold tracking-[-.06em] leading-[.9]">Misurare per comprendere.<br/><span className="font-serif italic text-[#d0d7ac]">Comprendere per decidere.</span></h2><div className="mt-9 text-white/65">Saverio Francesco De Santis · Tesi magistrale</div><motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}} className="mt-12 text-xs tracking-[.34em] text-white/60">GRAZIE</motion.div></div></div>
}

const renderers: Record<string, React.FC<SlideProps>> = {
  hero: Hero, problem: Problem, esg: ESG, proof: Proof, process: Process, energy: Energy,
  pv: PV, emissions: Emissions, 'two-lenses': TwoLenses, costs: Costs, circularity: Circularity,
  kpi: KPI, decisions: Decisions, bmc: BMC, value: Value, daily: Daily, optimization: Optimization,
  roadmap: Roadmap, result: Result, finale: Finale,
}

function PresentationUI({index,onPrev,onNext,onJump,hidden,setHidden}: {index:number,onPrev:()=>void,onNext:()=>void,onJump:(i:number)=>void,hidden:boolean,setHidden:(v:boolean)=>void}) {
  const [notes,setNotes]=useState(false)
  const [map,setMap]=useState(false)
  const requestFullscreen=()=>document.documentElement.requestFullscreen?.()
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{
      if (e.key.toLowerCase()==='n') { e.preventDefault(); setNotes(v=>!v) }
      if (e.key.toLowerCase()==='m') { e.preventDefault(); setMap(v=>!v) }
      if (e.key.toLowerCase()==='h') { e.preventDefault(); setHidden(!hidden) }
      if (e.key.toLowerCase()==='f') { e.preventDefault(); requestFullscreen() }
      if (e.key==='Escape') { setNotes(false); setMap(false) }
    }
    window.addEventListener('keydown',key); return()=>window.removeEventListener('keydown',key)
  },[hidden,setHidden])
  if(hidden) return <button onClick={()=>setHidden(false)} className="fixed z-[80] right-4 bottom-4 w-10 h-10 rounded-full glass flex items-center justify-center" title="Mostra interfaccia"><PanelTopOpen size={17}/></button>
  return <>
    <div className="fixed z-[70] top-0 left-0 right-0 h-[3px] bg-white/5"><motion.div animate={{width:`${((index+1)/slides.length)*100}%`}} className="h-full bg-[#a9bd75]"/></div>
    <div className="fixed z-[70] left-4 md:left-7 bottom-4 md:bottom-6 flex items-center gap-2"><button onClick={onPrev} className="w-10 h-10 rounded-full glass flex items-center justify-center" aria-label="Slide precedente"><ArrowLeft size={17}/></button><button onClick={onNext} className="w-10 h-10 rounded-full glass flex items-center justify-center" aria-label="Slide successiva"><ArrowRight size={17}/></button><div className="ml-2 source-pill">{String(index+1).padStart(2,'0')} ━ {String(slides.length).padStart(2,'0')}</div></div>
    <div className="fixed z-[70] right-4 md:right-7 bottom-4 md:bottom-6 flex items-center gap-2"><button onClick={()=>setNotes(v=>!v)} className="w-10 h-10 rounded-full glass flex items-center justify-center" title="Note relatore · N"><HelpCircle size={17}/></button><button onClick={()=>setMap(v=>!v)} className="w-10 h-10 rounded-full glass flex items-center justify-center" title="Indice · M"><Menu size={17}/></button><button onClick={requestFullscreen} className="w-10 h-10 rounded-full glass flex items-center justify-center" title="Fullscreen · F"><Maximize2 size={17}/></button></div>
    <AnimatePresence>{notes&&<motion.aside initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:30}} className="fixed z-[90] right-4 top-4 bottom-20 w-[min(420px,calc(100vw-32px))] glass rounded-[28px] p-6 overflow-auto"><div className="flex justify-between"><div><div className="kicker">Speaker notes</div><h3 className="mt-2 text-xl font-semibold">{slides[index].title}</h3></div><button onClick={()=>setNotes(false)}><X size={18}/></button></div><p className="mt-6 text-sm leading-relaxed text-white/65">{slides[index].note}</p><div className="mt-8 pt-5 border-t border-white/10 text-xs text-white/40 leading-relaxed">Tasti: ← → / Space · F fullscreen · H interfaccia · N note · M indice · ESC chiude overlay.</div></motion.aside>}</AnimatePresence>
    <AnimatePresence>{map&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed z-[85] inset-0 bg-[#06120d]/94 backdrop-blur-xl p-6 md:p-12 overflow-auto"><div className="max-w-6xl mx-auto"><div className="flex justify-between items-center"><div><div className="kicker">Indice della presentazione</div><h3 className="mt-2 text-3xl font-semibold">Mini-map</h3></div><button onClick={()=>setMap(false)} className="w-11 h-11 rounded-full glass flex items-center justify-center"><X size={18}/></button></div><div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{slides.map((s,i)=><button onClick={()=>{onJump(i);setMap(false)}} key={s.id} className={`text-left rounded-2xl p-4 border ${i===index?'border-[#a7bb70]/70 bg-[#9fb568]/10':'border-white/10 bg-white/[.03]'}`}><div className="text-xs text-white/35">{String(i+1).padStart(2,'0')}</div><div className="mt-2 text-sm">{s.title}</div></button>)}</div></div></motion.div>}</AnimatePresence>
  </>
}

export default function App() {
  const [index,setIndex]=useState(0)
  const [uiHidden,setUiHidden]=useState(false)
  const reduced=useReducedMotion()
  const touchStart=useRef<number|null>(null)
  const clamp=useCallback((n:number)=>Math.max(0,Math.min(slides.length-1,n)),[])
  const next=useCallback(()=>setIndex(i=>clamp(i+1)),[clamp])
  const prev=useCallback(()=>setIndex(i=>clamp(i-1)),[clamp])

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      const tag=(e.target as HTMLElement)?.tagName
      if(tag==='INPUT') return
      if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){e.preventDefault();next()}
      if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prev()}
      if(e.key==='Home'){e.preventDefault();setIndex(0)}
      if(e.key==='End'){e.preventDefault();setIndex(slides.length-1)}
    }
    window.addEventListener('keydown',onKey); return()=>window.removeEventListener('keydown',onKey)
  },[next,prev])

  const id=slides[index].id
  const Current=renderers[id]
  const transition=reduced?{duration:0}:{duration:.72,ease:[.22,1,.36,1] as [number,number,number,number]}
  return <div className="relative w-full h-full bg-[#07140f]" onTouchStart={e=>touchStart.current=e.touches[0].clientX} onTouchEnd={e=>{if(touchStart.current===null)return;const dx=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(dx)>55){dx<0?next():prev()}touchStart.current=null}}>
    <AnimatePresence mode="wait" initial={false}><motion.div key={id} className="absolute inset-0" initial={reduced?{opacity:1}:{opacity:0,scale:1.018,filter:'blur(8px)'}} animate={{opacity:1,scale:1,filter:'blur(0px)'}} exit={reduced?{opacity:0}:{opacity:0,scale:.988,filter:'blur(8px)'}} transition={transition}><Current active/></motion.div></AnimatePresence>
    <PresentationUI index={index} onPrev={prev} onNext={next} onJump={setIndex} hidden={uiHidden} setHidden={setUiHidden}/>
  </div>
}
