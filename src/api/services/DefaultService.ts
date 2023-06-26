/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArmParams } from '../models/ArmParams';
import type { MoveParams } from '../models/MoveParams';
import type { SettingsBody } from '../models/SettingsBody';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List Cameras
     * @returns string Successful Response
     * @throws ApiError
     */
    public listCamerasCameraGet(): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/camera/',
        });
    }

    /**
     * List Available Cameras
     * @returns number Successful Response
     * @throws ApiError
     */
    public listAvailableCamerasCamerasListGet(): CancelablePromise<Array<number>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cameras/list',
        });
    }

    /**
     * Drive
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public driveDrivePost(
        requestBody: MoveParams,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/drive/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Sensor List
     * @returns string Successful Response
     * @throws ApiError
     */
    public sensorListSensorListGet(): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/sensor/list/',
        });
    }

    /**
     * Sensor
     * @param sensorId
     * @returns any Successful Response
     * @throws ApiError
     */
    public sensorSensorSensorIdGet(
        sensorId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/sensor/{sensor_id}',
            path: {
                'sensor_id': sensorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Arm Move
     * @param servoName
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public armMoveArmServoServoNamePost(
        servoName: string,
        requestBody: ArmParams,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/arm/servo/{servo_name}',
            path: {
                'servo_name': servoName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Arm Home
     * @returns any Successful Response
     * @throws ApiError
     */
    public armHomeArmHomePost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/arm/home',
        });
    }

    /**
     * Power
     * @returns any Successful Response
     * @throws ApiError
     */
    public powerPoweroffPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/poweroff',
        });
    }

    /**
     * Reboot
     * @returns any Successful Response
     * @throws ApiError
     */
    public rebootRebootPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/reboot',
        });
    }

    /**
     * Reload
     * @returns any Successful Response
     * @throws ApiError
     */
    public reloadReloadPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/reload',
        });
    }

    /**
     * Get Settings
     * @returns string Successful Response
     * @throws ApiError
     */
    public getSettingsSettingsGet(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/settings',
        });
    }

    /**
     * Set Settings
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public setSettingsSettingsPost(
        requestBody: SettingsBody,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
