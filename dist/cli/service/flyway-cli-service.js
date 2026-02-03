"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlywayCliService = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const flyway_version_1 = require("../../internal/flyway-version");
const utility_1 = require("../../utility/utility");
const md5 = require("md5");
const flyway_cli_1 = require("../flyway-cli");
const glob_1 = require("glob");
class FlywayCliService {
    /*
        Given a directory path, determine if this is a flyway CLI and the version
    */
    static async getFlywayCliDetails(flywayCliDirectory) {
        if (!await (0, utility_1.existsAndIsDirectory)(flywayCliDirectory)) {
            return undefined;
        }
        const hash = await this.getFlywayCliHash(flywayCliDirectory);
        if (hash == undefined) {
            return undefined;
        }
        try {
            return {
                version: (0, flyway_version_1.getFlywayCliVersionForHash)(hash),
                hash
            };
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    /*
        Returns an MD5 hash of the Flyway CLI if the provided directory contains a Flyway CLI.
        Otherwise, returns undefined.
     */
    static async getFlywayCliHash(flywayCliDirectory) {
        const paths = await FlywayCliService.getFlywayCommandLineFiles(flywayCliDirectory);
        if (paths.length == 0) {
            return undefined;
        }
        if (paths.length > 1) {
            throw new Error("Expected single filepath.");
        }
        const content = await (0, promises_1.readFile)(paths[0]);
        if (content == null) {
            throw new Error();
        }
        return md5(content);
    }
    static async getExecutableFromFlywayCliDirectory(flywayCliDirectory) {
        const executableFiles = await (0, utility_1.findAllExecutableFilesInDirectory)(flywayCliDirectory);
        if (executableFiles.length == 0) {
            throw new Error(`Unable to find an executable Flyway CLI in target directory: ${flywayCliDirectory}`);
        }
        if (executableFiles.length > 1) {
            const executableFilesWithCorrectName = executableFiles.filter(file => file.name.includes("flyway"));
            if (executableFilesWithCorrectName.length > 1) {
                throw new Error(`Expecting only one executable Flyway CLI to be found. Instead found multiple executable files: ${executableFiles.map(ex => ex.name)}`);
            }
            else {
                (0, path_1.join)(flywayCliDirectory, executableFilesWithCorrectName[0].name);
            }
        }
        return new flyway_cli_1.FlywayExecutable((0, path_1.join)(flywayCliDirectory, executableFiles[0].name));
    }
    /*
        Specifically looks for the command-line JAR files to compute the hash.
        This archive file is a good candidate to compute the hash as it is easily accessible, represents the entire library & is unique per Flyway version.
     */
    static async getFlywayCommandLineFiles(directory) {
        const mappedDirectory = (0, utility_1.getHostOperatingSystem)() == 'windows' ? directory.replaceAll('\\', '/') : directory;
        const paths_a = await (0, glob_1.glob)(`${mappedDirectory}/lib/community/flyway-commandline-*.jar`);
        const paths_b = await (0, glob_1.glob)(`${mappedDirectory}/lib/flyway-commandline-*.jar`);
        return paths_a.concat(paths_b);
    }
}
exports.FlywayCliService = FlywayCliService;
//# sourceMappingURL=flyway-cli-service.js.map