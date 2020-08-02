const { series, watch } = require('gulp');
const { src, dest } = require('gulp');

function runExpress(cb) {
    // place code for your default task here
    const express = require('express')
    const app = express()

    app.use(express.static('static'))

    app.set('view engine', 'pug')

    app.get('/', function(req, res) {
        res.render('index')
    })

    app.listen(3000, function() {
        console.log('Successful start, go to localhost:3000')
    })
    cb();
}

function compileSass() {
    var gulp = require('gulp');
    var sass = require('gulp-sass');

    sass.compiler = require('node-sass');

    return gulp.src('./src/scss/custom/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static/css'));
}

function runAutoprefixer() {
    var gulp = require('gulp');
    const autoprefixer = require('gulp-autoprefixer');

    return gulp.src('./static/css/*.css')
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('./static/css'))
}

function buildHTML() {
    var gulp = require('gulp')
    var pug = require ('gulp-pug')

    return gulp.src('src/pug/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('static'));
}

function watchAll() {
    watch('src/pug/*.pug', buildHTML);
    watch('src/scss/custom/*.scss', series(compileSass, runAutoprefixer));
}

exports.default = series(compileSass, runAutoprefixer, buildHTML, runExpress, watchAll)
    