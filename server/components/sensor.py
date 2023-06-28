import logging
from pydantic import BaseModel

class SensorConfig(BaseModel):
    enabled: bool
    type: str

# Base class for sensor
class Sensor:
    def __init__(self, config):
        self.logger = logging.getLogger(__name__)
        self.config = config
        
    # The main initialization method that is called after the object has been created
    # Should be overriden by the inheriting class. Called only if enabled.
    def configure(self):
        pass

    def read(self):
        pass
