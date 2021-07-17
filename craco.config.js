const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = ({ env }) => ({
    babel: {
        presets: [],
        plugins: [
            ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], // `style: true` for less
        ],
        loaderOptions: {
            /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */
        },
    },
    eslint: {
        configure: {
            rules: {
                'jsx-a11y/anchor-is-valid': 0,
            },
        },
    },
    webpack: {
        plugins: [new AntdDayjsWebpackPlugin()],
    },
});
