import { FlywayVersion } from "../../internal/flyway-version";
import { FlywayExecutable } from "../flyway-cli";
export declare class FlywayCliService {
    static getFlywayCliDetails(flywayCliDirectory: string): Promise<{
        version: FlywayVersion;
        hash: string;
    } | undefined>;
    static getFlywayCliHash(flywayCliDirectory: string): Promise<string | undefined>;
    static getExecutableFromFlywayCliDirectory(flywayCliDirectory: string): Promise<FlywayExecutable>;
    private static getFlywayCommandLineFiles;
}
