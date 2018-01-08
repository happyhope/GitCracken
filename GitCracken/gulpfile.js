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

'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var sourceMaps = require('gulp-sourcemaps');

function task(src, dest) {
    return gulp.src(src)
        .pipe(sourceMaps.init())
        .pipe(ts.createProject('tsconfig.json')())
        .js.pipe(babel())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(dest));
}

gulp.task('bin', function () {
    return task('bin/*.ts', 'dist/bin');
});

gulp.task('src', function () {
    return task('src/*.ts', 'dist/src');
});

gulp.task('package.json', function () {
    return gulp.src('package.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['bin', 'src', 'package.json']);

gulp.task('watch', function () {
    gulp.watch('bin/*.ts', ['bin']);
    gulp.watch('src/*.ts', ['src']);
    gulp.watch('package.json', ['package.json']);
});
