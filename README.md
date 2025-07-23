# LGamila Stream Platform

![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/stormix/lgamila)

<div align="center">

![LGamila Logo](./apps/web/public/lgamila-live.svg)

### LGamila - Moroccan Streaming Platform

A comprehensive platform for discovering and tracking Moroccan streamers on Twitch and Kick, featuring a browser extension, web platform, and robust backend API.

[Download Extension](#browser-extension) · [Report Bug](https://github.com/stormix/lgamila/issues) · [Request Feature](https://github.com/stormix/lgamila/issues)

</div>

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Screenshots](#screenshots)
3. [What's Inside?](#whats-inside)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
5. [Usage](#usage)
6. [Releases](#releases)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)
10. [Acknowledgments](#acknowledgments)

## About the Project

LGamila is a platform dedicated to the Moroccan streaming community, providing tools to discover and follow Moroccan content creators across Twitch and Kick platforms. The project consists of a browser extension that shows real-time streaming status, a web platform for community engagement, and a robust backend API that tracks streamers across multiple platforms.

### Key Features

- **Real-time Stream Tracking**: Monitor live status across Twitch and Kick
- **Browser Extension**: Chrome extension showing live Moroccan streamers
- **Web Platform**: Community-driven platform for discovering streamers
- **Streamer Suggestions**: Community can suggest new streamers to add
- **Cross-platform Support**: Unified view of streamers across multiple platforms

## Screenshots

<!-- Add screenshots here when available -->

_Screenshots coming soon..._

## What's Inside?

This monorepo includes the following packages/apps:

### Apps

- `backend`: A [Hono](https://hono.dev/) + [Bun](https://bun.sh/) API server with real-time stream tracking
- `web`: An [Astro](https://astro.build/) web application for the community platform
- `extension`: A [Plasmo](https://docs.plasmo.com/) browser extension for Chrome

### Packages

- `@lgamila/shared`: Shared utilities and type definitions
- `@lgamila/logging`: Structured logging with context support and Sentry integration
- `@lgamila/typescript-config`: TypeScript configurations

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended package manager)
- Docker (for local database, optional)
- PostgreSQL database
- Redis server

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/stormix/lgamila.git
   cd lgamila
   ```

2. **Install dependencies:**

   ```bash
   npm install -g pnpm
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Fill in the required environment variables in `.env` file.

4. **Set up the database:**

   ```bash
   # Push database schema
   pnpm --filter backend db:push

   # Generate and run migrations (optional)
   pnpm --filter backend db:generate
   pnpm --filter backend db:migrate
   ```

5. **Start the development servers:**

   ```bash
   # Start all apps
   pnpm dev

   # Or start individual apps
   pnpm --filter backend dev    # Backend API
   pnpm --filter web dev        # Web platform
   pnpm --filter extension dev  # Browser extension
   ```

## Usage

### Backend API

The backend provides a REST API for accessing streamer data:

- `GET /api/streamers` - Get list of streamers with optional filtering
- `GET /api/streamers/multi` - Get streamers active on multiple platforms
- `POST /api/streamers/suggest` - Suggest a new streamer

### Browser Extension

1. Build the extension: `pnpm --filter extension build:all`
2. Load the extension in your browser:
   - **Chrome**: Load from `apps/extension/build/chrome-mv3-prod`
   - **Firefox**: Load from `apps/extension/build/firefox-mv2-prod`
3. The extension will show live Moroccan streamers in the popup

#### Download Pre-built Extension

You can also download pre-built extension files from our [GitHub Releases](https://github.com/stormix/lgamila/releases).

### Web Platform

Visit the web platform to:

- Discover new Moroccan streamers
- Suggest streamers to be added to the platform
- Learn about the project

## Releases

Extension releases are automatically built and published via GitHub Actions. Each release includes:

- **Chrome Extension** (Manifest V3) - Compatible with Chrome, Edge, and Chromium browsers
- **Firefox Extension** (Manifest V2) - Compatible with Firefox

### Download Latest Release

Visit our [GitHub Releases page](https://github.com/stormix/lgamila/releases) to download the latest extension builds.

### Creating Releases

For maintainers, see [RELEASING.md](RELEASING.md) for detailed release instructions.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Use conventional commits format
- Ensure all checks pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note**: This project is not affiliated with Twitch, Kick, or any of their parent companies. All trademarks are the property of their respective owners.

## Contact

**Stormix** - [@stormix_dev](https://twitter.com/stormix_dev) - hello@stormix.dev

**Project Link**: [https://github.com/stormix/lgamila](https://github.com/stormix/lgamila)

## Acknowledgments

This project was made possible thanks to the amazing open source community and the Moroccan streaming community, especially:

- [Zikoos Jam](https://www.twitch.tv/zikoos_jam) - Original project inspiration
- [EKB9816](https://x.com/ekb9816) - Project designer and logo creator
- [Hono](https://hono.dev/) - Fast web framework
- [Astro](https://astro.build/) - Modern web framework
- [Plasmo](https://docs.plasmo.com/) - Browser extension framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Turborepo](https://turbo.build/repo) - Monorepo management
- [Twitch API](https://dev.twitch.tv/) - Twitch platform integration
- [Kick API](https://kick.com/) - Kick platform integration

---

<p align="center">
  Made with ❤️ by the Moroccan Streaming Community
</p>
