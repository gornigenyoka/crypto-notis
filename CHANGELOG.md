# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Created CHANGELOG.md to track all project changes

### Removed
- CSV modification scripts from backend/scripts/ (identified as problematic and unused)
  - updateCSV_v2.js
  - updateCSV_v3.js
  - updateCSV.js
  - fixCSVStructure.js
  - addApiColumn.js
  - addApiColumnToRefLinks.js
  - updateApiColumn.js
  - addNewColumnsOnly.js
  - update_api_column_safe.py

### Changed
- None

### Fixed
- None

## [Previous Changes]
- Project initialization and setup
- Frontend React/TypeScript application
- Backend Node.js server
- Platform data management system
- Removed the Status field from the sidebar card in PlatformDetail page so it is no longer shown on the frontend.
- Made the header navigation responsive in AppHeader.tsx. On mobile, the menu collapses into a hamburger icon that opens a dropdown menu.
- Note: Backup of AppHeader.tsx should be made before editing for future changes.
- Made the Analytics page responsive: mini-charts and Trending/Top Gainers sections now stack vertically on mobile (using flex-col for small screens). 