# LuCI support for watchdog

## Description
This is an alternate application for SNMP daemon configuration from LuCI web UI.

## Dependencies and Limitations
This LuCI application developed for LuCI 18.06 branch.

This application needs custom initialization scripts for busybox watchdog utility and
custom procd with extra features for setting scheduling policy and priority from init scripts.
Custom procd and watchdog init scripts can be found in the [meta-tano-openwrt] OpenEmbedded layer.

## Supported languages
- English
- Russian

[meta-tano-openwrt]: https://github.com/tano-systems/meta-tano-openwrt.git
