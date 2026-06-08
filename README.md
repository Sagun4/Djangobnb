# DjangoBnB 🏡✨

DjangoBnB is a full-stack, premium Airbnb clone featuring real-time messaging, immediate booking notifications, property search filters, user profiles, and responsive date range pickers. 

The application is built using a modern decoupled architecture: a **Next.js** frontend and a **Django** backend with **Django Channels (WebSockets)** and **Redis** for cross-process production messaging, all wrapped inside **Docker Compose** containers and reverse-proxied by **Nginx** with Let's Encrypt SSL.

---

## 🛠 Tech Stack

* **Frontend**: Next.js, TypeScript, Tailwind CSS (v4), Zustand (Modal & State Management), React Date Range.
* **Backend**: Django, Django REST Framework, Django Channels (WebSockets).
* **Databases**: PostgreSQL (Relational Data), Redis (WebSocket Channel Layer Broker).
* **Production Deployment**: Docker Compose, Daphne (ASGI Server), Nginx (SSL Termination), Vercel (Frontend Hosting).

---

## 🚀 Key Features

* **Interactive Search Bar & Modal**: Open specific search categories (Where, Check-in, Check-out, Guests) directly. Intermediate search triggers available on every step.
* **Real-time Live Chat**: Built using Django Channels. Autoscrolls on message dispatch/receipt and checks user active paths.
* **Landlord Real-Time Notifications**: Instant, full-width success banners appear to property owners whenever a guest books their listing.
* **Booked Status Badges**: Emerald green "Booked" labels appear on landlord listings under `/myproperties` if they have active reservations.
* **User Profile & Avatar Customization**: Edit display name and upload profile avatars with a dynamic live preview and size validation boundaries.
* **Fluid Mobile Sizing**: Responsive calendar layouts that resize dynamically for mobile devices.

---

## 📁 Repository Structure

```
├── backend/                       # Django REST API Backend
│   ├── djangobnb_backend/         # Django core & application logic
│   │   ├── chat/                  # WebSockets chat & notifications
│   │   ├── properties/            # Property listings, reviews, bookings
│   │   ├── useraccount/           # User authentication and profile APIs
│   │   └── djangobnb_backend/     # Main configurations, URL routing, settings
│   ├── nginx/                     # Production Nginx reverse-proxy configuration
│   ├── docker-compose.prod.yml    # Production container definitions (Nginx, Web, Daphne, DB, Redis)
│   ├── docker-compose.yml         # Development container definitions
│   └── requirements.txt           # Python package dependencies
│
└── djangobnb/                     # Next.js Frontend App Router
    ├── app/
    │   ├── components/            # Reusable UI modules (modals, navbar, items)
    │   ├── inbox/                 # Chat rooms list & active message detail
    │   ├── myfavourites/          # Saved properties list
    │   ├── myproperties/          # User-owned properties & booking indicators
    │   ├── myreservations/        # Guest reservation itineraries
    │   ├── services/              # API communication layer (apiService)
    │   └── globals.css            # CSS styling & datepicker overrides
    ├── next.config.ts             # Trailing slash rewrites configuration
    └── package.json               # Node packages and build scripts
```

---

## 💻 Local Development Setup

### 1. Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv env
   # On Windows:
   .\env\Scripts\activate
   # On macOS/Linux:
   source env/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and configure:
   ```bash
   cp djangobnb_backend/.env.example djangobnb_backend/.env
   ```
5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the local server:
   ```bash
   python manage.py runserver
   ```

### 2. Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd djangobnb
   ```
2. Install the node dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and configure:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Production Deployment (Docker Compose & Nginx)

In production, the backend services run inside isolated Docker containers. Gunicorn handles REST HTTP queries, Daphne manages WebSockets, and Redis coordinates WebSocket communication between the HTTP backend processes and Daphne.

### Deployment on your Droplet:

1. **Pull the latest changes**:
   ```bash
   cd /webapps/Djangobnb
   git pull origin main
   ```

2. **Recreate and build containers**:
   ```bash
   cd /webapps/Djangobnb/backend
   docker compose -f docker-compose.prod.yml down
   docker compose -f docker-compose.prod.yml up -d --build
   ```

3. **Check logs to verify all containers are healthy**:
   ```bash
   docker compose -f docker-compose.prod.yml logs -f
   ```

### Trailing Slash Routing & Redirection:
The Next.js configuration is set to `trailingSlash: true`. To avoid routing redirections and Chromium-based crashes (`STATUS_ILLEGAL_INSTRUCTION`), always ensure:
* API calls and client-side links end in a trailing slash (e.g. `/api/chat/` or `/inbox/`).
* Standardized trailing-slash routing rewrite rules exist in `next.config.ts`.
