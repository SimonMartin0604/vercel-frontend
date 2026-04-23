# KLER – Komplex Levegőminőség Elemző Rendszer 🌱

## Tartalomjegyzék
- [Stack](#stack)
- [Előfeltételek](#előfeltételek)
- [Telepítés](#telepítés)
  - [1. Repozitóriumok klónozása](#1-repozitóriumok-klónozása)
  - [2. Backend beállítása](#2-backend-beállítása)
  - [3. Frontend beállítása](#3-frontend-beállítása)
- [Futtatás](#futtatás)
- [Környezeti változók](#környezeti-változók)
- [Főbb funkciók](#főbb-funkciók)
- [Projekt felépítése](#projekt-felépítése)
- [Tesztelés](#tesztelés)

---

## Stack

**Frontend:**
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Mantine](https://img.shields.io/badge/Mantine-8-339AF0?logo=mantine)

**Backend:**
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)

| Réteg | Technológia |
|-------|-------------|
| Keretrendszer | React 19 + TypeScript (Vite) |
| UI Komponensek | Mantine v8, Tabler Icons |
| Útválasztás | React Router v7 |
| Térkép | React-Leaflet |
| Nemzetköziesítés | React-i18next (HU, EN, JA) |
| Diagramok | Mantine Charts / Recharts |
| AI Elemzés | Google Gemini API |
| Backend | NestJS 11 + Prisma ORM |
| Adatbázis | MySQL 8 |
| Hitelesítés | JWT + Role-based Guards |
| API Dokumentáció | Swagger (OpenAPI) |

---

## Előfeltételek

A projekt futtatásához szükséges:

- **Node.js** (v18 vagy újabb) – [nodejs.org](https://nodejs.org)
- **npm** (v9 vagy újabb, Node.js-szel együtt települ)
- **MySQL** – futó adatbázis szerver (alapértelmezetten `localhost:3306`)
- **Git** – a repozitóriumok letöltéséhez

> **Megjegyzés:** Ha nincs telepítve a MySQL, telepítheted a [XAMPP](https://www.apachefriends.org/) csomaggal, ami egy egyszerű helyi szervermegoldás.

---

## Telepítés

Videós segítség a telepítéshez: https://www.youtube.com/watch?v=7SEfH36kWgE

### 1. Repozitóriumok klónozása

Hozz létre egy közös mappát a projekteknek, majd klónozd le mindkét repozitóriumot egymás mellé:

```bash
# Frontend repository
git clone https://github.com/SimonMartin0604/vizsgaremek_kler.git

# Backend repository
git clone https://github.com/csokertesi/vizsgaremek-backend.git
```

A klónozás után a mappastruktúra így néz ki:
```
VR-kler/
├── vizsgaremek-backend/     # NestJS backend
└── vizsgaremek_kler/
    └── kler-frontend/       # React frontend
```

---

### 2. Backend beállítása

#### Környezeti változók

Lépj be a backend mappájába, és nevezd át a `.env.example` fájlt `.env`-re:

```bash
cd vizsgaremek-backend
```

A `.env` fájl tartalmát állítsd be az adatbázisod adataival:

```env
PORT=3000
DATABASE_URL="mysql://root@localhost:3306/kler"
```

> **Megjegyzés:** Ha az adatbázisodhoz jelszó is tartozik, az URL-t így módosítsd:
> `mysql://root:JELSZO@localhost:3306/kler`

#### Függőségek telepítése és adatbázis inicializálása

```bash
# Függőségek telepítése
npm install

# Adatbázis séma létrehozása (táblák generálása)
npx prisma db push

# Alaptestadatok betöltése (seed)
npx prisma db seed

# Backend indítása (fejlesztői, watch módban)
npm run start:debug
```

A backend a `http://localhost:3000` címen lesz elérhető.  
A Swagger API dokumentáció: `http://localhost:3000/api/docs`

---

### 3. Frontend beállítása

#### Környezeti változók

Lépj be a frontend mappájába, és nevezd át a `.env.example` fájlt `.env`-re:

```bash
cd vizsgaremek_kler/kler-frontend
```

A `.env` fájl tartalma:

```env
# Google Gemini API kulcs az AI elemzéshez
# Beszerezhető innen: https://aistudio.google.com/
VITE_GEMINI_API_KEY="Az-en-gemini-api-kulcsom"

# Google OAuth Client ID (opcionális, Google bejelentkezéshez)
VITE_GOOGLE_CLIENT_ID="Az-en-google-client-id-em"
```

> **Megjegyzés:** A `VITE_GEMINI_API_KEY` nélkül az AI elemzés funkció nem fog működni, de az összes többi funkció igen.

#### Függőségek telepítése

```bash
# Függőségek telepítése
npm install

# Frontend fejlesztői szerver indítása
npm run dev
```

---

## Futtatás

Az alkalmazás a következő URL-n elérhetővé válik:

```
http://localhost:5173
```

Fontos, hogy **mindkét szervernek futnia kell egyszerre:**

| Szerver | Könyvtár | Parancs | Port |
|---------|----------|---------|------|
| Backend (NestJS) | `vizsgaremek-backend/` | `npm run start:debug` | 3000 |
| Frontend (React) | `vizsgaremek_kler/kler-frontend/` | `npm run dev` | 5173 |

---

## Környezeti változók

### Frontend (`.env`)

| Változó | Leírás | Szükséges |
|---------|--------|-----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API kulcs az AI elemzéshez ([aistudio.google.com](https://aistudio.google.com)) | Igen (AI funkcióhoz) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID a Google bejelentkezéshez | Nem |

### Backend (`.env`)

| Változó | Leírás | Szükséges |
|---------|--------|-----------|
| `DATABASE_URL` | MySQL kapcsolati string (formátum: `mysql://user:pass@host:port/db`) | Igen |
| `JWT_SECRET` | JWT token titkosítási kulcs (tetszőleges hosszú, véletlenszerű szöveg) | Igen |

---

## Főbb funkciók

- **🌍 Interaktív Térképnézet** – Mérőállomások elhelyezkedése és aktuális állapota (React Leaflet)
- **📊 Részletes Adatvizualizáció** – PM10, PM4, PM2.5, PM1 értékek diagramon
- **🤖 AI Elemzés** – Google Gemini API alapú levegőminőségi szakvélemény generálás
- **🔐 Admin Felület** – Eszközök és helyszínek kezelése, felhasználók és jogosultságok adminisztrálása
- **🌐 Többnyelvűség (i18n)** – Magyar, angol és japán nyelv támogatása
- **📱 Reszponzív Design** – Mantine v8 alapú, asztali és mobil eszközökre optimalizált UI

---

## Projekt felépítése

```text
vizsgaremek_kler/
└── kler-frontend/
    ├── public/              # Statikus fájlok
    └── src/
        ├── components/      # Újrafelhasználható UI elemek (StatCard, stb.)
        ├── pages/           # Teljes oldalak (Dashboard, Admin, Auth, Landing)
        ├── services/        # API kommunikáció (api.ts)
        ├── locales/         # Fordítások (hu, en, ja)
        │   ├── hu/          # Fordítás Magyar nyelvre
        │   ├── en/          # Fordítás Angol nyelvre
        │   └── ja/          # Fordítás Japán nyelvre
        ├── types/           # TypeScript típusdefiníciók
        └── i18n.ts          # Nyelvbeállítások

vizsgaremek-backend/
└── src/
    ├── admin/               # Admin végpontok (stats, users)
    ├── auth/                # JWT autentikáció, guard-ok
    ├── devices/             # Eszközök CRUD
    ├── measurements/        # Mérési adatok
    ├── sites/               # Helyszínek + dashboard aggregáció
    └── prisma.service.ts    # Adatbázis kapcsolat
```

---

## Tesztelés

### Backend tesztek

```bash
cd vizsgaremek-backend

# Unit tesztek futtatása
npm run test

# Tesztek watch módban
npm run test:watch

# Lefedettségi riport
npm run test:cov
```

### Manuális tesztelés

A Swagger API dokumentáció segítségével közvetlenül tesztelheted a backend végpontokat:

```
http://localhost:3000/api/docs
```

## Készítette

| Név | Szerepkör |
|-----|-----------|
| **Simon Martin** | Frontend fejlesztő |
| **Kertesi Csongor Balázs** | Backend fejlesztő |

**Verzió:** 0.0.1  
**Utolsó frissítés:** 2026  
**Típus:** Szakmai Vizsgaremek
