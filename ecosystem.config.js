module.exports = {
    apps: [{
        name: "cbot",
        script: "./build/index.js",
        watch: true,
        env: {
            "NODE_ENV": "development"
        },
        env_production: {
            "NODE_ENV": "production"
        }
    }]
};
