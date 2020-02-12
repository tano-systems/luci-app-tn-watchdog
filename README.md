# Watchdog configuration LuCI application

## Description
This is an LuCI web UI application for watchdog configuration.

## Dependencies and Limitations
This LuCI application developed for LuCI 19.07+ branch.

This application needs custom initialization scripts for busybox watchdog utility and
custom procd with extra features for setting scheduling policy and priority from init scripts.
Custom procd and watchdog init scripts can be found in the [meta-tanowrt] OpenEmbedded layer.

## Supported languages
- English
- Russian

## Screenshots

![Watchdog Settings](screenshots/luci-app-watchdog.png?raw=true "Watchdog Settings")

[meta-tanowrt]: https://github.com/tano-systems/meta-tanowrt.git
