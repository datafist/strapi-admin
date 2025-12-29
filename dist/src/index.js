"use strict";
// import type { Core } from '@strapi/strapi';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register( /* { strapi }: { strapi: Core.Strapi } */) { },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi }) {
        // Seed-Daten nur beim ersten Start UND nur in Development
        if (process.env.NODE_ENV === 'development') {
            const hasData = await strapi.db.query('api::team.team').findMany();
            if (hasData.length === 0) {
                console.log('🌱 Seeding test data...');
                // 1. Club Info erstellen
                await strapi.documents('api::club-info.club-info').create({
                    data: {
                        clubName: 'VV Volleystars Musterstadt',
                        address: 'Sportweg 123, 12345 Musterstadt',
                        email: 'info@volleystars.de',
                        phone: '+49 123 456789',
                        about: '# Willkommen bei den Volleystars!\n\nWir sind ein traditionsreicher Volleyballverein mit über 200 Mitgliedern.',
                        socialLinks: [
                            { platform: 'Facebook', url: 'https://facebook.com/volleystars' },
                            { platform: 'Instagram', url: 'https://instagram.com/volleystars' }
                        ]
                    }
                });
                // 2. Coaches erstellen
                const coach1 = await strapi.documents('api::coach.coach').create({
                    data: {
                        firstName: 'Michael',
                        lastName: 'Schmidt',
                        role: 'Head Coach',
                        publishedAt: new Date()
                    }
                });
                const coach2 = await strapi.documents('api::coach.coach').create({
                    data: {
                        firstName: 'Sarah',
                        lastName: 'Müller',
                        role: 'Co-Trainer',
                        publishedAt: new Date()
                    }
                });
                // 3. Spieler erstellen
                const players = [];
                const firstNames = ['Anna', 'Lisa', 'Julia', 'Emma', 'Sophie', 'Laura', 'Marie', 'Lea'];
                const lastNames = ['Wagner', 'Becker', 'Hoffmann', 'Schulz', 'Koch', 'Richter', 'Klein', 'Wolf'];
                const positions = ['Zuspiel', 'Außen', 'Diagonal', 'Mitte', 'Libero'];
                for (let i = 0; i < 8; i++) {
                    const player = await strapi.documents('api::player.player').create({
                        data: {
                            firstName: firstNames[i],
                            lastName: lastNames[i],
                            birthDate: new Date(2000 + i, i, 15),
                            position: positions[i % positions.length],
                            jerseyNumber: i + 1,
                            publishedAt: new Date()
                        }
                    });
                    players.push(player.documentId);
                }
                // 4. Teams erstellen
                const team1 = await strapi.documents('api::team.team').create({
                    data: {
                        name: 'Damen 1. Bundesliga',
                        description: 'Unser Flaggschiff-Team spielt in der ersten Bundesliga.',
                        category: 'Damen',
                        season: '2024/2025',
                        players: players.slice(0, 6),
                        coaches: [coach1.documentId],
                        publishedAt: new Date()
                    }
                });
                const team2 = await strapi.documents('api::team.team').create({
                    data: {
                        name: 'Damen 2. Liga',
                        description: 'Unser zweites Damenteam in der Regionalliga.',
                        category: 'Damen',
                        season: '2024/2025',
                        players: players.slice(4, 8),
                        coaches: [coach2.documentId],
                        publishedAt: new Date()
                    }
                });
                // 5. Matches erstellen (mit neuer Struktur)
                await strapi.documents('api::match.match').create({
                    data: {
                        date: new Date(2024, 11, 15, 19, 0),
                        homeGame: true,
                        team: team1.documentId,
                        opponent: 'SV Musterstadt Volleyball',
                        location: 'Sporthalle Musterstadt',
                        result: '3:1 (25:20, 23:25, 25:18, 25:22)',
                        report: '# Spannendes Derby!\n\nEin packender Auftritt unserer Damen 1 gegen den SV Musterstadt.',
                        publishedAt: new Date()
                    }
                });
                await strapi.documents('api::match.match').create({
                    data: {
                        date: new Date(2025, 0, 10, 18, 30),
                        homeGame: false,
                        team: team1.documentId,
                        opponent: 'TSV Nachbarstadt',
                        location: 'Auswärtshalle Nachbarstadt',
                        publishedAt: new Date()
                    }
                });
                await strapi.documents('api::match.match').create({
                    data: {
                        date: new Date(2025, 0, 20, 19, 0),
                        homeGame: true,
                        team: team2.documentId,
                        opponent: 'VC Regionalteam',
                        location: 'Sporthalle Musterstadt',
                        publishedAt: new Date()
                    }
                });
                // 6. News erstellen
                await strapi.documents('api::news-article.news-article').create({
                    data: {
                        title: 'Erfolgreicher Saisonstart!',
                        slug: 'erfolgreicher-saisonstart',
                        content: '# Traumstart in die Saison\n\nMit einem klaren 3:0 Sieg starteten unsere Damen 1 in die neue Saison.',
                        excerpt: 'Die Damen 1 starten erfolgreich in die neue Saison.',
                        seo: {
                            metaTitle: 'Erfolgreicher Saisonstart - VV Volleystars',
                            metaDescription: 'Die Damen 1 starten erfolgreich in die neue Saison mit einem 3:0 Sieg.',
                            keywords: 'volleyball, saisonstart, bundesliga'
                        },
                        publishedAt: new Date()
                    }
                });
                await strapi.documents('api::news-article.news-article').create({
                    data: {
                        title: 'Neuer Co-Trainer verpflichtet',
                        slug: 'neuer-co-trainer-verpflichtet',
                        content: '# Willkommen Sarah Müller\n\nWir freuen uns, Sarah Müller als neue Co-Trainerin begrüßen zu dürfen.',
                        excerpt: 'Sarah Müller verstärkt unser Trainerteam.',
                        seo: {
                            metaTitle: 'Neuer Co-Trainer - VV Volleystars',
                            metaDescription: 'Sarah Müller verstärkt unser Trainerteam als Co-Trainerin.',
                            keywords: 'volleyball, trainer, team'
                        },
                        publishedAt: new Date()
                    }
                });
                // 7. Homepage erstellen
                await strapi.documents('api::homepage.homepage').create({
                    data: {
                        heroTitle: 'VV Volleystars Musterstadt',
                        heroText: 'Willkommen bei den Volleystars Musterstadt - Leidenschaft trifft Teamgeist!',
                        featuredTeams: [team1.documentId, team2.documentId],
                        seo: {
                            metaTitle: 'VV Volleystars Musterstadt - Startseite',
                            metaDescription: 'Offizielle Website des Volleyballvereins Volleystars Musterstadt. News, Teams, Spielpläne und mehr.',
                            keywords: 'volleyball, volleystars, musterstadt, verein'
                        }
                    }
                });
                // 8. Pages erstellen
                await strapi.documents('api::page.page').create({
                    data: {
                        title: 'Über Uns',
                        slug: 'ueber-uns',
                        content: '# Über die Volleystars\n\nSeit 1985 sind wir die erste Adresse für Volleyball in Musterstadt.',
                        seo: {
                            metaTitle: 'Über Uns - VV Volleystars',
                            metaDescription: 'Erfahren Sie mehr über die Geschichte und Philosophie der Volleystars Musterstadt.',
                            keywords: 'volleyball, verein, geschichte, musterstadt'
                        },
                        publishedAt: new Date()
                    }
                });
                console.log('✅ Test data seeded successfully!');
            }
        }
    },
};
