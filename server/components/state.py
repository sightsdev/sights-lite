from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .camera import CameraParameters
    from .drive import Drive
    from .sensor import Sensor
    from .arm import Arm

class State:
    cameras: dict[str, 'CameraParameters'] = {}
    sensors: dict[str, 'Sensor'] = {}
    drive: 'Drive'
    arm: 'Arm'
