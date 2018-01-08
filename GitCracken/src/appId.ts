/*****************************************************************************
 * GitCracken - GitKraken utils for non-commercial use                       *
 * Copyright (C) 2017  https://github.com/KillWolfVlad                       *
 *                                                                           *
 * This file is part of GitCracken.                                          *
 *                                                                           *
 * GitCracken is free software: you can redistribute it and/or modify        *
 * it under the terms of the GNU General Public License as published by      *
 * the Free Software Foundation, either version 3 of the License, or         *
 * (at your option) any later version.                                       *
 *                                                                           *
 * GitCracken is distributed in the hope that it will be useful,             *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 * GNU General Public License for more details.                              *
 *                                                                           *
 * You should have received a copy of the GNU General Public License         *
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.     *
 *****************************************************************************/

/// <reference path='./types/getmac.d.ts' />
/// <reference path='./types/jsonfile.d.ts' />

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';

import * as uuid from 'uuid';
import {getMac} from 'getmac';
import * as jsonFile from 'jsonfile';

import * as platform from './platform';
import {Platforms} from './platform';

/**
 * AppId
 */
export class AppId {
    /**
     * Generate AppId as sha1sum of specific mac address (or other any string e.g. uuid/v4)
     * @param {string} mac
     * @returns {string}
     */
    public static generate(mac: string): string {
        return crypto.createHash('sha1')
            .update(mac, 'utf8')
            .digest('hex');
    }

    /**
     * Generate AppId as sha1sum of your mac address (or as uuid/v4 if you don't have mac)
     * @returns {Promise<string>}
     */
    public static generateAsync(): Promise<string> {
        return new Promise((resolve) => {
            getMac((error: Error | null, mac: string): void => {
                if (error)
                    mac = uuid.v4();
                resolve(AppId.generate(mac));
            });
        });
    }

    /**
     * Default config path
     * @returns {string | null}
     */
    private static configPath(): string {
        switch (platform.CURRENT) {
            case Platforms.linux:
            case Platforms.macOS:
                return path.join(os.homedir(), '.gitkraken/config');
            case Platforms.windows:
                return path.join(os.homedir(), 'AppData/Roaming/.gitkraken/config');
            default:
                return '';
        }
    }

    /**
     * Read appId from GitKraken config
     * @param {string} config Path to config (if not defined - use default path)
     * @returns {string | null}
     */
    public static read(config: string = AppId.configPath()): string | null {
        if (!config || !fs.existsSync(config)) return null;
        return jsonFile.readFileSync(config).appId;
    }
}
