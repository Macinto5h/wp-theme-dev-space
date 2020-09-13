const {series, watch} = require("gulp");

function runExpress(cb) {
	// place code for your default task here
	const express = require("express");
	const app = express();

	app.use(express.static("static"));

	app.set("view engine", "pug");

	app.get(
		"/",
		function(req, res) {
			res.render("index");
		},
	);

	app.listen(
		3_000,
		function() {
			console.log("Successful start, go to localhost:3000");
		},
	);
	cb();
}

function compileSass() {
	let gulp = require("gulp");
	let sass = require("gulp-sass");

	sass.compiler = require("node-sass");

	return gulp.src("./src/assets/scss/custom/style.scss").pipe(
		sass().on("error", sass.logError),
	).pipe(gulp.dest("./static/assets/css")).pipe(gulp.dest("./theme"));
}

function runAutoprefixer() {
	let gulp = require("gulp");
	const autoprefixer = require("gulp-autoprefixer");

	return gulp.src("./static/assets/css/*.css").pipe(
		autoprefixer({
			cascade: false,
		}),
	).pipe(gulp.dest("./static/assets/css"));
}

function concatJS() {
	let gulp = require("gulp");
	let concat = require("gulp-concat");

	return gulp.src("./src/assets/js/**/*.js").pipe(concat("scripts.js")).pipe(
		gulp.dest("./static/assets/js"),
	);
}

function babelJS() {
	let gulp = require("gulp");
	let babel = require("gulp-babel");

	return gulp.src("./static/assets/js/scripts.js").pipe(
		babel({
			presets: ["@babel/env"],
		}),
	).pipe(gulp.dest("./static/assets/js")).pipe(gulp.dest("./theme/assets/js"));
}

function buildHTML() {
	let gulp = require("gulp");
	let pug = require("gulp-pug");

	return gulp.src("src/views/*.pug").pipe(pug()).pipe(gulp.dest("static"));
}

function watchAll() {
	let browserSync = require("browser-sync").create();

	browserSync.init({
		server: "./static",
	});

	watch("src/views/**/*.pug", buildHTML);
	watch("src/assets/scss/**/*.scss", series(compileSass, runAutoprefixer));
	watch("static/*.html").on("change", browserSync.reload);
	watch("static/assets/css/style.css").on("change", browserSync.reload);
}

exports.default = series(
	compileSass,
	runAutoprefixer,
	concatJS,
	babelJS,
	buildHTML,
	runExpress,
	watchAll,
);
