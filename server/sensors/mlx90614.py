from dataclasses import dataclass
from components.sensor import Sensor, SensorConfig

@dataclass
class MLX90614Config(SensorConfig):
    address: int = 0x5A

class MLX90614(Sensor):
    def configure(self):
        if not self.config.enabled:
            return
        # Only import SMBus when trying to use this library
        # to prevent import errors on non-i2c-enabled systems
        import mlx90614
        from smbus2 import SMBus
        i2cbus = SMBus(1)
        # Create sensor object
        self.sensor = mlx90614.MLX90614(i2cbus, address=self.config.address)

    def read(self):
        # Get data and round to 1 dp
        return round(self.sensor.get_object_1(), 2)
