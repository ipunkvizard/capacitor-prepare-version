interface CommandOptions {
    version?: string;
}
interface AppVersion {
    version: string;
    buildNumber: number;
}
export declare function getAppVersion(options: CommandOptions): AppVersion;
export {};
