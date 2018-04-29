var gulp = require("gulp");
var ts = require("gulp-typescript");
var watch = require("gulp-watch");
var browserify = require("browserify");
var runSequence = require('run-sequence');
var less = require("gulp-less");
var tsProject = ts.createProject("./tsconfig.json");
var connect = require("gulp-connect");
var source = require("vinyl-source-stream");

const wwwrootPath = "./server/wwwroot/";
const publicPath = "./server/public/";
const stylesPath = `${wwwrootPath}styles/`;

/*
compile typescript
*/
gulp.task("typescript", function () {
    var tsResult = gulp.src(`${wwwrootPath}**/*.ts`).pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(wwwrootPath));
});


/*
Web server to test app
*/
gulp.task("webserver", function () {
    connect.server({
        livereload: false,
        root: [".", wwwrootPath]
    });
});


/*
compile less files
*/
gulp.task("less", function () {
    gulp.src(`${stylesPath}app.less`)
        .pipe(less())
        .pipe(gulp.dest(publicPath));
});


/*
browserify
*/
gulp.task("browserify", function (stream) {
    return browserify(`${wwwrootPath}/ilBudgetto.js`).bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest(publicPath));
});

/*
Watch typescript and less
*/
gulp.task("watch", function () {
    gulp.watch(`${stylesPath}**/*.less`, ["less"]);
    gulp.watch(`${wwwrootPath}**/*.js`, () => {
        try {
            gulp.run("browserify");
        } catch (e) {
            console.log(`Something wrong with Browserify: ${ e.toString() }`)
        }
    });
})

/*
default task
*/
gulp.task("default", ["less", "typescript", "browserify", "webserver", "watch"]);