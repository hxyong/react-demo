const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const outputDir = 'dist';
const isDebug = (process.env.NODE_ENV !== 'production');

console.log('--------------------------------');
console.log(`Type：${process.env.NODE_ENV}`);
console.log(`Flavor：${process.env.FLAVOR}`);
console.log(`isDebug：${isDebug}`);
console.log('--------------------------------');

const htmlWebpackPluginMinifyOptions = {
  caseSensitive: true,//大小写敏感
  removeComments: true,//清除HTML注释
  collapseWhitespace: !isDebug,//压缩HTML
  collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
  removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
  removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
  removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
  minifyJS: !isDebug,//压缩页面JS
  minifyCSS: !isDebug//压缩页面CSS
};

const webpackConfig = {
  //每个entry都支持数组形式，会把数组中的模块按照顺序合并到一个entry
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, outputDir),
    publicPath: '',
    hashDigestLength: 7,
    filename: isDebug ? 'js/[name].js' : 'js/[name].[chunkhash].js',//debug时不计算hash，加快编译速度
    chunkFilename: isDebug ? 'js/[name].js' : 'js/[name].[chunkhash].js'
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      //base64内嵌资源.如果大小超过，会使用file-loader
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 5000,
            name: 'img/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: 'font/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        enforce: 'pre', //前置loader，用于压缩图片
        use: {
          loader: 'img-loader',
          options: {
            enabled: !isDebug,
            gifsicle: {optimizationLevel: 2},
            mozjpeg: {progressive: true, quality: 90},
            optipng: {optimizationLevel: 5},
            pngquant: {quality: '90-95'},
            svgo: {
              plugins: [
                {removeTitle: true}, {removeComments: true}, {cleanupAttrs: true}, {removeDoctype: true}, {cleanupIDs: true},
                {removeMetadata: true}, {removeDesc: true}, {removeUselessDefs: true}, {removeEditorsNSData: true},
                {convertPathData: true}, {minifyStyles: true}, {removeViewBox: false}, {convertColors: true},
              ]
            }
          }
        }
      },
      {
        test: /.jsx$/, //使用loader的目标文件。这里是.jsx
        loader: 'babel-loader'
      },
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: {
          test: path.resolve(__dirname, "node_modules"),
          //排除webpack-dev-server，因为2.8.0以上使用了es6语法，必须经过babel转译才能在旧版浏览器上使用
          exclude: path.resolve(__dirname, "node_modules/webpack-dev-server")
        }
      },
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.html$/,
        loader: "raw-loader" // loaders: ['raw-loader'] is also perfectly acceptable.
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  devServer: {
    host: '127.0.0.1',//如果要要配置允许其它电脑访问可以设置为 0.0.0.0
    contentBase: [outputDir], //如果有静态资源文件找不到，从这按顺序查找
    publicPath: '/',
    historyApiFallback: false,
    noInfo: true,
    overlay: {
      warnings: true,
      errors: true
    },
    //本地开发时，可以将本地api请求代理到实际的服务端api
    //webapp开发基本不需要该功能，主要用于前后端同域部署的本地开发
    proxy: {
      "/api": "http://localhost:3000"
    },
    before: function (app) {
      //开发时可以在这里动态替换、映射一些http请求，参考express配置
    },
  },
  performance: {
    hints: false
  },
  devtool: isDebug ? '#eval-source-map' : '#source-map',
  plugins: [
    new HtmlWebpackPlugin({//生成html文件到输出目录
      template: './public/index.html',
      filename: 'index.html',
      title: '',
      favicon: path.resolve(__dirname,'./public/favicon.ico'),
      chunksSortMode: 'dependency',
      minify: htmlWebpackPluginMinifyOptions
    }),
    new webpack.DefinePlugin({
      'process.env': {
        // NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        FLAVOR: JSON.stringify(process.env.FLAVOR),
        VERSION: JSON.stringify(process.env.npm_package_version),
        PRODUCT_NAME: JSON.stringify(process.env.npm_package_name),
        MOCK: JSON.stringify(process.env.MOCK),
      }
    }),
    new CleanWebpackPlugin([outputDir], {
      root: __dirname,
      verbose: false,
      exclude: ['.gitkeep','.js.map']
    }),

  ]
}
if (!isDebug) {
  const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
  //noinspection JSUnresolvedFunction
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([

    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions:{
        compress: {
          pure_funcs: ['console.log']
        },
        warnings:false
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:7].css', //css文件不能放到子目录中，规避提取css文件后，css内引用资源路径错误的问题
      allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new webpack.HashedModuleIdsPlugin(), //模块id使用hash表示，避免新增文件导致模块id变化，引起所有文件内容变化
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    //该插件会导致热替换模块状态丢失，所以不要在调试环境使用
    new webpack.optimize.ModuleConcatenationPlugin(),//webpack3新特性,可以提升性能并减小文件体积
  ])
}
//bundle分析插件
if (process.env.ANALYZE) {
  // noinspection JSUnresolvedVariable
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([new BundleAnalyzerPlugin()]);
}

//因为无法通过常规手段取得webpack-dev-server监听的端口，所以这里手动找一个可用端口并指定
const portFinder = require('portfinder');
portFinder.basePort = 8080; //从指定端口开始找;

//通过Promise的方式返回webpack配置
module.exports = portFinder.getPortPromise()
  .then(port => {
    process.env.PORT = port;//将端口导出到环境变量方便其它地方使用
    webpackConfig.devServer.port = port;//指定devServer端口为找到的端口
    return webpackConfig;
  })

