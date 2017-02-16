var path = require('path');
var webpackConfig = require('./webpack-config')
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var sass = require('metalsmith-sass');
var webpack = require('metalsmith-webpack');
var ignore = require('metalsmith-ignore');
var moveUp = require('metalsmith-move-up');
var templates = require('metalsmith-layouts');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var browserSync = require('metalsmith-browser-sync');
var htmlMinifier = require('metalsmith-html-minifier');
var imagemin = require('metalsmith-imagemin');
var sitemap = require('metalsmith-mapsite');
// var watch = require('metalsmith-watch');
// var bs = require('browser-sync').create();


Metalsmith(__dirname)
  .use(ignore([
    'scripts/**/*.js'
  ]))
  .use(webpack(webpackConfig))
  .use(browserSync({
    server: './build',
    files: [
      'src/styles/**/*.scss',
      'src/scripts/**/*.js',
      'src/**/*.md',
      'templates/**/*.hbs'
    ]
  }))
  .use(collections({
    projects: {
      pattern: 'content/projects/*.md',
      sortBy: 'order'
    }
  }))
  .use(permalinks({
    pattern: '/:title'
  }))
  .use(sass({
    outputStyle: 'compressed',
    includePaths: require('node-neat').includePaths
  }))
  .use(sitemap('http://www.website.com'))
  .use(imagemin({
    optimizationLevel: 3,
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }]
  }))
  .use(markdown())
  .use(templates({
    engine: 'handlebars',
    directory: 'templates',
    partials: 'templates/partials'
  }))
  .use(moveUp([
    'content/*',
    'styles/*'
  ]))
  .destination('./build')
  .build(function(err) {
    console.log(err)
  });
