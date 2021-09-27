export declare class LoggerInstance {
    private sentryDSN;
    private environment;
    private logger;
    private static instance;
    private constructor();
    static getInstance(sentryDSN: string, environment: string): LoggerInstance;
    log(error: any): void;
    info(error: any): void;
    capture(error: any): void;
    display(error: any): void;
}
