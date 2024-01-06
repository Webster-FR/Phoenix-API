import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {FastifyReply, FastifyRequest} from "fastify";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{

    static logger: Logger = new Logger(LoggerMiddleware.name);

    use(req: FastifyRequest["raw"], res: FastifyReply["raw"], next: () => void){
        const startTime = Date.now();
        res.on("finish", () => {
            const httpOrHttps = req.connection.localPort.toString() === process.env.HTTPS_PORT ? "HTTPS" : "HTTP";
            const method = req.method;
            const path = req.url;
            const statusCode = res.statusCode;
            const duration = Date.now() - startTime;
            const resSize = res.getHeader("Content-Length") || "N/A";
            LoggerMiddleware.logger.log(`${httpOrHttps} ${method} ${path} ${statusCode} ${duration}ms ${resSize}`);
        });
        next();
    }
}
