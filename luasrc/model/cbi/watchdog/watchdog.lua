--
-- Copyright (c) 2019, Tano Systems. All Rights Reserved.
-- Authors: Anton Kikin <a.kikin@tano-systems.com>
--

local sys  = require "luci.sys"
local util = require "luci.util"
local uci  = require("luci.model.uci").cursor()

local m, s, o

m = Map("watchdog",
	translate("Watchdog Settings"),
	translate("On this page you may configure watchdog settings.")
)

s = m:section(TypedSection, "watchdog")
s.anonymous = true
s.addremove = true

-- Device
local wd_device = s:option(Value, "device",
	translate("Device"))

wd_device.default = "/dev/watchdog"
wd_device.rmempty = false

function wd_device.validate(self, value, section)
	if not value or value == "" then
		return nil, translate("Device must be specified")
	end

	if nixio.fs.stat(value, "type") ~= "chr" then
		return nil, translate("Specified device is not valid character device")
	end

	return Value.validate(self, value, section)
end

-- Timeout
local wd_timeout = s:option(Value, "timeout",
	translate("Timeout"),
	translate("Timeout value in seconds. If the watchdog is not resetted " ..
	          "within the specified time, the system will be rebooted.")
)

wd_timeout.default = 30
wd_timeout.datatype = "min(1)"

-- Period
local wd_period = s:option(Value, "frequency",
	translate("Period"),
	translate("Watchdog reset interval in seconds.")
)

wd_period.default = 5
wd_period.datatype = "min(1)"

function wd_period.validate(self, value, section)
	local period = tonumber(value)
	local timeout = tonumber(wd_timeout:formvalue(section))

	if timeout < period then
		return nil, translate("Watchdog period cannot be less than timeout")
	end

	return Value.validate(self, value, section)
end

-- Scheduling policy
local wd_policy = s:option(ListValue, "policy",
	translate("Scheduling policy"))

wd_policy:value("SCHED_OTHER")
wd_policy:value("SCHED_FIFO")
wd_policy:value("SCHED_RR")
wd_policy.default = "SCHED_RR"
wd_policy.rmempty = false

-- Priority
local wd_priority = s:option(Value, "priority",
	translate("Scheduling priority"),
	translate("This parameter specifies the static priority to be " ..
	          "set when specifying scheduling policy as SCHED_FIFO or SCHED_RR. " ..
	          "The allowed range of priorities usually is in the range 1 (low priority) " ..
	          "to 99 (high priority).")
)

wd_priority.default = 1
wd_priority.rmempty = false
wd_priority.datatype = "range(1,99)"

-- Nice
local wd_nice = s:option(Value, "nice",
	translate("Scheduling 'nice' value"),
	translate("This parameter specifies the nice value to be set when specifying " ..
	          "scheduling policy as SCHED_OTHER. The nice value is " ..
	          "a number in the range -20 (high priority) to +19 (low prior ity).")
)

wd_nice.default = 0
wd_nice.rmempty = false
wd_nice.datatype = "range(-20,19)"

-----------------------------------------------------------------------------------

m:section(SimpleSection, nil).template = "watchdog/footer"

-----------------------------------------------------------------------------------

return m
