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

import * as crypto from 'crypto';
import {Decipher} from 'crypto';

import * as fse from 'fs-extra';

/**
 * Password protected file with JSON content
 * This class is fork of https://github.com/maxkorp/secure-storage library
 */
export class SecFile {
    /**
     * File name
     */
    private _fileName: string;

    /**
     * Password
     */
    private _password: string;

    /**
     * Algorithm
     */
    private _algorithm: string;

    /**
     * Data
     */
    private _data: object;

    /**
     * Password protected file with JSON content constructor
     * @param {string} fileName File name
     * @param {string} password Password
     * @param {string} algorithm Algorithm
     */
    public constructor(fileName: string, password: string, algorithm: string = 'aes256') {
        this._fileName = fileName;
        this._password = password;
        this._algorithm = algorithm;
    }

    /**
     * File name
     * @returns {string}
     */
    public get fileName(): string {
        return this._fileName;
    }

    /**
     * Password
     * @returns {string}
     */
    public get password(): string {
        return this._password;
    }

    /**
     * Algorithm
     * @returns {string}
     */
    public get algorithm(): string {
        return this._algorithm;
    }

    /**
     * Data
     * @returns {object}
     */
    public get data(): object {
        return this._data;
    }

    /**
     * Read data from disk
     */
    public read(): void {
        const decipher: Decipher = crypto.createDecipher(this._algorithm, this._password);
        this._data = JSON.parse(Buffer.concat([
            decipher.update(fse.readFileSync(this._fileName)),
            decipher.final()
        ]).toString('utf8'));
    }
}
