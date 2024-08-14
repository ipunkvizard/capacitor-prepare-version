"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppVersion = getAppVersion;
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = __importDefault(require("node:process"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function getAppVersion(options) {
    const versionPath = node_path_1.default.join(node_process_1.default.cwd(), 'version.json');
    const packageVersion = _getPackageVersion();
    const currentVersion = _getVersionJson(versionPath);
    const buildNumber = options?.version || _createBuildNumber(currentVersion);
    const nextVersion = {
        version: `${packageVersion.major}.${packageVersion.minor}.${buildNumber}`,
        buildNumber: Number.parseInt(buildNumber),
    };
    _setVersionJson(versionPath, nextVersion);
    return nextVersion;
}
function _createBuildDate() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    return `${year}${month}${date}`;
}
function _createBuildNumber(currentVersion) {
    const oldBuildDate = _getBuildDate(currentVersion.buildNumber);
    const oldRevisionNumber = _getBuildRevision(currentVersion.buildNumber);
    const newBuildDate = _createBuildDate();
    const newRevisionNumber = oldBuildDate !== newBuildDate ? 1 : oldRevisionNumber + 1;
    return `${newBuildDate}${newRevisionNumber}`;
}
function _getBuildDate(buildNumber) {
    return `${buildNumber}`.slice(0, 6);
}
function _getBuildRevision(buildNumber) {
    return Number.parseInt(`${buildNumber}`.slice(6));
}
function _getPackageVersion() {
    const packagePath = node_path_1.default.join(node_process_1.default.cwd(), 'package.json');
    const packageJson = JSON.parse(fs_extra_1.default.readFileSync(packagePath, 'utf8'));
    const [major, minor, build] = packageJson.version.split('.');
    return {
        major: `${major}`,
        minor: `${minor}`,
        build: `${build}`,
    };
}
function _getVersionJson(jsonPath) {
    if (fs_extra_1.default.existsSync(jsonPath)) {
        return JSON.parse(fs_extra_1.default.readFileSync(jsonPath, 'utf8'));
    }
    else {
        const packageVersion = _getPackageVersion();
        const buildDate = _createBuildDate();
        const revisionNumber = 0;
        const buildNumber = `${buildDate}${revisionNumber}`;
        return {
            version: `${packageVersion.major}.${packageVersion.minor}.${buildNumber}`,
            buildNumber: Number.parseInt(buildNumber),
        };
    }
}
function _setVersionJson(jsonPath, json) {
    fs_extra_1.default.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
}
