"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.existsAndIsDirectory = exports.isDefined = exports.hasFullPermissionsOnFile = exports.canExecuteFile = exports.findAllExecutableFilesInDirectory = exports.getHostCpuArchitecture = exports.getHostOperatingSystem = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const node_child_process_1 = require("node:child_process");
const logger_1 = require("./logger");
const getHostOperatingSystem = () => {
    const platform = process.platform;
    if (platform == "win32") {
        return "windows";
    }
    if (platform == "darwin") {
        return "macosx";
    }
    return "linux";
};
exports.getHostOperatingSystem = getHostOperatingSystem;
const getHostCpuArchitecture = () => {
    return process.arch;
};
exports.getHostCpuArchitecture = getHostCpuArchitecture;
const findAllExecutableFilesInDirectory = async (path) => {
    const entries = await (0, promises_1.readdir)(path, { withFileTypes: true });
    const executables = await Promise.all(entries
        .filter(file => file.isFile())
        .map(async (file) => await (0, exports.canExecuteFile)((0, path_1.join)(path, file.name), (0, exports.getHostOperatingSystem)()) ? file : undefined));
    return executables.filter(exports.isDefined);
};
exports.findAllExecutableFilesInDirectory = findAllExecutableFilesInDirectory;
const canExecuteFile = async (path, system) => {
    if (system == 'windows') {
        return path.endsWith('.cmd');
    }
    try {
        await (0, promises_1.access)(path, fs_1.constants.X_OK);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.canExecuteFile = canExecuteFile;
const hasFullPermissionsOnFile = async (path) => {
    // TODO = implement this
    return true;
};
exports.hasFullPermissionsOnFile = hasFullPermissionsOnFile;
const isDefined = (argument) => {
    return argument !== undefined;
};
exports.isDefined = isDefined;
const existsAndIsDirectory = async (directory) => {
    let stats;
    try {
        stats = await (0, promises_1.stat)(directory);
    }
    catch (error) {
        return false;
    }
    return stats.isDirectory();
};
exports.existsAndIsDirectory = existsAndIsDirectory;
const execute = async (command, options, execFn = node_child_process_1.exec) => {
    return new Promise((resolve, reject) => {
        try {
            execFn(command, options, (err, stdout, stderr) => {
                resolve(
                // When run with `-outputType=json`, flyway always writes errors to `stdout`, never `stderr`.
                { success: err === null, response: stdout.toString() });
            });
        }
        catch (error) {
            (0, logger_1.getLogger)("Utility").log(`Error executing command ${command}. Error: ${error}`);
            resolve({ success: false, response: "" });
        }
    });
};
exports.execute = execute;
//# sourceMappingURL=utility.js.map