Pokémon Team Workshop (PKHeX-like Experience)

Welcome to the Pokémon Team Workshop, a powerful, web-based utility inspired by tools like PKHeX, designed to help trainers inspect, manage, and build competitive, legally-compliant Pokémon teams.

This application is the first major step towards providing a fully functional, highly interactive save file and team management experience directly in your browser.

✨ Features

1. Core Team Building & Management

Save File Uploader: Easily upload your existing Pokémon save files to inspect or modify your current boxes and teams.

Real-Time Database: Access a comprehensive, searchable database of all Pokémon, their base stats, abilities, and move pools.

Custom Set Editor: Create and customize Pokémon sets (Moves, Nature, EVs/IVs, Items).

2. Critical Legality Checks (PKHeX Standard)

Move Legality Validator: When designing a custom set, the system automatically checks if the selected Pokémon can legally learn the specified move.

Warning System: Illegal moves (e.g., Manaphy learning Electric-type attacks it cannot learn in-game) are flagged with a prominent warning.

Save Guardrail: The system prevents the user from saving or exporting a set that contains illegal moves, ensuring all built teams are compliant with official game mechanics.

3. Modern & Engaging UI

Interactive Dashboard: The home screen features a curated selection of popular Pokémon (e.g., Charizard, Dragonite, Rayquaza, Gengar) displayed in an attractive grid for quick access and inspiration.

Animated Sprites: We have upgraded from static sprites to animated sprites (from Pokémon Black & White onwards) to bring the UI to life and give each creature more personality.

Search Engine: Quickly filter the entire Pokémon database using an advanced search engine.

🛠️ Technology Stack

This application is built using modern web technologies to ensure a fast, robust, and responsive user experience.

Frontend: React, TypeScript, Tailwind CSS

State Management: React Hooks (useState, useEffect)

Data Persistence: Google Firestore (for saving custom user sets and application state)

Styling: Custom CSS and Tailwind utilities for aesthetics and full responsiveness.

External Data: Services are implemented to handle Pokémon data and legality logic.

🚀 Getting Started

Prerequisites

You need a modern web browser capable of running ECMAScript modules and a development environment that supports Node.js and npm/yarn.

Installation

Clone the repository:

git clone [Your Repository URL]
cd pokemon-team-workshop


Install dependencies:

npm install
# or
yarn install


Run the application:

npm start
# or
yarn start


The application will typically open in your browser at http://localhost:3000.

🗺️ Roadmap & Future Plans

Full Editing: Implement the ability to edit specific attributes (IVs, EVs, PID, etc.) and not just high-level sets.

Import/Export: Implement robust import and export functionality for various save file formats.

3D Models Integration: Explore integration of three.js or similar libraries to display basic, rotating 3D models for a more modern visual experience.

Team Builder: Add dedicated functionality to create, name, and manage multiple teams simultaneously.
