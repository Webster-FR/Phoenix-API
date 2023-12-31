import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {CustomValidationPipe} from "./pipes/custom-validation.pipe";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {LoggerMiddleware} from "./middlewares/logger.middleware";
import * as compression from "@fastify/compress";
import {RawServerDefault} from "fastify";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import * as process from "process";
import * as dotenv from "dotenv";
import helmet from "helmet";
import * as fs from "fs";
import * as os from "os";

dotenv.config();

async function bootstrap(){
    switch (process.env.SERVER_TYPE){
        case "http":
            await startHttpServer();
            break;
        case "https":
            await startHttpsServer();
            break;
        case "both":
            await startHttpServer();
            await startHttpsServer();
            break;
        default:
            console.error("Invalid SERVER_TYPE");
            process.exit(1);
    }
}

function logServerStart(bindAddress: string, port: string | number, protocol: string){
    if(bindAddress === "0.0.0.0"){
        const ifaces = os.networkInterfaces();
        Object.keys(ifaces).forEach(function(ifname){
            let alias = 0;
            ifaces[ifname].forEach(function(iface){
                if("IPv4" !== iface.family || iface.internal !== false)
                    return;
                if(alias >= 1)
                    bindAddress = iface.address;
                else
                    bindAddress = iface.address;
                ++alias;
            });
        });
    }
    console.log(`Server started on ${protocol}://${bindAddress}:${port}`);
}

async function startHttpServer(){
    const httpApp = await NestFactory.create<NestFastifyApplication>(AppModule , new FastifyAdapter());
    await loadServer(httpApp);
    await httpApp.listen(process.env.HTTP_PORT, process.env.BIND_ADDRESS);
    logServerStart(process.env.BIND_ADDRESS, process.env.HTTP_PORT, "http");
}

async function startHttpsServer(){
    const httpsOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_FILE),
        cert: fs.readFileSync(process.env.SSL_CERT_FILE),
    };
    const httpsApp = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({https: httpsOptions}));
    await loadServer(httpsApp);
    await httpsApp.listen(process.env.HTTPS_PORT, process.env.BIND_ADDRESS);
    logServerStart(process.env.BIND_ADDRESS, process.env.HTTP_PORT, "https");
}

async function loadServer(server: NestFastifyApplication<RawServerDefault>){
    // Config
    server.setGlobalPrefix(process.env.PREFIX);
    server.enableCors();

    // Middlewares
    server.use(new LoggerMiddleware().use);
    server.use(helmet());
    await server.register(compression, {encodings: ["gzip", "deflate"]});

    // Swagger
    const config = new DocumentBuilder()
        .setTitle("Template")
        .setDescription("The Template API description")
        .setVersion(process.env.npm_package_version)
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(server, config);
    SwaggerModule.setup("api", server, document, {
        swaggerOptions: {
            filter: true,
            displayRequestDuration: true,
            persistAuthorization: true,
        },
    });

    server.useGlobalPipes(new CustomValidationPipe());
}

bootstrap();
