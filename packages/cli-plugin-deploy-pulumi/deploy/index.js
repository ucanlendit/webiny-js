module.exports = (options = {}) => ({
    type: "cli-command",
    name: "cli-command-deploy",
    create({ yargs, context }) {
        yargs.example("$0 deploy api --env=dev");
        yargs.command(
            "deploy <folder> [resources...]",
            `Deploy resources from <folder>.`,
            yargs => {
                yargs.positional("stack", {
                    describe: `Stack to deploy. Requires resources.js file`,
                    type: "string"
                });
                yargs.option("env", {
                    describe: `Environment`,
                    type: "string"
                });
                yargs.option("preview", {
                    required: false,
                    default: false,
                    describe: `Preview the deploy instead of actually performing it`,
                    type: "boolean"
                });
            },
            async argv => {
                await require("./deploy")({ ...argv, debug: true, options }, context);
                process.exit(0);
            }
        );
    }
});