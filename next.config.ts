import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
    webpack: (config: Configuration, options) => {
        // SVGR config
        if (config.module?.rules) {
            const fileLoaderRule = config.module.rules.find(
                (rule): rule is RuleSetRule =>
                    typeof rule === 'object' &&
                    rule !== null &&
                    rule.test instanceof RegExp &&
                    rule.test.test('.svg')
            );

            if (fileLoaderRule) {
                config.module.rules.push(
                    {
                        ...fileLoaderRule,
                        test: /\.svg$/i,
                        resourceQuery: /url/,
                    },
                    {
                        test: /\.svg$/i,
                        issuer: fileLoaderRule.issuer,
                        resourceQuery: { not: [/url/] },
                        use: [
                            {
                                loader: '@svgr/webpack',
                                options: {
                                    svgoConfig: {
                                        plugins: [
                                            {
                                                name: 'preset-default',
                                                params: {
                                                    overrides: {
                                                        removeViewBox: false,
                                                    },
                                                },
                                            },
                                            'prefixIds',
                                        ],
                                    },
                                },
                            },
                        ],
                    }
                );

                fileLoaderRule.exclude = /\.svg$/i;
            }
        }

        if (options.dev) {
            config.cache = false;
        }

        return config;
    },
};

export default nextConfig;
