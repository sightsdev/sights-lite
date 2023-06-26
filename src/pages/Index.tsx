import React, {useState} from 'react';
import {AppClient} from "../api";
import useApi from "../useApi";
import {useHotkeys} from "react-hotkeys-hook";
import {Loader} from "../components/Loader";
import {Key} from 'ts-key-enum';
import {Keys} from "react-hotkeys-hook/dist/types";
import {SelectableCard} from "../components/SelectableCard";

function Index() {
    const client = new AppClient({
        BASE: 'http://localhost:8000',
    });
    const {loading, data} = useApi(client.default.listCamerasCameraGet());
    const [speed, setSpeed] = useState<number>(3);

    const useDriveHotkey = (key: Keys, left: number, right: number) => {
        useHotkeys(key, () => client.default.driveDrivePost({speed: [speed * left, speed * right]}))
        useHotkeys(key, () => client.default.driveDrivePost({speed: [0, 0]}), {keydown: false, keyup: true});
    }
    useDriveHotkey(['w', Key.ArrowUp], 10, 10)
    useDriveHotkey(['a', Key.ArrowLeft], -10, 10)
    useDriveHotkey(['s', Key.ArrowDown], -10, -10)
    useDriveHotkey(['d', Key.ArrowRight], 10, -10)
    useHotkeys('=', () => setSpeed(prev => Math.min(8, prev + 1)))
    useHotkeys('-', () => setSpeed(prev => Math.max(1, prev - 1)))

    useHotkeys('num1', () => client.default.armMoveArmServoServoNamePost("SHOULDER", {direction: true}));
    useHotkeys('num4', () => client.default.armMoveArmServoServoNamePost("SHOULDER", {direction: false}));
    useHotkeys('num2', () => client.default.armMoveArmServoServoNamePost("ELBOW", {direction: true}));
    useHotkeys('num5', () => client.default.armMoveArmServoServoNamePost("ELBOW", {direction: false}));
    useHotkeys('num3', () => client.default.armMoveArmServoServoNamePost("WRISTUD", {direction: true}));
    useHotkeys('num6', () => client.default.armMoveArmServoServoNamePost("WRISTUD", {direction: false}));
    useHotkeys('num7', () => client.default.armMoveArmServoServoNamePost("WRISTLR", {direction: true}));
    useHotkeys('num8', () => client.default.armMoveArmServoServoNamePost("WRISTLR", {direction: false}));
    useHotkeys(Key.Add, () => client.default.armMoveArmServoServoNamePost("CLAW", {direction: true}));
    useHotkeys(Key.Subtract, () => client.default.armMoveArmServoServoNamePost("CLAW", {direction: false}));
    useHotkeys('num0', () => client.default.armHomeArmHomePost());

    if (loading || !data) return <Loader/>

    return (
        <div className="container mx-auto mt-6">
            <div className="grid grid-cols-3 gap-4">
                <SelectableCard id={1} client={client} state={{speed, cameras: data}}></SelectableCard>
                <SelectableCard id={2} client={client} state={{speed, cameras: data}}></SelectableCard>
                <SelectableCard id={3} client={client} state={{speed, cameras: data}}></SelectableCard>
                <SelectableCard id={4} client={client} state={{speed, cameras: data}}></SelectableCard>
                <SelectableCard id={5} client={client} state={{speed, cameras: data}}></SelectableCard>
                <SelectableCard id={6} client={client} state={{speed, cameras: data}}></SelectableCard>
            </div>
        </div>
    )
}

export default Index;
