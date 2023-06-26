import json
import shutil
import tomllib as toml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException
from pydantic import BaseModel

from components.camera import CameraComponent, CameraParameters
from components.drive import DummyConnection, SimpleSerialConnection
from components.sensor import SensorConfig
from components.state import State
from components.arm import Arm, ArmConfig

from sensors.mlx90614 import MLX90614Sensor, MLX90614SensorConfig
from sensors.random_sensor import RandomSensor, RandomSensorConfig
from sensors.system_info import SystemInfo, SystemInfoConfig
from sensors.sgp30 import SGP30SensorConfig, SGP30Sensor
from sensors.mlx90640 import MLX90640Sensor, MLX90640SensorConfig
from sensors.mlx90641 import MLX90641Sensor, MLX90641SensorConfig

sensorRegister = {
    "mlx90614": (MLX90614Sensor, MLX90614SensorConfig),
    "mlx90640": (MLX90640Sensor, MLX90640SensorConfig),
    "mlx90641": (MLX90641Sensor, MLX90641SensorConfig),
    "random": (RandomSensor, RandomSensorConfig),
    "sgp30": (SGP30Sensor, SGP30SensorConfig),
    "system_info": (SystemInfo, SystemInfoConfig)
}


def load_state() -> State:
    new_state: State = State()
    with open("settings.toml", mode="rb") as fp:
        config = toml.load(fp)
    
    #print(json.dumps(config, indent=4))

    if config["drive"]["enabled"]:
        new_state.drive = SimpleSerialConnection(
            port=config["drive"]["connection"]["port"],
            baudrate=config["drive"]["connection"]["baudrate"],
            channels=config["drive"]["channels"]
        )
    else:
        new_state.drive = DummyConnection()

    for label, index in config["camera"]["devices"].items():
        camera_config = CameraParameters(
            id=label, 
            width=config["camera"]["width"], 
            height=config["camera"]["height"], 
            framerate=config["camera"]["framerate"], 
            source=index)
        new_state.cameras[label] = camera_config

    new_state.arm = Arm(ArmConfig(**config["arm"]))

    for label in config["sensors"]:
        # Load sensor configuration as a dict
        conf: dict = config["sensors"][label]
        # Find the respective Sensor and SensorConfig class from the register
        sensor_class, sensor_config_class = sensorRegister[conf["type"]]
        # Create the SensorConfig object containing the configuration settings for the sensor
        conf_obj: SensorConfig = sensor_config_class(**conf)
        # Create the Sensor object
        new_state.sensors[label] = sensor_class(conf_obj)
        # Run initial configuration for the sensor
        new_state.sensors[label].configure()
        print(f"Created sensor of type {conf['type']}")

    return new_state


app = FastAPI(debug=True)
app.state = load_state()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/camera/{id:str}", CameraComponent.stream)

@app.get("/camera/")
def list_cameras() -> list[str]:
    return list(app.state.cameras.keys())

@app.get("/cameras/list")
def list_available_cameras() -> list[int]:
    return CameraComponent.list_available()

# class MoveMotorParams(BaseModel):
#     channel: int
#     speed: int
#
# @app.post("/drive/")
# async def drive(params: MoveMotorParams):
#     app.state.drive.move_motor(channel=params.channel, speed=params.speed)

class MoveParams(BaseModel):
    speed: list[int]

@app.post("/drive/")
async def drive(params: MoveParams):
    #print(params)
    app.state.drive.move(params.speed)

@app.get("/sensor/list/")
async def sensor_list() -> list[str]:
    return list(app.state.sensors.keys())

@app.get("/sensor/{sensor_id}")
async def sensor(sensor_id: str):
    if sensor_id not in app.state.sensors.keys():
        raise HTTPException(404, f"Sensor with ID of {sensor_id} not found")
    #print("New request for " + sensor_id)
    return app.state.sensors[sensor_id].read()

class ArmParams(BaseModel):
    direction: bool
    amount: float | None = None

@app.post("/arm/servo/{servo_name}")
async def arm_move(servo_name: str, params: ArmParams):
    app.state.arm.increment_angle(servo_name, params.direction, params.amount)

@app.post("/arm/home")
async def arm_home():
    app.state.arm.home()


@app.get("/settings")
async def get_settings() -> str:
    with open("settings.toml", mode="r") as fp:
        return fp.read()

class SettingsBody(BaseModel):
    content: str
@app.post("/settings")
async def set_settings(body: SettingsBody):
    shutil.copy2('settings.toml', 'settings.toml.bak')
    with open("settings.toml", mode="w") as fp:
        fp.write(body.content)
    app.state.drive.close()
    app.state = load_state()

