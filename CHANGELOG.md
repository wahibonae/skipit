# Changelog

Releases of the Skipit extension from this repository, newest first. For everything else we ship, including the web app, see [What's new on getskipit.com](https://getskipit.com/whats-new).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Version numbers are this repository's own and follow [Semantic Versioning](https://semver.org/).

## [1.4.0] - 2026-08-10

### Added
- **Hide what you're skipping.** With discreet mode on, words like "nudity" or "gore" no longer appear on the Skipit button, skip notifications or the timeline, so people watching with you can't see what's being skipped. Skipping works exactly the same. Turn it on in the popup. *(Thanks for the idea, Selma!)*

### Changed
- A refreshed skip button design, plus visual polish in the popup.

### Fixed
- Your button style and discreet mode settings now stay put when you move from one title to the next.

## [1.3.0] - 2026-06-02

### Added
- **A redesigned popup** that shows what you're watching at a glance.
- **Choose your button style:** the classic Skipit look, or one that blends in with Netflix.
- Easier setup: Skipit opens the sign-in page for you right after you install it.

### Changed
- Cleaner, shorter labels when you're skipping more than one category.
- Behind-the-scenes upgrades for a more reliable sign-in.

### Fixed
- The skip button now shows up on Netflix's pre-play screen too.

## [1.2.0] - 2026-05-16

### Added
- New **-2s and +2s buttons** in the player let you pinpoint exactly where a scene starts and ends when you mark it.

## [1.1.5] - 2026-04-04

### Fixed
- Prompts asking you to confirm a scene now only appear when you're signed in.
- The skip button is easier to spot on bright scenes.

## [1.1.4] - 2026-03-04

### Changed
- A refreshed tutorial to help you sign in to the extension.

## [1.1.3] - 2026-02-28

### Fixed
- Marking a scene no longer un-pauses a video you had paused.

## [1.1.2] - 2026-02-22

### Improved
- Skipit is now much better at telling apart movies and shows that share the same name.

## [1.1.1] - 2026-02-21

### Fixed
- Some titles were wrongly treated as unavailable on Netflix. They're recognized properly now.

## [1.1.0] - 2026-02-21

### Added
- When a scene is waiting for review, Skipit shows it on the timeline and asks whether it's accurate, with a quick yes or no. The prompt gets out of your way on its own after a few seconds.
- The skip button now tells you when a title **isn't recognized yet**, or when it's **clean** and needs no skips at all.

### Changed
- A refreshed skip button and voting design.

### Fixed
- Skipit picks the right title more often when several share the same name.
- The popup always gives you a next step, even when a title can't be recognized.

## [1.0.3] - 2026-02-13

### Improved
- Back-to-back and overlapping scenes are now handled seamlessly, with no flicker in between.
- Scenes you mark show up in your skips right away.

## [1.0.2] - 2026-02-05

1.0.1 was skipped. This release follows 1.0.0 directly.

### Added
- **See how many scenes of each kind a title has** in the Skipit panel, before you press play.
- The skip button now tells you what it's doing while it loads.

### Changed
- Bolder, easier-to-read scene markers on the Netflix timeline.
- The popup now links to the right place: the title's page on getskipit.com while you watch, or the site itself while you browse.

### Fixed
- Fixed the skip button forgetting which categories are available after you stop skipping.

## [1.0.0] - 2026-01-29

Moved out of the main Skipit codebase into its own repository.

- **Automatic skipping** of nudity, sex and gore, with each category switched on or off on its own.
- Skipit **recognizes what you're watching** by itself, down to the episode.
- **Mark scenes as you watch** and share them with the community, so the next viewer is covered.
- Upcoming skips appear **right on the Netflix timeline**.
- Every Netflix tab works independently.

[1.4.0]: https://github.com/wahibonae/skipit/releases/tag/v1.4.0
[1.3.0]: https://github.com/wahibonae/skipit/commit/8fac4a4
[1.2.0]: https://github.com/wahibonae/skipit/commit/931caee
[1.1.5]: https://github.com/wahibonae/skipit/commit/b7a5c83
[1.1.4]: https://github.com/wahibonae/skipit/commit/c581dc4
[1.1.3]: https://github.com/wahibonae/skipit/commit/b19c4bd
[1.1.2]: https://github.com/wahibonae/skipit/commit/6da227a
[1.1.1]: https://github.com/wahibonae/skipit/commit/2b50eb7
[1.1.0]: https://github.com/wahibonae/skipit/commit/81e935b
[1.0.3]: https://github.com/wahibonae/skipit/commit/a02c65e
[1.0.2]: https://github.com/wahibonae/skipit/commit/d3cf3c0
[1.0.0]: https://github.com/wahibonae/skipit/commit/db8b002
