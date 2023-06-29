/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MoveArmServoParams } from '../models/MoveArmServoParams';
import type { MoveMotorsParams } from '../models/MoveMotorsParams';
import type { PostSettingsBody } from '../models/PostSettingsBody';
import type { SensorConfig } from '../models/SensorConfig';

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
    public listAvailableCamerasCameraAllGet(): CancelablePromise<Array<number>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/camera/all',
        });
    }

    /**
     * Drive
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public driveDrivePost(
        requestBody: MoveMotorsParams,
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
     * Drive Stop
     * @returns any Successful Response
     * @throws ApiError
     */
    public driveStopDriveStopPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/drive/stop',
        });
    }

    /**
     * Sensor List
     * @returns SensorConfig Successful Response
     * @throws ApiError
     */
    public sensorListSensorListGet(): CancelablePromise<Record<string, SensorConfig>> {
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
        requestBody: MoveArmServoParams,
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
        requestBody: PostSettingsBody,
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
