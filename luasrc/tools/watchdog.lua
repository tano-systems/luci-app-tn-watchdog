--
-- Copyright (c) 2019, Tano Systems. All Rights Reserved.
-- Authors: Anton Kikin <a.kikin@tano-systems.com>
--

module "luci.tools.watchdog"

local app_version = "0.9.0"
local app_home = "https://github.com/tano-systems/luci-app-watchdog"

function version()
	return app_version
end

function home()
	return app_home
end
