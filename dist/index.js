"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerInstance = void 0;
var winston_1 = __importDefault(require("winston"));
var Sentry = __importStar(require("@sentry/node"));
var LoggerInstance = /** @class */ (function () {
    function LoggerInstance(sentryDSN, environment) {
        this.sentryDSN = "";
        this.environment = "development";
        this.logger = null;
        this.environment = environment;
        this.sentryDSN = sentryDSN;
        Sentry.init({
            dsn: this.sentryDSN,
            tracesSampleRate: 1.0,
        });
        //
        try {
            this.logger = winston_1.default.createLogger({
                level: "info",
                format: winston_1.default.format.json(),
                defaultMeta: { service: "user-service" },
                transports: [
                    new winston_1.default.transports.File({
                        filename: "info.log",
                        level: "info",
                    }),
                    new winston_1.default.transports.File({ filename: "combined.log" }),
                ],
            });
            if (this.environment !== "production") {
                this.logger.add(new winston_1.default.transports.Console({
                    format: winston_1.default.format.simple(),
                }));
            }
        }
        catch (error) {
            this.capture(error);
        }
    }
    LoggerInstance.getInstance = function (sentryDSN, environment) {
        if (!LoggerInstance.instance) {
            LoggerInstance.instance = new LoggerInstance(sentryDSN, environment);
        }
        return LoggerInstance.instance;
    };
    LoggerInstance.prototype.log = function (error) {
        this.logger.log('debug', error.toString());
    };
    LoggerInstance.prototype.info = function (error) {
        this.logger.log('info', error.toString());
    };
    LoggerInstance.prototype.capture = function (error) {
        if (this.environment !== "production") {
            console.log(error);
        }
        else {
            Sentry.captureException(error);
        }
    };
    LoggerInstance.prototype.display = function (error) {
        if (this.environment !== "production") {
            console.info(error);
        }
        else {
            Sentry.captureMessage(error);
        }
    };
    return LoggerInstance;
}());
exports.LoggerInstance = LoggerInstance;
