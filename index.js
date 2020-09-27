const bme280 = require('bme280');
const influx = new (require('influx').InfluxDB)('http://raspberrypi4bserver.local:8086/homestats');

const round = (number) => Math.round(number * 100) / 100;

const reportContinuous = async (_) => {
  const sensors = {
    bme280: await bme280.open({
      i2cAddress: 0x76,
    }),
  };

  const reading = {
    bme280: await sensors.bme280.read(),
  };

  const points = [
    {
      measurement: 'sensor',
      tags: {
        location: 'myRoom',
      },
      fields: {
        temperature: round(reading.bme280.temperature),
        pressure: round(reading.bme280.pressure),
        humidity: round(reading.bme280.humidity),
      },
    },
  ];
  await influx.writePoints(points).catch((error) => console.error(error));

  await sensors.bme280.close();
};

reportContinuous().catch(console.log);
