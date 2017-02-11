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
	header: 'DHT22 Sensor',
	tempUnit: 'celsius',          // 'celsius' or 'fahrenheit'
	dht22gpio: 22,
	dht22util: 'sudo /home/pi/bin/dht22'
  },

    getStyles: function () {
        return ["MMM-dht22.css"];
    },  
  
  // Define start sequence
  start: function() {
    Log.log('Starting module: ' + this.name);
    this.stats = {};
    this.stats.celsius = 'reading ...';
    this.stats.fahrenheit = 'reading ...';
    this.stats.humidity = 'reading ...';
    this.sendSocketNotification('CONFIG', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    //Log.log('MMM-dht22: socketNotificationReceived ' + notification);
    //Log.log(payload);
    if (notification === 'STATS') {
	  this.stats.celsius = payload.celsius + '°C';
	  this.stats.fahrenheit = payload.fahrenheit + '°F';
	  this.stats.humidity = payload.humidity + '%';	  
      this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator.
  getDom: function() {
    var wrapper = document.createElement('table');

    wrapper.innerHTML = '<tr>' +
							'<td class="header" span="2">' + this.config.header + '</td>' +
						'</tr><tr>' +  
							'<td class="title">Temperature: </td>' +
							'<td class="value">' +
								((this.config.tempUnit == 'fahrenheit') ? this.stats.fahrenheit : this.stats.celsius) + 					
							'</td>' + 
						'</tr><tr>' +  
							'<td class="title">Humidity: </td>' +
							'<td class="value">' + this.stats.humidity + '</td>' +
                        '</tr>';
    return wrapper;
  },
});