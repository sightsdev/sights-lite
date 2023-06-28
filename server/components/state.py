from __future__ import annotations
from typing import TYPE_CHECKING, Optional

from pydantic import BaseModel

if TYPE_CHECKING:
    from .camera import CameraParameters
    from .drive import Drive
    from .sensor import Sensor
    from .arm import Arm

class State(BaseModel):
    cameras: dict[str, 'CameraParameters'] = {}
    sensors: dict[str, 'Sensor'] = {}
    drive: Optional['Drive'] = None
    arm: Optional['Arm'] = None
