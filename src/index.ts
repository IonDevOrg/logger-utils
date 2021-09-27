import winston from "winston";
import * as Sentry from "@sentry/node";
// @ts-expect-error: Let's ignore a compile error like this unreachable code 
import * as Tracing from "@sentry/tracing";

export class LoggerInstance {
    private sentryDSN: string = "";
    private environment: string = "development"
    private logger: any = null
    private static instance: LoggerInstance;

    private constructor(sentryDSN: string, environment: string) {
        this.environment = environment
        this.sentryDSN = sentryDSN;
        Sentry.init({
            dsn: this.sentryDSN,
            tracesSampleRate: 1.0,
        });
        //
        try {
            this.logger = winston.createLogger({
                level: "info",
                format: winston.format.json(),
                defaultMeta: { service: "user-service" },
                transports: [
                    new winston.transports.File({
                        filename: "info.log",
                        level: "info",
                    }),
                    new winston.transports.File({ filename: "combined.log" }),
                ],
            });
    
            if (this.environment !== "production") {
                this.logger.add(
                    new winston.transports.Console({
                        format: winston.format.simple(),
                    })
                );
            }
        } catch (error) {
            this.capture(error)
        }
    }

    public static getInstance(sentryDSN: string, environment: string): LoggerInstance {
        if (!LoggerInstance.instance) {
            LoggerInstance.instance = new LoggerInstance(sentryDSN, environment);
        }
        return LoggerInstance.instance;
    }

    public log(error: any){
        this.logger.log('debug', error.toString())
    }   

    public info(error: any){
        this.logger.log('info', error.toString())
    }   

    public capture(error: any) {
        if(this.environment !== "production"){
            console.log(error)
        }else{
            Sentry.captureException(error);
        }
    }

    public display(error: any) {
        if(this.environment !== "production"){
            console.info(error)
        }else{
            Sentry.captureMessage(error)
        }
    }
}
