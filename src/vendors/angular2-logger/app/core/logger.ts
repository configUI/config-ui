import { Injectable, Optional } from '@angular/core';
import { Level } from './level';
import * as moment from 'moment';

/**
 * Logger options.
 *
 */
export class Options {
    level: Level;
    global: boolean;
    globalAs: string;
    store: boolean;
    storeAs: string;
}

// For browsers that don't implement the debug method, log will be used instead. Fixes #62.
const CONSOLE_DEBUG_METHOD = console['debug'] ? 'debug' : 'log';
const DEFAULT_OPTIONS: Options = {
    level: Level.WARN,
    global: true,
    globalAs: 'logger',
    store: false,
    storeAs: 'angular2.logger.level'
};

@Injectable()
export class Logger {

    private _level: Level;
    public Level: any = Level;
    private _isIE = navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//);
    logLevel = 1;

    constructor( @Optional() options?: Options) {
        this.setLevelFromStorage();
    }

    setLevelFromStorage() {
        if (localStorage.getItem('productDebugLevel') !== undefined &&
            localStorage.getItem('productDebugLevel') !== null) {
            try {
                window['logLevel'] = parseInt(localStorage.getItem('productDebugLevel'), 10);
            } catch (e) {
                window['logLevel'] = 1;
            }
        } else {
            window['logLevel'] = 1;
        }
    }

    /**Setting Log Level in Local Storage. */
    setLevelInStorage(logLevel) {
        try {
            localStorage.setItem('productDebugLevel', logLevel);
        } catch (e) {
            console.error('Error on setting log level in console.', e);
        }
    }

    /**
     * Setting Log Level.
     * @param logLevel.
     */
    public setLevel(logLevel) {
        window['logLevel'] = logLevel;
    }

    /**
     * Error Log.
     * @param message
     * @param optionalParams
     *@deprecated - User Log.errorLog for module level logging.
     */
    error(message?: any, ...optionalParams: any[]) {
        this._simpleLog(message, 'ERROR', Level.ERROR, optionalParams);
    }

    /**
     * Warning Log.
     * @param message
     * @param optionalParams
     *@deprecated - User Log.warnLog for module level logging.
     */
    warn(message?: any, ...optionalParams: any[]) {
        this._simpleLog(message, 'WARN', Level.WARN, optionalParams);
    }

    /**
     * Debug Log.
     * @param message
     * @param optionalParams
     *@deprecated - User Log.debugLog for module level logging.
     */
    debug(message?: any, ...optionalParams: any[]) {
        this._simpleLog(message, 'DEBUG', Level.DEBUG, optionalParams);
    }

    /**
     * Info Log.
     * @param message
     * @param optionalParams
     *@deprecated - User Log.infoLog for module level logging.
     */
    info(message?: any, ...optionalParams: any[]) {
        this._simpleLog(message, 'INFO', Level.INFO, optionalParams);
    }

    /**
     * Normal Log.
     * @param message
     * @param optionalParams
     *@deprecated - User Log.Logging for module level logging.
     */
    log(message?: any, ...optionalParams: any[]) {
        this._simpleLog(message, 'LOG', Level.LOG, optionalParams);
    }

    /**
     * Error message logging.
     * @param message
     * @param Component/Service/Class
     * @param Method/Observer/Listener
     * @param exception
     * @param optionalParams (objects to print.)
     */
    errorLog(component = null, method = null, message?: any, exception = null, optionalParams?: any) {
        this._log('ERROR', Level.ERROR, message, component, method, exception, optionalParams);
    }

    /**
     * Warning message logging.
     * @param message
     * @param Component/Service/Class
     * @param Method/Observer/Listener
     * @param optionalParams (objects to print.)
     */
    warnLog(component = null, method = null, message?: any, optionalParams?: any) {
        this._log('WARN', Level.WARN, message, component, method, null, optionalParams);
    }

    /**
     * Information message logging.
     * @param message
     * @param Component/Service/Class
     * @param Method/Observer/Listener
     * @param optionalParams (objects to print.)
     */
    infoLog(component = null, method = null, message?: any, optionalParams?: any) {
        this._log('INFO', Level.INFO, message, component, method, null, optionalParams);
    }

    /**
     * Debug Level message logging. Use for debugging content.
     * @param message
     * @param Component/Service/Class
     * @param Method/Observer/Listener
     * @param optionalParams (objects to print.)
     */
    debugLog(component = null, method = null, message?: any, optionalParams?: any) {
        this._log('DEBUG', Level.DEBUG, message, component, method, null, optionalParams);
    }

    /**
     * Log the timing of methods in component.
     * @param component
     * @param method
     * @param data
     * @param message
     */
    timeLog(component = null, method = null, message = '') {

         if (this.logLevel < Level.INFO) {
             return;
         }
        let colorTxt = 'font-weight: bold';
        colorTxt += ';color: blue';
        /**Adding Module And Feature. */
        if (method !== null) {
            message = method + '|' + message;
        } else {
            message = '-' + '|' + message;
        }

        if (component !== null) {
            message = '|' + component + '|' + message;
        } else {
            message = '|' + '-' + '|' + message;
        }

        console.log(`%c${moment.utc().format('HH:mm:ss.SSS')} [TIME_LOG] ${message}`, colorTxt);
    }

    /**
     * Basic Logging with log Level. Use for high frequency Logs only.
     * @param message
     * @param Component/Service/Class
     * @param Method/Observer/Listener
     * @param optionalParams (objects to print.)
     */
    logging(component = null, method = null, message?: any, optionalParams?: any) {
        this._log('LOG', Level.LOG, message, component, method, null, optionalParams);
    }

    /**
     * Lowest Level logging.
     * @param message
     * @param Component/Service/Class
     * @param Method/Observer/Listener
     * @param optionalParams (objects to print.)
     */
    traceLog(component = null, method = null, message?: any, optionalParams?: any) {
        this._log('TRACE', Level.TRACE, message, component, method, null, optionalParams);
    }

    /**
     * Simple logging for supporting previous logs.
     * @param message
     * @param level
     * @param levelNum
     * @param others (objects to print)
     */
    private _simpleLog(message: string, level: string, levelNum: number, others) {
        try {
            if (window['logLevel']) {
                this.logLevel = window['logLevel'];
            }

            // if no message or the log level is less than the environ
            if (!message || levelNum > this.logLevel) {
                return;
            }
            this._logOldMsg(level, message, others);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Logging the logs.
     * @param level
     * @param levelNum
     * @param message
     * @param logOnServer
     */
    private _log(level: string, levelNum: number, message = '', module = null, feature = null, exception = null, object = '') {
        try {
            if (window['logLevel']) {
                this.logLevel = window['logLevel'];
            }

            // if no message or the log level is less than the environ
            if (!message || levelNum > this.logLevel) {
                return;
            }

            if (typeof message === 'object') {
                try {
                    message = JSON.stringify(message, null, 2);
                } catch (e) {
                    message = `circular object in message: ${message}`;
                }
            }

            /**Adding Module And Feature. */
            if (feature !== null) {
                message = feature + '|' + message;
            } else {
                message = '-' + '|' + message;
            }

            if (module !== null) {
                message = '|' + module + '|' + message;
            } else {
                message = '|' + '-' + '|' + message;
            }

            this.logMessage(level, message, exception, object);

        } catch (e) {
            console.log('Error in logging.', e);
        }
    }

    /**
     * Logging message in console.
     * @param level
     * @param message
     * @param exception
    *  @param object
     */
    logMessage(level, message, exception, object: any) {
        try {
            // Coloring doesn't work in IE
            if (this._isIE) {
                this._logIE(level, message, undefined);
                return;
            }

            let colorTxt = 'font-weight: bold';
            switch (level) {
                case 'TRACE':
                    colorTxt += ';color: teal';
                    /**Now Logging the Message. */
                    console.log(`%c${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`, colorTxt, object);
                    break;
                case 'DEBUG':
                    colorTxt += ';color: black';
                    /**Now Logging the Message. */
                    console.log(`%c${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`, colorTxt, object);
                    break;
                case 'INFO':
                    colorTxt += ';color: blue';
                    /**Now Logging the Message. */
                    console.log(`%c${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`, colorTxt, object);
                    break;
                case 'LOG':
                    colorTxt += ';color: green';
                    /**Now Logging the Message. */
                    console.log(`%c${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`, colorTxt, object);
                    break;
                case 'WARN':
                    colorTxt += ';color: orange';
                    /**Now Logging the Message. */
                    console.warn(`%c${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`, colorTxt, object);
                    break
                case 'ERROR':
                    colorTxt += ';color: red';
                    /**Now Logging the Message. */
                    if (exception !== null) {
                        console.error(`%c${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`, colorTxt, exception, object);
                    } else {
                        console.error(`%c${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`, colorTxt, object);
                    }
                    break;
                case 'OFF':
                default:
                    return;
            }
        } catch (e) {
            console.error('Error in logging message', e);
        }
    }

    /**
     * Logging Old Messages. Due to No module/method as input.
     * @param level
     * @param message
     */
    private _logOldMsg(level: string, message: any, others = undefined) {
        try {

            // Coloring doesn't work in IE
            if (this._isIE) {
                this._logIE(level, message, others);
                return;
            }

            if (others === undefined || others.length === 0) {
                others = '';
            }
            let colorTxt = 'font-weight: bold';
            message = `%c${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`;
            if (level === 'WARN') {
                colorTxt += ';color: orange';
                console.warn(message, colorTxt, others);
            } else if (level === 'ERROR') {
                colorTxt += ';color: red';
                console.error(message, colorTxt, others);
            } else {
                if (level === 'INFO') {
                    colorTxt += ';color: blue';
                } else if (level === 'DEBUG') {
                    colorTxt += ';color: green';
                } else if (level === 'LOG') {
                    colorTxt += ';color: black';
                } else {
                    colorTxt += ';color: teal';
                }

                console.log(message, colorTxt, others);
            }
        } catch (e) {
            console.error('Error in Logging.', e);
        }
    }

    /**
     * Logging in IE. Due to No coloring.
     * @param level
     * @param message
     */
    private _logIE(level: string, message: any, others) {
        try {
            message = `${moment.utc().format('DD-MMM HH:mm:ss.SSS')} [${level}] ${message}`;
            if (level === 'WARN') {
                if (others === undefined || others.length === 0) {
                    console.warn(message);
                } else {
                    console.warn(message, others);
                }
            } else if (level === 'ERROR') {
                if (others === undefined || others.length === 0) {
                    console.error(message);
                } else {
                    console.error(message, others);
                }
            } else {
                if (others === undefined || others.length === 0) {
                    console.log(message);
                } else {
                    console.log(message, others);
                }
            }
        } catch (e) {
            console.error('Error in Logging.', e);
        }
    }
}
