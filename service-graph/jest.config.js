module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(d3|d3-[^/]+|internmap|delaunator|robust-predicates)/)',
    ],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
