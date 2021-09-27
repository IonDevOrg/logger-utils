export declare class LoggerInstance {
    private sentryDSN;
    private environment;
    private logger;
    private static instance;
    private constructor();
    getInstance(sentryDSN: string, environment: string): LoggerInstance;
    log(e: any): void;
    info(e: any): void;
    capture(e: any): void;
}
