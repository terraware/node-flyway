import { FlywayVersion } from "../../../internal/flyway-version";
import { CpuArchitecture, OperatingSystem } from "../../../utility/utility";
export interface FlywayCliDownloader {
    getFlywayCliDownloadLocation(flywayVersion: FlywayVersion, saveDirectory: string): string;
    downloadFlywayCli(flywayVersion: FlywayVersion, saveDirectory: string): Promise<string>;
}
export declare class DirectFlywayCliDownloader implements FlywayCliDownloader {
    private logger;
    downloadFlywayCli(flywayVersion: FlywayVersion, saveDirectory: string): Promise<string>;
    getFlywayCliDownloadLocation(flywayVersion: FlywayVersion, saveDirectory: string): string;
    private buildUrl;
    private download;
}
export type FlywayCliUrl = {
    url: string;
    fileName: string;
};
export declare class FlywayCliUrlBuilder {
    static buildUrl(flywayVersion: FlywayVersion, operatingSystem: OperatingSystem, cpuArchitecture: CpuArchitecture): FlywayCliUrl;
    private static buildFilename;
}
/**
 * Downloads CLI via Maven.
 */
export declare class MavenFlywayCliDownloader implements FlywayCliDownloader {
    downloadFlywayCli(flywayVersion: FlywayVersion, saveDirectory: string): Promise<string>;
    getFlywayCliDownloadLocation(flywayVersion: FlywayVersion, saveDirectory: string): string;
}
