import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {FastifyReply, FastifyRequest} from "fastify";
import {StatisticsService} from "../../modules/misc/statistics/statistics.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{

    static logger: Logger = new Logger(LoggerMiddleware.name);

    use(req: FastifyRequest["raw"], res: FastifyReply["raw"], next: () => void){
        const startTime = Date.now();
        res.on("finish", () => {
            const httpOrHttps = req.connection.localPort.toString() === process.env.HTTPS_PORT ? "HTTPS" : "HTTP";
            const method = req.method;
            if(method === "OPTIONS")
                return;
            const path = req.url;
            const statusCode = res.statusCode;
            const duration = Date.now() - startTime;
            // const resSize = res.getHeader("Content-Length") || "N/A";
            const nRes = res as any;
            const resSize = nRes._contentLength || "-1";
            const intResSize = parseInt(resSize);
            if(!path.includes("/api/v"))
                return;
            LoggerMiddleware.logger.log(`${httpOrHttps} ${method} ${path} ${statusCode} ${duration}ms ${intResSize}`);
            LoggerMiddleware.requestTimeLogger(path, method, duration);
            StatisticsService.onRequestSent(method, duration, intResSize);
        });
        next();
    }

    static requestTimeLogger(path: string, method: string, ms: number){
        switch (method){
            case "GET":
                if(ms > 750)
                    LoggerMiddleware.logger.warn(`GET (${path}) request took more than 750ms (${ms}ms)`);
                break;
            case "POST":
                if(ms > 1500)
                    LoggerMiddleware.logger.warn(`POST (${path}) request took more than 1500ms (${ms}ms)`);
                break;
            case "PUT":
                if(ms > 1500)
                    LoggerMiddleware.logger.warn(`PUT (${path}) request took more than 1500ms (${ms}ms)`);
                break;
            case "PATCH":
                if(ms > 500)
                    LoggerMiddleware.logger.warn(`PATCH (${path}) request took more than 500ms (${ms}ms)`);
                break;
            case "DELETE":
                if(ms > 500)
                    LoggerMiddleware.logger.warn(`DELETE (${path}) request took more than 500ms (${ms}ms)`);
                break;
        }
    }
}
