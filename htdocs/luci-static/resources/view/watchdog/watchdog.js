'use strict';
'require uci';
'require form';
'require fs';
'require rpc';

/*
 * Copyright (c) 2020, Tano Systems. All Rights Reserved.
 * Authors: Anton Kikin <a.kikin@tano-systems.com>
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var isReadonlyView = !L.hasViewPermission() || null;

var callFileList = rpc.declare({
	object: 'file',
	method: 'list',
	params: [ 'path' ],
	expect: { entries: [] },
	filter: function(list, params) {
		var rv = [];
		for (var i = 0; i < list.length; i++)
			if (list[i].name.match(/^watchdog[0-9A-Z]*/))
				rv.push(params.path + list[i].name);
		return rv.sort();
	}
});

return L.view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callFileList('/dev/'), []),
			uci.load('watchdog')
		])
	},

	render: function(data) {
		var m, s, o;

		console.log(data);

		m = new form.Map('watchdog',
			_('Watchdog Settings'),
			_('On this page you may configure watchdog settings.'));

		m.readonly = isReadonlyView;

		s = m.section(form.TypedSection, 'watchdog');
		s.anonymous = true;
		s.addremove = true;

		/* Device */
		o = s.option(form.Value, 'device', _('Device'));
		o.rmempty = false;
		o.editable = true;
		o.datatype = 'string';
		o.default = '/dev/watchdog';

		for (var i = 0; i < data[0].length; i++)
			o.value(data[0][i]);

		o.validate = function(section_id, formvalue) {
			if (!formvalue || formvalue == '') {
				return _('Device must be specified');
			}

			return true;
		}

		/* Timeout */
		o = s.option(form.Value, 'timeout',
			_('Timeout'),
			_('Timeout value in seconds. If the watchdog is not resetted ' +
			  'within the specified time, the system will be rebooted.'));

		o.default = 30;
		o.datatype = 'min(1)';

		/* Period */
		o = s.option(form.Value, 'frequency',
			_('Period'),
			_('Watchdog reset interval in seconds.'));

		o.default = 5;
		o.datatype = 'min(1)';

		o.validate = function(section_id, formvalue) {
			var timeout = parseInt(this.section.children.filter(function(o) {
				return o.option == 'timeout' })[0].formvalue(section_id));

			var period = parseInt(formvalue);

			if (timeout < period) {
				return _('Watchdog period cannot be less than timeout');
			}

			return true;
		};

		/* Scheduling policy */
		o = s.option(form.ListValue, 'policy', _('Scheduling policy'));
		o.value('SCHED_OTHER');
		o.value('SCHED_FIFO');
		o.value('SCHED_RR');
		o.default = 'SCHED_RR';
		o.rmempty = false;

		/* Priority */
		o = s.option(form.Value, 'priority',
			_('Scheduling priority'),
			_('This parameter specifies the static priority to be ' +
			  'set when specifying scheduling policy as SCHED_FIFO or SCHED_RR. ' +
			  'The allowed range of priorities usually is in the range 1 (low priority) ' +
			  'to 99 (high priority).'));

		o.default = 1;
		o.rmempty = false;
		o.datatype = 'range(1,99)';

		/* Nice */
		o = s.option(form.Value, 'nice',
			_("Scheduling 'nice' value"),
			_('This parameter specifies the nice value to be set when specifying ' +
			  'scheduling policy as SCHED_OTHER. The nice value is ' +
			  'a number in the range -20 (high priority) to +19 (low priority).'));

		o.default = 0;
		o.rmempty = false;
		o.datatype = 'range(-20,19)';

		return m.render();
	}
});
