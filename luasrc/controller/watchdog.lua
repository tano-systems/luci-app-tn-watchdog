--
-- Copyright (c) 2019, Tano Systems. All Rights Reserved.
-- Authors: Anton Kikin <a.kikin@tano-systems.com>
--

module("luci.controller.watchdog", package.seeall)

function index()
	if not nixio.fs.access("/etc/config/watchdog") then
		return
	end

	entry({"admin", "system", "watchdog"}, cbi("watchdog/watchdog"), _("Watchdog"), 5)
end
