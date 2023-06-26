from dataclasses import dataclass
import random

from components.sensor import Sensor, SensorConfig

@dataclass
class SGP30SensorConfig(SensorConfig):
    pass

class SGP30Sensor(Sensor):
    def configure(self):
        if not self.config.enabled:
            return
        from sgp30 import SGP30
        from smbus2 import SMBus
        # I2C bus
        self.bus = SMBus(1)
        # Create sensor object
        self.sensor = SGP30(self.bus)
        self.sensor.init_sgp()

    def read(self):
        if not self.config.enabled:
            return {
                "co2": 453,
                "tvoc": 222
            }
        data = self.sensor.read_measurements()
        return {
            "co2": data[0][0],
            "tvoc": data[0][1]
        }
