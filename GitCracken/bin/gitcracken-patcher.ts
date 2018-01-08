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

import * as program from 'commander';
import * as emoji from 'node-emoji';
import chalk from 'chalk';

import {Logo, Patcher, PatcherFeatures} from '../src';
import * as platform from '../src/platform';
import {Platforms} from '../src/platform';

program
    .description('GitKraken patcher')
    .option('--asar [file]', `app.asar file`)
    .option('--dir [dir]', `app.asar directory`)
    .option('--feature [value]', 'patcher feature', /^(pro|enterprise)$/i, 'pro')
    .parse(process.argv);

const enum Actions {
    backup = 1,
    unpack = 2,
    patch = 3,
    pack = 4,
    remove = 5
}

let actions: Actions[] = [];

program.args.map((item: string): void => {
    switch (item.toLowerCase()) {
        case 'backup':
            actions.push(Actions.backup);
            break;
        case 'unpack':
            actions.push(Actions.unpack);
            break;
        case 'patch':
            actions.push(Actions.patch);
            break;
        case 'pack':
            actions.push(Actions.pack);
            break;
        case 'remove':
            actions.push(Actions.remove);
            break;
    }
});

if (actions.length == 0) {
    switch (platform.CURRENT) {
        case Platforms.linux:
        case Platforms.macOS:
            actions.push(Actions.backup, Actions.unpack, Actions.patch, Actions.pack, Actions.remove);
            break;
        case Platforms.windows:
            actions.push(Actions.backup, Actions.unpack, Actions.patch);
            break;
    }
}

(async (): Promise<void> => {
    Logo.print();
    const patcher = new Patcher(
        program.asar,
        program.dir,
        PatcherFeatures[program.feature === 'pro' ? 'pro' : 'enterprise']
    );
    for (let item in actions)
        switch (actions[item]) {
            case Actions.backup:
                console.log(`${chalk.green('==>')} ${emoji.get('package')} Backup ${chalk.green(patcher.asar)} ➔ ${chalk.green(patcher.backupAsar())}`);
                break;
            case Actions.unpack: {
                console.log(`${chalk.green('==>')} ${emoji.get('unlock')} Unpack ${chalk.green(patcher.asar)} ➔ ${chalk.green(patcher.dir)}`);
                patcher.unpackAsar();
            }
                break;
            case Actions.patch: {
                console.log(`${chalk.green('==>')} ${emoji.get('hammer')} Patch ${chalk.green(patcher.dir)} with ${chalk.green(PatcherFeatures[patcher.feature])} feature`);
                patcher.patchDir();
            }
                break;
            case Actions.pack: {
                console.log(`${chalk.green('==>')} ${emoji.get('lock')} Pack ${chalk.green(patcher.dir)} ➔ ${chalk.green(patcher.asar)}`);
                await patcher.packDirAsync();
            }
                break;
            case Actions.remove: {
                console.log(`${chalk.green('==>')} ${emoji.get('fire')} Remove ${chalk.green(patcher.dir)}`);
                patcher.removeDir();
            }
                break;
        }
    console.log(`${chalk.green('==>')} ${emoji.get('ok_hand')} Patching done!`);
})();
