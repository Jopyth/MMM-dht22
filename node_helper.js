'use strict';

/* Magic Mirror
 * Module: MMM-dht22
 *
 * By Juergen Wolf-Hofer
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const async = require("async");
const exec = require("child_process").exec;
const url = require("url");

module.exports = NodeHelper.create({
	start: function() {
		console.log('Starting node helper: ' + this.name);

		var self = this;

		this.expressApp.get('/dht-data', function(req, res) {
			var query = url.parse(req.url, true).query;

			var stats = {
				id: query.id,
				temp: query.temp,
				humidity: query.humidity,
				room: query.room
			};
			self.sendSocketNotification("STATS", stats);
			res.send({"received": JSON.stringify(stats)});
		});
	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		var self = this;

		if (notification === 'CONFIG') {
			this.config = payload;
			setInterval(function() {
				self.getStats();
			}, this.config.updateInterval);
		}
	},

	getStats: function() {
		var self = this;
		var path = self.config.dht22Util + " ";

		var unit = self.config.tempUnit == 'fahrenheit' ? ' f ' : ' c ';

		async.parallel([
			async.apply(exec, self.config.dht22util + unit + self.config.dht22gpio),
			async.apply(exec, self.config.dht22util + ' h ' + self.config.dht22gpio)
		],
		function (err, res) {
			var stats = {
				id: self.config.id,
				temp: res[0][0],
				humidity: res[1][0],
				room: self.config.room
			};
			self.sendSocketNotification('STATS', stats);
		});
	},

});
