
/* @Description: 项目文件处理打包
 * @Author: Cphayim 
 * @Date: 2017-03-22 20:39:02 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-03-22 21:04:49
 */

const gulp = require('gulp');

// js 语法验证模块
const jshint = require('gulp-jshint'),
    // js 压缩模块
    uglify = require('gulp-uglify'),
    // 文件合并模块
    concat = require('gulp-concat'),
    // 重命名模块
    rename = require('gulp-rename'),
    // js 编译器 (ES6 -> ES5)
    babel = require('gulp-babel'),
    // css 压缩模块
    minicss = require('gulp-minify-css');

// JS 预处理
// es6 -> es5 -> 压缩
gulp.task('js', () => {
    return gulp.src('mls_app/dev/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        .pipe(uglify({
            mangle: true, // 混淆所有变量名
            // mangle:false // 不混淆所有变量名
            // mangle:{except:['name','age']} // 排除(不混淆)的变量名
            preserveComments: 'license' // 保留所有注释
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('mls_app/dest/js'))
    // .pipe(concat('app.min.js'))
    // .pipe(gulp.dest('build/js'));
});



// 前端 css 压缩
gulp.task('css', () => {
    return gulp.src(['mls_app/dest/css/*.css','!mls_app/dest/css/*.min.css'])
        .pipe(minicss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('mls_app/dest/css'));
});

gulp.task('default', () => {
    // app 前端开发目录
    gulp.watch('mls_app/dev/js/*.js', ['js']);
    // gulp.watch('mls_app/dest/css/*.css', ['css']);
});