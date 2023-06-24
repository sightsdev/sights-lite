from dataclasses import fields
import json
import tomllib as toml
import asyncio
from fastapi import FastAPI
from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.requests import Request
from starlette.responses import Response
from starlette.exceptions import HTTPException
from starlette.middleware import Middleware
from starlette.responses import JSONResponse
from pydantic import BaseModel
from typing import Union

from components.camera import CameraComponent, CameraParameters
from components.drive import DummyConnection, SimpleSerialConnection
from components.sensor import Sensor, SensorConfig
from components.state import State

from sensors.mlx90614 import MLX90614, MLX90614Config
from sensors.random_sensor import RandomSensor, RandomSensorConfig
from components.arm import Arm, ArmServoConfig, ArmConfig

sensorRegister = {
    "random": (RandomSensor, RandomSensorConfig),
    "mlx90614": (MLX90614, MLX90614Config)
}


def load_state() -> State:
    state: State = State()
    with open("settings.toml", mode="rb") as fp:
        config = toml.load(fp)
    
    print(json.dumps(config, indent=4))

    if config["drive"]["enabled"]:
        state.drive = SimpleSerialConnection(
            port=config["drive"]["connection"]["port"],
            baudrate=config["drive"]["connection"]["baudrate"],
            channels=config["drive"]["channels"]
        )
    else:
        state.drive = DummyConnection()

    for label, index in config["camera"]["devices"].items():
        camera_config = CameraParameters(
            id=label, 
            width=config["camera"]["width"], 
            height=config["camera"]["height"], 
            framerate=config["camera"]["framerate"], 
            source=index)
        state.cameras[label] = camera_config

    state.arm = Arm(ArmConfig(**config["arm"]))

    for label in config["sensors"]:
        # Load sensor configuration as a dict
        conf: dict = config["sensors"][label]
        # Find the respective Sensor and SensorConfig class from the register
        sensor_class, sensor_config_class = sensorRegister[conf["type"]]
        # Create the SensorConfig object containing the configuration settings for the sensor
        conf_obj: SensorConfig = sensor_config_class(**conf)
        # Create the Sensor object
        state.sensors[label] = sensor_class(conf_obj)
        # Run initial configuration for the sensor
        state.sensors[label].configure()
        print(f"Created sensor of type {conf['type']}")

    return state     


state: State = load_state()
camera_component = CameraComponent(state)

routes = [
    Mount("/camera/{id:str}", camera_component.stream),
    #Route("/camera/list", endpoint=list_cameras),
    #Route('/drive/', drive, methods=["POST"]),
    #Route('/sensor/{id:str}', sensor, methods=["GET"])
]

app = FastAPI(debug=True, routes=routes)
#app = Starlette(debug=True, routes=routes)
app.state = state


@app.get("/cameras/list")
def list_cameras():
    return CameraComponent.list_all()

class MoveMotorParams(BaseModel):
    channel: int
    speed: int

@app.post("/drive/")
async def drive(params: MoveMotorParams):
    app.state.drive.move_motor(channel=params.channel, speed=params.speed)

class MoveParams(BaseModel):
    speed: list[int]

@app.post("/drive/")
async def drive(params: MoveParams):
    app.state.drive.move(params.speed)

@app.get("/sensor/list/")
async def sensor():
    return list(app.state.sensors.keys())

@app.get("/sensor/{sensor_id}")
async def sensor(sensor_id: str):
    if sensor_id not in app.state.sensors.keys():
        raise HTTPException(404, f"Sensor with ID of {sensor_id} not found")
    return app.state.sensors[sensor_id].read()

class ArmParams(BaseModel):
    direction: bool
    amount: float | None = None

@app.post("/arm/{servo_name}")
async def drive(servo_name: str, params: ArmParams):
    app.state.Arm.increment_angle(servo_name, params.direction, params.amount)
