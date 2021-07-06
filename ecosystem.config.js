module.exports = {
    apps: [{
        name: "cbot",
        script: "./build/index.js",
        watch: false,
        env: {
            "NODE_ENV": "production"
        }
    }]
};
