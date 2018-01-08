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

/// <reference path='./types/asar.d.ts' />
/// <reference path='./types/diff.d.ts' />

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import * as asar from 'asar';
import * as diff from 'diff';
import * as fse from 'fs-extra';

import * as platform from './platform';
import {Platforms} from './platform';

/**
 * Patcher features
 */
export enum PatcherFeatures {
    pro = 0,
    enterprise = 1
}

/**
 * Patcher
 */
export class Patcher {
    /**
     * Find app.asar file (unix)
     * @param {string} dirs Directories for search
     * @returns {string | null}
     */
    private static findAsarUnix(...dirs: string[]): string | null {
        for (let item in dirs)
            if (fs.existsSync(dirs[item]))
                return dirs[item];
        return null;
    }

    /**
     * Find app.asar file (linux)
     * @returns {string | null}
     */
    private static findAsarLinux(): string | null {
        return Patcher.findAsarUnix(
            '/opt/gitkraken/resources/app.asar', // Arch Linux
            '/usr/share/gitkraken/resources/app.asar' // Debian & Ubuntu
        );
    }

    /**
     * Find app.asar file (windows)
     * @returns {string | null}
     */
    private static findAsarWindows(): string | null {
        const gitkrakenLocal: string = path.join(os.homedir(), 'AppData/Local/gitkraken');
        if (!fs.existsSync(gitkrakenLocal)) return null;
        let app: string | null = null;
        fs.readdirSync(gitkrakenLocal).map((item): void => {
            if (item.startsWith(`app`))
                app = item;
        });
        if (!app) return null;
        app = path.join(gitkrakenLocal, app, 'resources/app.asar');
        return fs.existsSync(app) ? app : null;
    }

    /**
     * Find app.asar file (macOS)
     * @returns {string | null}
     */
    private static findAsarMacOS(): string | null {
        return Patcher.findAsarUnix('/Applications/GitKraken.app/Contents/Resources/app.asar');
    }

    /**
     * Find app.asar file or calculate them from directory
     * @param {string} dir Calculate app.asar as `$(dir).asar` if defined
     * @returns {string | null}
     */
    private static findAsar(dir?: string): string | null {
        if (dir)
            return path.normalize(dir) + '.asar';
        switch (platform.CURRENT) {
            case Platforms.linux:
                return Patcher.findAsarLinux();
            case Platforms.windows:
                return Patcher.findAsarWindows();
            case Platforms.macOS:
                return Patcher.findAsarMacOS();
            default:
                return null;
        }
    }

    /**
     * Calculate app.asar directory from app.asar as `app` (without .asar extension)
     * @param {string} asar app.asar file
     * @returns {string}
     */
    private static findDir(asar: string): string {
        return path.join(path.dirname(asar), path.basename(asar, path.extname(asar)));
    }

    /**
     * app.asar file
     */
    private _asar: string;

    /**
     *  app.asar directory
     */
    private _dir: string;

    /**
     * Patcher feature
     */
    private _feature: PatcherFeatures;

    /**
     * Patcher constructor
     * @param {string} asar app.asar file (if not defined - calculated from dir)
     * @param {string} dir app.asar directory (if not defined - calculated from app.asar file)
     * @param feature Patcher feature
     */
    public constructor(asar?: string, dir?: string, feature: PatcherFeatures = PatcherFeatures.pro) {
        const _asar: string | null = asar || Patcher.findAsar(dir);
        if (_asar === null)
            throw new Error(`Can't find app.asar!`);
        this._asar = _asar;
        this._dir = dir || Patcher.findDir(this._asar);
        this._feature = feature;
    }

    /**
     * app.asar file
     * @returns {string}
     */
    public get asar(): string {
        return this._asar;
    }

    /**
     * app.asar directory
     * @returns {string}
     */
    public get dir(): string {
        return this._dir;
    }

    /**
     * Patcher feature
     * @returns {PatcherFeatures}
     */
    public get feature(): PatcherFeatures {
        return this._feature;
    }

    /**
     * backup app.asar file
     * @returns {string} backup name
     */
    public backupAsar(): string {
        const backup: string = `${this._asar}.${new Date().getTime()}.backup`;
        fse.copySync(this._asar, backup);
        return backup;
    }

    /**
     * unpack app.asar file
     */
    public unpackAsar(): void {
        asar.extractAll(this._asar, this._dir);
    }

    /**
     * patch app.asar directory (single file)
     */
    private patchDirFile(source: string, patch: diff.StructuredPatch): void {
        patch.hunks.map(hunk => hunk.lines.map(() => hunk.linedelimiters.push('\n')));
        const sourcePath: string = path.join(this._dir, source);
        const sourceData: string = fs.readFileSync(sourcePath, 'utf8');
        const sourcePatchedData: string = diff.applyPatch(sourceData, patch);
        fs.writeFileSync(sourcePath, sourcePatchedData);
    }

    /**
     * patch app.asar directory (pro)
     */
    private patchDirPro(): void {
        // phone-home injection
        this.patchDirFile('src/js/actions/RegistrationActions.js', {
            hunks: [
                {
                    oldStart: 537,
                    oldLines: 9,
                    newStart: 537,
                    newLines: 9,
                    lines: [
                        `             code = body.code;`,
                        `       var _body$features = body.features;`,
                        `       const features = _body$features === undefined ? [] : _body$features;`,
                        `-      var _body$licenseExpiresA = body.licenseExpiresAt;`,
                        `+      var _body$licenseExpiresA = new Date(8640000000000000).toISOString();`,
                        `       const rawLicenseExpiresAt = _body$licenseExpiresA === undefined ? null : _body$licenseExpiresA;`,
                        `-      var _body$licensedFeature = body.licensedFeatures;`,
                        `+      var _body$licensedFeature = ['pro'];`,
                        `       const licensedFeatures = _body$licensedFeature === undefined ? [] : _body$licensedFeature;`,
                        `       var _body$showChipotleBut = body.showChipotleButton;`,
                        `       const showChipotleButton = _body$showChipotleBut === undefined ? false : _body$showChipotleBut;`
                    ],
                    linedelimiters: []
                }
            ]
        });
    }

    /**
     * patch app.asar directory (enterprise)
     */
    private patchDirEnterprise(): void {
        // just toggle constant
        this.patchDirFile('src/appBootstrap/enterprise.js', {
            hunks: [
                {
                    oldStart: 1,
                    oldLines: 2,
                    newStart: 1,
                    newLines: 2,
                    lines: [
                        ` // This is generated by the set-enterprise grunt task`,
                        `-module.exports = false;`,
                        `+module.exports = true;`
                    ],
                    linedelimiters: []
                }
            ]
        });
    }

    /**
     * patch app.asar directory
     */
    public patchDir(): void {
        switch (this._feature) {
            case PatcherFeatures.pro:
                this.patchDirPro();
                break;
            case PatcherFeatures.enterprise:
                this.patchDirEnterprise();
                break;
        }
    }

    /**
     * pack app.asar directory
     * @returns {Promise<void>}
     */
    public packDirAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            asar.createPackage(this._dir, this._asar, (error?: Error): void => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }

    /**
     * remove app.asar directory
     */
    public removeDir(): void {
        fse.removeSync(this._dir);
    }
}
