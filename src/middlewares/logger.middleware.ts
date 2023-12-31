import {Injectable, NestMiddleware} from "@nestjs/common";
import {FastifyReply, FastifyRequest} from "fastify";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    private static getCurrentTime(): string{
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `[${hours}:${minutes}:${seconds}]`;
    }

    use(req: FastifyRequest["raw"], res: FastifyReply["raw"], next: () => void){
        const startTime = Date.now();
        res.on("finish", () => {
            const currentTime = LoggerMiddleware.getCurrentTime();
            const httpOrHttps = req.connection.localPort.toString() === process.env.HTTPS_PORT ? "HTTPS" : "HTTP";
            const method = req.method;
            const path = req.url;
            const statusCode = res.statusCode;
            const duration = Date.now() - startTime;
            const resSize = res.getHeader("Content-Length");
            console.log(`${currentTime} ${httpOrHttps} ${method} ${path} ${statusCode} ${duration}ms ${resSize}`);
        });
        next();
    }
}
