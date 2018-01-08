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
import chalk from 'chalk';

import {Logo, AppId} from '../src';

program
    .description('generate GitKraken appId')
    .option('--mac [value]', `use specific mac address (or other any string)`)
    .parse(process.argv);

(async (): Promise<void> => {
    Logo.print();
    console.log(`${chalk.green('==>')} Generated appId ${chalk.green(
        program.mac ? AppId.generate(program.mac) : await AppId.generateAsync())}`);
})();
