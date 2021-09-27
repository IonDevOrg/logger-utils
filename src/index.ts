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
    }

    public getInstance(sentryDSN: string, environment: string): LoggerInstance {
        if (!LoggerInstance.instance) {
            LoggerInstance.instance = new LoggerInstance(sentryDSN, environment);
        }
        return LoggerInstance.instance;
    }

    public log(e: any){
        this.logger.log('debug', e.toString())
    }   

    public info(e: any){
        this.logger.log('info', e.toString())
    }   

    public capture(e: any) {
        Sentry.captureException(e);
    }
}
