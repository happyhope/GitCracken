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

import chalk from 'chalk';

/**
 * Platforms
 */
export enum Platforms {
    unknown = 0,
    linux = 1,
    windows = 2,
    macOS = 3
}

/**
 * Current platform
 * @type {Platforms}
 */
export const CURRENT: Platforms = ((): Platforms => {
    if (process.platform === 'linux')
        return Platforms.linux;
    if (process.platform === 'win32')
        return Platforms.windows;
    if (process.platform === 'darwin')
        return Platforms.macOS;
    return Platforms.unknown;
})();

if (CURRENT === Platforms.unknown) {
    console.log(`We Are Deeply Sorry! Your OS ${chalk.red.bold(process.platform)} is not supported!`);
    process.exit(1);
}
