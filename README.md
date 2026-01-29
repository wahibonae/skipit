# Skipit Browser Extension

Skip unwanted content (violence, explicit scenes, opening credits) on Netflix and other streaming platforms.

## Features

- 🔐 **Secure Authentication** - Uses Clerk for secure, independent authentication
- 🔍 **Search Movies & TV Shows** - Search and select content directly from the extension
- ⚙️ **Customizable Preferences** - Choose what types of content to skip
- ⚡ **Automatic Skipping** - Seamlessly skip unwanted scenes while watching
- 🔄 **State Persistence** - Skipping continues even after page reloads
- 🌐 **Works Independently** - No need to have the web app open

## Installation

### For Development

1. **Install Dependencies**:
   ```bash
   cd extension
   npm install
   ```

2. **Build the Extension**:
   ```bash
   npm run build
   ```

3. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension/dist` folder

### For Development Mode (with Hot Reload)

```bash
npm run dev
```

Then load the `extension/dist` folder as described above. Changes will automatically rebuild.

## Usage

### First Time Setup

1. Click the Skipit extension icon in your browser toolbar
2. Click "Sign In" and authenticate with your Skipit account
3. The extension will remember you across browser sessions

### Skipping Content

1. Navigate to Netflix and start playing a movie or TV show
2. Click the Skipit extension icon
3. Search for the content you're watching
4. (For TV shows) Select the season and episode
5. Click "Skip It!" to activate automatic skipping
6. The extension will automatically skip unwanted content based on your preferences

### Managing Preferences

In the extension popup, you can toggle which types of content to skip:
- **Violence** - Skip violent scenes
- **Explicit Content** - Skip explicit/adult content
- **Opening Credits** - Skip opening credit sequences

Changes are saved automatically and apply to all future content.

### Stopping Skipping

Click the "Stop" button in the green banner at the top of the extension popup to deactivate skipping.

## Architecture

### Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **@clerk/chrome-extension** - Authentication
- **Chrome Extensions Manifest V3** - Extension platform

### Project Structure

```
extension/
├── src/
│   ├── popup/               # React popup UI
│   │   ├── App.tsx         # Main app component
│   │   ├── components/     # UI components
│   │   └── hooks/          # Custom React hooks
│   ├── background/         # Service worker
│   │   └── background.ts   # Message routing, state management
│   ├── content/            # Content scripts
│   │   ├── content.ts      # Main content script
│   │   └── netflix-injected.ts  # Netflix player integration
│   ├── lib/                # Shared utilities
│   │   ├── api.ts          # API client
│   │   ├── clerk.ts        # Clerk exports
│   │   ├── config.ts       # Configuration
│   │   └── types.ts        # TypeScript types
│   └── styles/             # CSS styles
├── public/                 # Static assets
│   └── icons/             # Extension icons
├── manifest.json          # Extension manifest
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

### How It Works

1. **Authentication**: Clerk Chrome Extension SDK provides independent authentication
2. **API Communication**: All database operations go through Next.js API routes with Bearer token auth
3. **Netflix Integration**: Script injected into MAIN world accesses Netflix's internal player API
4. **Timestamp Skipping**: Checks current time every 50ms and seeks past unwanted content
5. **State Management**: Chrome storage preserves skip state across page reloads

## Development

### Available Scripts

- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Debugging

- **Popup**: Right-click extension icon → "Inspect popup"
- **Background Worker**: chrome://extensions → Click "service worker" link
- **Content Script**: Open DevTools on Netflix page, check Console
- **Network**: Check Network tab for API requests

### Key Files to Modify

- **Add new UI component**: `src/popup/components/`
- **Modify auth flow**: `src/popup/hooks/useAuth.ts`
- **Add API endpoint**: `src/lib/api.ts`
- **Change skip logic**: `src/content/netflix-injected.ts`
- **Update manifest**: `manifest.json`

## API Integration

The extension communicates with the Skipit backend API:

- **Base URL**: `https://getskipit.com/api` (production) or `http://localhost:3000/api` (development)
- **Authentication**: Bearer token from Clerk (`Authorization: Bearer <token>`)
- **Key Endpoints**:
  - `GET /api/search` - Search content
  - `GET /api/timestamps/:contentType/:contentId` - Get timestamps
  - `GET/POST /api/user/preferences` - User preferences

## Configuration

Update configuration in `src/lib/config.ts`:

```typescript
export const CLERK_PUBLISHABLE_KEY = 'pk_test_...';
export const API_BASE_URL = 'http://localhost:3000/api'; // or production URL
```

### Clerk Dashboard Configuration (Required)

For Google OAuth and other social sign-in providers to work correctly in Chrome Extensions, you must configure Clerk:

1. **Enable Native API**:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com) → **Native Applications**
   - Ensure **Native API** is enabled

2. **Add Extension Redirect URL**:
   - Go to **Configure** → **Paths**
   - Under **Redirect URLs**, add:
     ```
     chrome-extension://dnjgadhmeebgnefm/src/popup/index.html
     ```
   - This is your extension's consistent CRX ID (defined by the `key` in manifest.json)

3. **Verify Allowed Origins** (if using custom domains):
   - Go to **Configure** → **Settings** → **Restrictions**
   - Ensure your extension origin is allowed:
     ```
     chrome-extension://dnjgadhmeebgnefm
     ```

### CRX ID Information

The extension uses a consistent CRX ID: `dnjgadhmeebgnefm`

This is generated from the `key` property in `manifest.json`. Do NOT change or remove this key, as it ensures the extension ID stays consistent across installs and rebuilds, which is required for OAuth redirects to work.

## Troubleshooting

### Extension not loading

- Make sure you built the extension (`npm run build`)
- Check that you're loading the `dist` folder, not the source folder
- Look for errors in chrome://extensions

### Authentication issues

- Verify `CLERK_PUBLISHABLE_KEY` is correct
- Check that allowed origins are configured in Clerk dashboard
- Ensure the extension redirect URL is added in Clerk Dashboard (see Configuration section)
- Verify that "Native API" is enabled in Clerk Dashboard → Native Applications
- Clear extension data: chrome://extensions → Remove → Reinstall
- Check the extension ID matches `dnjgadhmeebgnefm` (if different, update Clerk Dashboard redirect URLs)

### Skipping not working

- Ensure you're on a Netflix page (`*.netflix.com`)
- Check that timestamps exist for the content
- Open DevTools console and look for `[Content]` or `[Netflix Injected]` logs
- Verify the background worker is running (should show "service worker" link)

### API errors (401, 403)

- Sign out and sign in again to refresh token
- Check that backend API is running
- Verify CORS is configured for `chrome-extension://` origin

## Contributing

When contributing to the extension:

1. Follow existing code style and patterns
2. Update TypeScript types when adding new features
3. Test in both development and production builds
4. Update this README if adding new features

## License

This extension is part of the Skipit project.
