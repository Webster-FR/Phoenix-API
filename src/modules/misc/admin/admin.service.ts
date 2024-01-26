import {ForbiddenException, forwardRef, Inject, Injectable} from "@nestjs/common";
import {AdminController} from "./admin.controller";
import {SecretsService} from "../../security/secrets/secrets.service";
import {PrismaService} from "../../../common/services/prisma.service";

@Injectable()
export class AdminService{

    constructor(
        @Inject(forwardRef(() => SecretsService))
        private readonly secretsService: SecretsService,
        private readonly prismaService: PrismaService,
    ){}

    enableMaintenanceMode(message: string = ""): void{
        AdminController.isMaintenanceMode = true;
        if(message)
            AdminController.maintenanceMessage = message;
    }

    disableMaintenanceMode(): void{
        if(!AdminController.isMaintenanceMode)
            throw new ForbiddenException("Maintenance mode is already disabled");
        AdminController.isMaintenanceMode = false;
        AdminController.maintenanceMessage = "Our services are undergoing maintenance and will therefore be temporarily unavailable!";
    }

    async runSecretRotation(): Promise<void>{
        await this.secretsService.runSecretsRotation();
    }

    generateStatisticLine(statistic: any): string{
        let line = "" + statistic["created_at"];
        for(const key in statistic){
            if(key === "created_at" || key === "id")
                continue;
            line = line.concat(";" + statistic[key]);
        }
        return line;
    }

    async getStatistics(){
        const statistics: any[] = await this.prismaService.statistics.findMany();
        let result = "Date;" +
            "Global request count;GET request count;POST request count;PUT request count;PATCH request count;DELETE request count;" +
            "Global response time average; GET response time average;POST response time average;PUT response time average;PATCH response time average;DELETE response time average;" +
            "Global response time max;GET response time max;POST response time max;PUT response time max;PATCH response time max;DELETE response time max;" +
            "Global response time min;GET response time min;POST response time min;PUT response time min;PATCH response time min;DELETE response time min;" +
            "Global content length average;GET content length average;POST content length average;PUT content length average;PATCH content length average;DELETE content length average;" +
            "Global content length max;GET content length max;POST content length max;PUT content length max;PATCH content length max;DELETE content length max;" +
            "Global content length min;GET content length min;POST content length min;PUT content length min;PATCH content length min;DELETE content length min;";
        statistics.forEach(statistic => {
            const line = this.generateStatisticLine(statistic);
            result = result.concat("\n" + line);
        });
        return result;
    }
}
