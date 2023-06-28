from components.sensor import Sensor, SensorConfig
from .mlx90640 import MLX90640Sensor

class MLX90641SensorConfig(SensorConfig):
    address: int = 0x33
    interpolate: bool = False
    mock: bool = False

'''
Note: Uses the same 'read()' method as MLX90640
Only difference is width/height of output and class used from library
'''
class MLX90641Sensor(MLX90640Sensor):
    # Set width and height (static)
    width = 16
    height = 12

    # Override the MLX90640 implementation with different sensor object and width/height
    def configure(self):
        if self.config.mock:
            return
        import seeed_mlx9064x
        # Additional config option for i2c address, default to 0x33
        self.address = self.config.address
        # Create sensor object
        self.sensor = seeed_mlx9064x.grove_mxl90641(address=self.address)
        self.sensor.refresh_rate = seeed_mlx9064x.RefreshRate.REFRESH_4_HZ
