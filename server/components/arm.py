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
import asyncio
import logging
from typing import Optional

from adafruit_servokit import ServoKit
from pydantic import BaseModel

class ArmServoConfig(BaseModel):
    index: int
    range_min: int
    range_max: int
    home: int
    presets: Optional[dict[str, int]]

class ArmConfig(BaseModel):
    enabled: bool = True
    servos: dict[str, ArmServoConfig]

class Arm:
    def __init__(self, config: ArmConfig):
        self.logger = logging.getLogger(__name__)
        self.config = config
        self.enabled = self.config.enabled
        if not self.enabled:
            return
        # Set up ServoKit
        self.kit = ServoKit(channels=16)
        for servo in self.config.servos.values():
            self.kit.servo[servo.index].set_pulse_width_range(servo.range_min, servo.range_max)
        self.CURRENT_ANGLES = {j.index: j.home for j in self.config.servos.values()}
        self.home()

    async def home(self):
        if not self.enabled:
            return
        for name, servo in self.config.servos.items():
            self.kit.servo[servo.index].angle = servo.home
            self.CURRENT_ANGLES[servo.index] = servo.home
            if name == "WRISTLR" or name == "WRISTUD":
                await asyncio.sleep(0.25)

    async def move_preset(self, preset_name: str):
        if not self.enabled:
            return
        for name, servo in self.config.servos.items():
            if preset_name not in servo.presets:
                continue
            self.kit.servo[servo.index].angle = servo.presets[preset_name]
            self.CURRENT_ANGLES[servo.index] = servo.presets[preset_name]
            if name == "ELBOW":
                await asyncio.sleep(0.25)

    def increment_angle(self, joint: str, direction: bool, amount: float = 180/100):
        if not self.enabled:
            return
        """Find the relevant index from the given joint name"""
        index: int = self.config.servos[joint].index
        """step the angles by the difference"""
        self.CURRENT_ANGLES[index] = max(min(self.CURRENT_ANGLES[index] + amount * (1 if direction else -1), 180), 0)
        self.logger.info(f"joint: {joint} - angle{self.CURRENT_ANGLES[joint]}")
        self.kit.servo[index].angle = self.CURRENT_ANGLES[index]
