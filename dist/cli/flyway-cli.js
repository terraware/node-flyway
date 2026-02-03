"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlywayExecutable = exports.FlywayCli = void 0;
const flyway_command_line_options_1 = require("../internal/flyway-command-line-options");
const logger_1 = require("../utility/logger");
const utility_1 = require("../utility/utility");
class FlywayCli {
    constructor(version, source, location, executable, hash) {
        this.version = version;
        this.source = source;
        this.location = location;
        this.executable = executable;
        this.hash = hash;
    }
}
exports.FlywayCli = FlywayCli;
class FlywayExecutable {
    constructor(path) {
        this.path = path;
    }
    async execute(flywayCommand, config) {
        const commandLineOptions = flyway_command_line_options_1.FlywayCommandLineOptions.build(config);
        const command = `${this.path} ${commandLineOptions.convertToCommandLineString()} ${flywayCommand} -outputType=json`;
        FlywayExecutable.logger.log(`Executing flyway command: ${command}`);
        const response = await (0, utility_1.execute)(command, {});
        if (response.success) {
            FlywayExecutable.logger.log(`Successfully executed command`);
            FlywayExecutable.logger.log(`Received response from Flyway CLI: ${response.response}`);
        }
        else {
            FlywayExecutable.logger.log(`Error returned when executing command: ${command}`);
        }
        return response;
    }
}
exports.FlywayExecutable = FlywayExecutable;
FlywayExecutable.logger = (0, logger_1.getLogger)("FlywayExecutable");
//# sourceMappingURL=flyway-cli.js.map