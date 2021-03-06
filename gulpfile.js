var gulp = require('gulp'),
	sass = require('gulp-sass');
	
gulp.task('sass', function () {
	return gulp.src('./src/grafiti.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/css'));
});
gulp.task('sass:watch', function () {
	gulp.watch('./src/*.scss', ['sass']);
});