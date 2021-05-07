module.exports = {
    name: "stop",
    description: "Stops the NodeJS application entirely.",
    syntax: "stop",
    min_args: 0,
    admin_only: true,
    execute(message: any, args: string[]) {
        process.exit();
    }
};
