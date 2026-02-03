"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadProvider = void 0;
const decompress_1 = __importDefault(require("decompress"));
const promises_1 = require("fs/promises");
const flyway_version_1 = require("../../internal/flyway-version");
const utility_1 = require("../../utility/utility");
const flyway_cli_provider_1 = require("../flyway-cli-provider");
// @ts-ignore - fix missing types
const decompress_targz_1 = __importDefault(require("decompress-targz"));
// @ts-ignore - fix missing types
const decompress_unzip_1 = __importDefault(require("decompress-unzip"));
const path_1 = require("path");
const types_1 = require("../../types/types");
const logger_1 = require("../../utility/logger");
const flyway_cli_1 = require("../flyway-cli");
const flyway_cli_service_1 = require("../service/flyway-cli-service");
const path = require("path");
/*
    Downloads a compressed Flyway CLI into the specified save directory.
    The CLI is decompressed into a Flyway CLI directory.
    The specified directory becomes the parent directory of the newly created Flyway CLI directory.
*/
class DownloadProvider extends flyway_cli_provider_1.FlywayCliProvider {
    constructor(saveDirectory, flywayCliDownloader) {
        super();
        this.saveDirectory = saveDirectory;
        this.flywayCliDownloader = flywayCliDownloader;
    }
    async getFlywayCli(flywayVersion) {
        /*
            Check directory exists otherwise create it.
        */
        let stats;
        try {
            stats = await (0, promises_1.stat)(this.saveDirectory);
        }
        catch (error) {
            await (0, promises_1.mkdir)(this.saveDirectory, { recursive: true });
        }
        if (stats != null && !stats.isDirectory()) {
            throw new Error("Specified path isn't directory");
        }
        if (!await (0, utility_1.hasFullPermissionsOnFile)(this.saveDirectory)) {
            throw new Error();
        }
        DownloadProvider.logger.log(`Downloading Flyway CLI ${flyway_version_1.FlywayVersion[flywayVersion]}...`);
        const archiveLocation = this.flywayCliDownloader.getFlywayCliDownloadLocation(flywayVersion, this.saveDirectory);
        /*
            Clean out any partially downloaded files
         */
        await this.removeArchiveFile(archiveLocation);
        await this.flywayCliDownloader.downloadFlywayCli(flywayVersion, this.saveDirectory);
        const saveDirectoryAbsolutePath = (0, path_1.resolve)(this.saveDirectory);
        DownloadProvider.logger.log(`Successfully downloaded Flyway CLI ${flyway_version_1.FlywayVersion[flywayVersion]} to location: ${this.saveDirectory}`);
        const decompressedFiles = await this.decompressFiles(archiveLocation, saveDirectoryAbsolutePath);
        const extractedDirectory = this.getExtractLocationFromDecompressedFiles(decompressedFiles, this.saveDirectory);
        DownloadProvider.logger.log(`Successfully extracted Flyway CLI ${flyway_version_1.FlywayVersion[flywayVersion]} to location: ${extractedDirectory}`);
        await this.removeArchiveFile(archiveLocation);
        const executable = await flyway_cli_service_1.FlywayCliService.getExecutableFromFlywayCliDirectory(extractedDirectory);
        const hash = await flyway_cli_service_1.FlywayCliService.getFlywayCliHash(extractedDirectory);
        if (hash == undefined) {
            throw new Error("Unable to compute hash for downloaded Flyway CLI.");
        }
        return new flyway_cli_1.FlywayCli(flywayVersion, types_1.FlywayCliSource.DOWNLOAD, extractedDirectory, executable, hash);
    }
    getExtractLocationFromDecompressedFiles(files, outerDirectory) {
        if (files.length == 0) {
            throw new Error("Weird. Expected some files to be extracted.");
        }
        // Files returned by decompress always use path separator '/' rather than the platform specific version.
        return path.join(outerDirectory, files[0].path.split('/')[0]);
    }
    async decompressFiles(archiveLocation, saveDirectory) {
        const plugins = archiveLocation.includes(".zip") ? [(0, decompress_unzip_1.default)()] : [(0, decompress_targz_1.default)()];
        return (0, decompress_1.default)(archiveLocation, saveDirectory, { plugins, filter: file => file.type === "file" });
        /*
            [Error: ENOENT: no such file or directory, symlink 'ja_JP.UTF-8' -> '.../code/node-flyway/cli/flyway-8.5.11/jre/man/ja/'] {
            errno: -2,
            code: 'ENOENT',
            syscall: 'symlink',
            path: 'ja_JP.UTF-8',
            dest: '.../code/node-flyway/cli/flyway-8.5.11/jre/man/ja/'
            }
            Referenced here: https://github.com/kevva/decompress/issues/93
            Not an issue, only impacts 'man'. The symlinks can be excluded using a filter.
        */
    }
    async removeArchiveFile(archiveLocation) {
        try {
            await (0, promises_1.rm)(archiveLocation, { force: true });
        }
        catch (err) {
            if (err.code === "ENOENT") {
                // When attempting an early clean of the archive it is possible that it doesn't exist. In this case, do nothing.
            }
        }
    }
}
exports.DownloadProvider = DownloadProvider;
DownloadProvider.logger = (0, logger_1.getLogger)("DownloadProvider");
//# sourceMappingURL=download-provider.js.map