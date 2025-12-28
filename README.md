# Strapi 5 CMS Entwicklungsumgebung

Eine vollständige Strapi 5 Headless CMS Entwicklungsumgebung mit TypeScript-Unterstützung.

## 📋 Voraussetzungen

- Node.js >= 20.x
- npm >= 6.x

## 🚀 Schnellstart

### Entwicklungsserver starten

Starten Sie Ihre Strapi-Anwendung mit aktiviertem autoReload:

```bash
npm run develop
```

Das Admin Panel ist verfügbar unter: http://localhost:1337/admin

### Produktionsserver starten

Starten Sie Ihre Strapi-Anwendung ohne autoReload:

```bash
npm run start
```

### Admin Panel erstellen

Erstellen Sie Ihr Admin Panel für die Produktion:

```bash
npm run build
```

## 📁 Projektstruktur

```
strapi-admin/
├── config/          # Konfigurationsdateien
├── database/        # Datenbank-Dateien (SQLite)
├── public/          # Öffentliche Assets
├── src/
│   ├── api/         # API-Definitionen
│   ├── components/  # Wiederverwendbare Komponenten
│   └── index.ts     # Einstiegspunkt
├── .env             # Umgebungsvariablen
└── package.json     # Projektabhängigkeiten
```

## 🔧 Verfügbare Befehle

- `npm run develop` - Entwicklungsmodus mit autoReload
- `npm run start` - Produktionsmodus
- `npm run build` - Admin Panel bauen
- `npm run strapi` - Strapi CLI anzeigen
- `npm run console` - Strapi Console öffnen

## 📚 Wichtige Funktionen

- **Content-Type Builder**: Erstellen Sie Content-Typen über das Admin Panel
- **REST API**: Automatisch generierte REST API für alle Content-Typen
- **GraphQL**: GraphQL API verfügbar über Plugin
- **Medien-Bibliothek**: Upload und Verwaltung von Assets
- **Rollen & Berechtigungen**: Feingranulare Zugriffskontrolle
- **TypeScript**: Vollständige TypeScript-Unterstützung

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
