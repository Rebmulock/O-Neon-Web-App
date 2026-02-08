# O-Neon Web App

O-Neon Web App je moderná webová aplikácia postavená na **React** (frontend) a **Python** (backend) s možnosťou jednoduchého spustenia cez **Docker**.

---

## 🛠️ Prerequisites

Pred inštaláciou sa uisti, že máš nainštalované:

- [Docker](https://www.docker.com/get-started) ≥ 20.x  
- [Docker Compose](https://docs.docker.com/compose/install/) ≥ 2.x  

> ⚠️ Nie je potrebné manuálne inštalovať Python, Node.js ani iné závislosti. Všetko je zabalené v Docker kontejneri.

---

## 🚀 Inštalácia

1. **Stiahni projekt z GitHubu:**

```bash
git clone https://github.com/tvoj-username/o-neon-web-app.git
cd o-neon-web-app
```
2. **Spusti Docker Compose, ktorý buildne a spustí všetky služby:**
```bash
docker-compose up -d --build
```
3. **Over, že kontajneri bežia:**
```bash
docker ps
```
 - Mali by sa zobraziť tri kontajnery: backend, frontend, postgres-db.

---
## ⚡ Prístup k aplikácii

Frontend: http://localhost:5173
Backend: http://localhost:8000
DB: http://localhost:5432

(používateľ a heslo sú nastavené v Docker Compose)
