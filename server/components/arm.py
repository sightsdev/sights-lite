'''
Numeric Keypad Controls:          
 _ _ _
|7|8|9|+|   1/4 > SHOULDER U/D
|4|5|6|-|   2/5 > ELBOW U/D
|1|2|3| |   3/6 > WRIST U/D
|0 _ _|_|   7/8 > WRIST L/R
            +/- > CLAW OPEN/CLOSE
            0 > Home Device
'''

from adafruit_servokit import ServoKit
from pydantic import BaseModel

class ArmServoConfig(BaseModel):
    index: int
    range_min: int
    range_max: int
    home: int

class ArmConfig(BaseModel):
    enabled: bool = True
    servos: dict[str, ArmServoConfig]

class Arm:
    def __init__(self, config: ArmConfig):
        self.config = config
        self.enabled = self.config.enabled
        if not self.enabled:
            return
        # Set up ServoKit
        self.kit = ServoKit(channels=16)
        for servo in self.config.servos:
            self.kit.servo[servo.index].set_pulse_width_range(servo.range_min, servo.range_max)
        self.CURRENT_ANGLES = {j.index: j.home for j in self.config.servos}
        self.home()

    def home(self):
        if not self.enabled:
            return
        for servo in self.config.servos:
            self.kit.servo[servo.index].angle = servo.home
            self.CURRENT_ANGLES[servo.index] = servo.home

    def increment_angle(self, joint: str, direction: bool, amount: float = 180/100):
        if not self.enabled:
            return
        """Find the relevant index from the given joint name"""
        index: int = self.config.servos[joint].index
        """step the angles by the difference"""
        self.CURRENT_ANGLES[index] = max(min(self.CURRENT_ANGLES[index] + amount * (1 if direction else -1), 180), 0)
        self.kit.servo[index].angle = self.CURRENT_ANGLES[index]
