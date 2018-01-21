/* Magic Mirror
 * Module: MMM-dht22
 *
 * By Juergen Wolf-Hofer
 * MIT Licensed.
 */

Module.register('MMM-dht22', {

	defaults: {
		updateInterval: 10000,
		animationSpeed: 0,
		tempUnit: 'celsius',
		dht22gpio: 22,
		id: 0,
		room: undefined,
		dht22util: '/home/pi/bin/dht22'
	},

	getStyles: function () {
		return ["MMM-dht22.css"];
	},
	
	// Define start sequence
	start: function() {
		Log.log('Starting module: ' + this.name);

		this.sensors = {};

		stats = {
			temp: 'loading...',
			humidity: 'loading...'
		};

		this.sensors[this.config.id] = stats;

		this.sendSocketNotification('CONFIG', this.config);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'STATS') {
			if (payload.id === undefined)
			{
				return;
			}
			var unit = this.config.tempUnit == 'fahrenheit' ? '°F' : '°C';
			this.sensors[payload.id] = {
				temp: payload.temp + unit,
				humidity: payload.humidity + '%',
				room: payload.room
			}
			this.updateDom(this.config.animationSpeed);
		}
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement('div');

		for (var id in this.sensors)
		{
			var currentSensor = this.sensors[id];

			var sensordata = document.createElement('div');
			var roomString = "";
			if (currentSensor.room !== undefined)
			{
				roomString = currentSensor.room + ": ";
			}

			sensordata.innerHTML = roomString + currentSensor.temp + "/" + currentSensor.humidity;

			wrapper.appendChild(sensordata);
		}

		return wrapper;
	},
});
