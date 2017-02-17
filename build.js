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
var cleanCSS = require('metalsmith-clean-css');

const ms = Metalsmith(__dirname)
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
  .use(sass({
    outputStyle: 'compressed',
    includePaths: require('node-neat').includePaths
  }))
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
  ]));
  

if (process.env.NODE_ENV === 'production') {
  ms.use(cleanCSS({
    files: '**/*.css',
    cleanCSS: {
      rebase: true
    }
  }));
}

ms
  .destination('./build')
  .build(function(err) {
    console.log(err)
  });
