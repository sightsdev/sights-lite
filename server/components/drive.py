from dataclasses import dataclass, field
from typing import Any
import logging

from dataclasses import dataclass

class Drive:
    def move_motor(self, channel, speed):
        pass

    def move(self, speed):
        pass

    def stop(self):
        pass

    def close(self):
        pass

class DummyConnection(Drive):
    def __init__(self):
        print("Created")

    def move_motor(self, channel: str, speed: int):
        print(f"Moving channel {channel} at speed {speed}")

    def move(self, speed: list[int]):
        print(f"Moving both at speeds {speed}")

    def stop(self):
        print("Stopping")

    def close(self):
        print("Closing")

class SimpleSerialConnection(Drive):
    def __init__(self, port: str, baudrate: int, channels):
        #import serial
        self.port = port
        self.baudrate = baudrate
        self.channels = channels
        #self.serial = serial.Serial(port=self.port, baudrate=self.baudrate)

    def move_motor(self, channel: int, speed: int):
        # Left channel
        if channel == 0:
            offset = 64 if speed > 0 else 0
            channel = self.channels.get('left') * 128
            msg = offset + channel + abs(round(62 / 1000 * speed))
            self.serial.write(bytes([msg]))
        # Right channel, note the intentional use of elif, since we want to ignore channels > 1
        elif channel == 1:
            offset = 64 if speed > 0 else 0
            channel = self.channels.get('right') * 128
            msg = offset + channel + abs(round(62 / 1000 * speed))
            self.serial.write(bytes([msg]))

    def move(self, speed: list[int]):
        # Left side
        if speed[0] is not None:
            offset = 64 if speed[0] > 0 else 0
            channel = self.channels.get('left') * 128
            msg = offset + channel + abs(round(62 / 1000 * speed[0]))
            self.serial.write(bytes([msg]))
        # Right side
        if speed[1] is not None:
            offset = 64 if speed[1] > 0 else 0
            channel = self.channels.get('right') * 128
            msg = offset + channel + abs(round(62 / 1000 * speed[1]))
            self.serial.write(bytes([msg]))

    def stop(self):
        self.serial.write(bytes([0]))

    def close(self):
        self.serial.close()

