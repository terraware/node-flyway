"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MavenFlywayCliDownloader = exports.FlywayCliUrlBuilder = exports.DirectFlywayCliDownloader = void 0;
const path_1 = require("path");
const flyway_version_1 = require("../../../internal/flyway-version");
const node_downloader_helper_1 = require("node-downloader-helper");
const logger_1 = require("../../../utility/logger");
const utility_1 = require("../../../utility/utility");
class DirectFlywayCliDownloader {
    constructor() {
        this.logger = (0, logger_1.getLogger)("DirectFlywayCliDownloader");
    }
    async downloadFlywayCli(flywayVersion, saveDirectory) {
        const url = this.buildUrl(flywayVersion);
        await this.download(url.url, saveDirectory);
        return (0, path_1.join)(saveDirectory, url.fileName);
    }
    getFlywayCliDownloadLocation(flywayVersion, saveDirectory) {
        const url = this.buildUrl(flywayVersion);
        return (0, path_1.join)(saveDirectory, url.fileName);
    }
    buildUrl(flywayVersion) {
        const operatingSystem = (0, utility_1.getHostOperatingSystem)();
        const cpuArchitecture = (0, utility_1.getHostCpuArchitecture)();
        return FlywayCliUrlBuilder.buildUrl(flywayVersion, operatingSystem, cpuArchitecture);
    }
    async download(url, saveDirectory) {
        const downloader = new node_downloader_helper_1.DownloaderHelper(url, saveDirectory);
        return new Promise((resolve, reject) => {
            downloader.on("end", () => resolve());
            downloader.on("error", (err) => reject(err));
            downloader.on("progress.throttled", (downloadEvents) => {
                const percentageComplete = downloadEvents.progress < 100 ? downloadEvents.progress.toPrecision(2) : 100;
                this.logger.log(`Downloaded: ${percentageComplete}%`);
            });
            downloader.start();
        });
    }
}
exports.DirectFlywayCliDownloader = DirectFlywayCliDownloader;
class FlywayCliUrlBuilder {
    static buildUrl(flywayVersion, operatingSystem, cpuArchitecture) {
        const urlComponents = (0, flyway_version_1.getUrlComponentsForFlywayVersion)(flywayVersion);
        const fileName = this.buildFilename(flywayVersion, operatingSystem, cpuArchitecture);
        return {
            url: `https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${urlComponents.versionString}/${fileName}`,
            fileName
        };
    }
    static buildFilename(flywayVersion, operatingSystem, cpuArchitecture) {
        const urlComponents = (0, flyway_version_1.getUrlComponentsForFlywayVersion)(flywayVersion);
        if (urlComponents.operatingSystemSpecificUrl) {
            return operatingSystem != "windows"
                ? `flyway-commandline-${urlComponents.versionString}-${operatingSystem}-${cpuArchitecture}.tar.gz`
                : `flyway-commandline-${urlComponents.versionString}-${operatingSystem}-${cpuArchitecture}.zip`;
        }
        return `flyway-commandline-${urlComponents.versionString}.tar.gz`;
    }
}
exports.FlywayCliUrlBuilder = FlywayCliUrlBuilder;
/**
 * Downloads CLI via Maven.
 */
class MavenFlywayCliDownloader {
    downloadFlywayCli(flywayVersion, saveDirectory) {
        throw new Error("Method not implemented.");
    }
    getFlywayCliDownloadLocation(flywayVersion, saveDirectory) {
        throw new Error("Method not implemented.");
    }
}
exports.MavenFlywayCliDownloader = MavenFlywayCliDownloader;
//# sourceMappingURL=flyway-cli-downloader.js.map