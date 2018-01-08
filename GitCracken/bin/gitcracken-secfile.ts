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

import {Logo, AppId, SecFile} from '../src';
import chalk from "chalk";

program
    .description('read GitKraken secFile')
    .option('--appid [id]', `appId for secFile decrypt`, AppId.read())
    .parse(process.argv);

Logo.print();

program.args.map((item): void => {
    console.log(`${chalk.green('==>')} ${chalk.bold(item)}`);
    const secFile: SecFile = new SecFile(item, program.appid);
    secFile.read();
    console.log(JSON.stringify(secFile.data, null, 2));
});
