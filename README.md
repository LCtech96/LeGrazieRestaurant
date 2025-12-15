# Ristorante Le Grazie

Sito web per il Ristorante Le Grazie a Castellammare del Golfo, Sicilia.

## Tecnologie

- Next.js 14
- TypeScript
- Tailwind CSS
- Neon Database
- pnpm

## Installazione

1. Installa le dipendenze:
```bash
pnpm install
```

2. Configura le variabili d'ambiente:
```bash
cp .env.example .env
```

Aggiungi la tua URL del database Neon nel file `.env`:
```
DATABASE_URL=your_neon_database_url_here
```

3. Esegui il database schema (vedi `lib/db.ts` per lo schema SQL)

4. Avvia il server di sviluppo:
```bash
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Funzionalità

- Homepage con layout stile Facebook (cover image, profile image)
- Highlights Instagram-style
- Menu completo con tutte le sezioni
- Sistema di ordinazione con opzioni tavolo/asporto
- Dark/Light mode
- Design responsive (mobile e desktop)
- Navigation bar responsive (top per desktop, bottom per mobile)

## Struttura del Progetto

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   ├── HeroSection.tsx
│   ├── Highlights.tsx
│   ├── Description.tsx
│   ├── Footer.tsx
│   ├── MenuModal.tsx
│   ├── OrderModal.tsx
│   └── ThemeProvider.tsx
├── lib/
│   ├── menu-data.ts
│   └── db.ts
└── ...
```

## Note

- Le immagini di copertina e profilo devono essere aggiunte manualmente
- I bottoni social (Facebook, WhatsApp) mostrano attualmente un disclaimer
- Le sezioni "Chi siamo" e "Asporto" mostrano un disclaimer temporaneo



