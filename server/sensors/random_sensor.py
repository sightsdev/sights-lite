from dataclasses import dataclass
import random

from components.sensor import Sensor, SensorConfig

class RandomSensorConfig(SensorConfig):
    minimum: int = 10
    maximum: int = 20

class RandomSensor(Sensor):
    def configure(self):
        self.logger.info(f"RandomSensor: Min and max are {self.config.minimum} and {self.config.maximum}")

    def read(self):
        return random.randint(self.config.minimum, self.config.maximum)
