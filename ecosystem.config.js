module.exports = {
    apps: [{
        name: "cbot",
        script: "./build/index.js",
        watch: false,
        env: {
            "NODE_ENV": "build"
        },
        env_production: {
            "NODE_ENV": "production"
        }
    }]
};
