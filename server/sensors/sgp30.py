from dataclasses import dataclass
import random

from components.sensor import Sensor, SensorConfig

class SGP30SensorConfig(SensorConfig):
    mock: bool = False

class SGP30Sensor(Sensor):
    def configure(self):
        if self.config.mock:
            return
        from sgp30 import SGP30
        from smbus2 import SMBus
        # I2C bus
        self.bus = SMBus(1)
        # Create sensor object
        self.sensor = SGP30(self.bus)
        self.sensor.init_sgp()

    def read(self):
        if self.config.mock:
            return {
                "eCO2": random.randint(200, 400),
                "TVOC": random.randint(300, 600)
            }
        data = self.sensor.read_measurements()
        return {
            "eCO2": data[0][0],
            "TVOC": data[0][1]
        }
