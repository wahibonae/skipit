# Skipit

Skip nudity, sex, and gore scenes on Netflix automatically.

![Skipit](screenshot.png)

Skipit is a browser extension that lets you skip scenes you don't want to see on Netflix. Skips are community-sourced and verified through a voting/reputation system, the more people contribute, the better it gets.

**Two parts make Skipit:**

- **Browser Extension**: the thing you use directly on Netflix to auto-skip and mark scenes
- **Web App** ([getskipit.com](https://getskipit.com)): discover ready-to-skip content, see what needs help, vote on community skips, and track your contributions

Both share the same account and database. One user, one account across the whole ecosystem.

## Features

- **Auto-skip scenes**: nudity, sex, and gore categories, toggle each on/off
- **Community-driven**: anyone can contribute scenes, verified through consensus
- **Netflix integration**: auto-detects content, skips seamlessly using Netflix's player API
- **Mark scenes live**: spot something? Mark the start/end while watching and submit it
- **Per-tab isolation**: multiple Netflix tabs work independently

## Prerequisites

- Node.js 18+
- A [Skipit (getskipit.com)](https://getskipit.com) account

## Setup

1. **Clone and install**

```bash
git clone https://github.com/wahibonae/skipit.git
cd skipit/extension
npm install
```

2. **Build**

```bash
npm run build:prod
```

3. **Load in Chrome**

- Go to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist/` folder

4. **Sign in**

Open the extension popup and click "Sign in on getskipit.com". Sign in there, come back, the extension picks up your session automatically.

That's it. The extension talks to getskipit.com out of the box, no extra configuration needed.

## Development

1. Make your changes
2. Run `npm run build:prod`
3. Go to `chrome://extensions` and click "Reload" on the Skipit card
4. Refresh your Netflix tab

The injected Netflix script (`netflix-injected.js`) is auto-generated so don't edit it directly. Edit the source files in `src/content/injected/modules/` instead. The build regenerates it automatically.

## Project Structure

```
src/
├── background/          # Service worker, message routing, tab state
│   ├── handlers/        # Auth, skip, voting, timestamp handlers
│   └── utils/
├── content/             # Content script injected into Netflix pages
│   ├── handlers/        # Chrome and window message handlers
│   ├── managers/        # Auth, overlay, quick-panel, skip-controller
│   ├── utils/           # State, caching, content matching
│   ├── styles/          # CSS for quick-panel and overlay
│   └── injected/        # Source for netflix-injected.js
│       ├── modules/     # Player API, FAB, timeline segments, etc.
│       └── styles/      # Player CSS
├── popup/               # Extension popup UI (React)
└── lib/                 # Shared config and utilities
```

## How It Works

1. Content script is injected into Netflix pages at `document_start`
2. A MAIN-world script accesses Netflix's internal player API
3. The extension detects what you're watching and fetches verified skip timestamps from the API
4. A 50ms interval checks playback position and seeks past matching scenes
5. Colored segments on the timeline show where skips will happen

## Contributing

Contributions are welcome. Here's how:

1. Fork the repo
2. Create a branch (`git checkout -b my-feature`)
3. Make your changes
4. Build and test locally on Netflix
5. Commit and push
6. Open a pull request

If you're adding a new feature or making a big change, open an issue first so we can discuss it.

## Acknowledgements

This product uses the [TMDB API](https://www.themoviedb.org/) for movie and TV show data. Skipit is not endorsed or certified by TMDB.

## License

This project is licensed under GPL-3.0
