/// <reference types="node" />
import { exec, ExecOptions } from "node:child_process";
export type OperatingSystem = "macosx" | "linux" | "windows";
export type CpuArchitecture = "arm" | "arm64" | "ia32" | "mips" | "mipsel" | "ppc" | "ppc64" | "s390" | "s390x" | "x64";
export declare const getHostOperatingSystem: () => OperatingSystem;
export declare const getHostCpuArchitecture: () => CpuArchitecture;
export declare const findAllExecutableFilesInDirectory: (path: string) => Promise<import("fs").Dirent[]>;
export declare const canExecuteFile: (path: string, system: OperatingSystem) => Promise<boolean>;
export declare const hasFullPermissionsOnFile: (path: string) => Promise<boolean>;
export declare const isDefined: <T>(argument: T | undefined) => argument is T;
export declare const existsAndIsDirectory: (directory: string) => Promise<boolean>;
export type ExecutionResponse = {
    success: boolean;
    response: string;
};
export declare const execute: (command: string, options: ExecOptions, execFn?: typeof exec) => Promise<ExecutionResponse>;
