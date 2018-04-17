export enum Level {
    OFF = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4,
    LOG = 5,
}

export class Options {
    level: Level;
    global: boolean;
    globalAs: string;
    store: boolean;
    storeAs: string;
}

export class Logger {
    private _level;
    private _globalAs;
    private _store;
    private _storeAs;
    Level: any;
    constructor(options?: Options);
    private _loadLevel;
    private _storeLevel(level);
    error(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    global: () => this;
    store(): Logger;
    unstore(): Logger;
    isErrorEnabled: () => boolean;
    isWarnEnabled: () => boolean;
    isInfoEnabled: () => boolean;
    isDebugEnabled: () => boolean;
    isLogEnabled: () => boolean;
    level: Level;
}

export const OFF_LOGGER_PROVIDERS: any[];
export const ERROR_LOGGER_PROVIDERS: any[];
export const WARN_LOGGER_PROVIDERS: any[];
export const INFO_LOGGER_PROVIDERS: any[];
export const DEBUG_LOGGER_PROVIDERS: any[];
export const LOG_LOGGER_PROVIDERS: any[];