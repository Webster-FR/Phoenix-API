import {RequestCountModel} from "./request-count.model";
import {StatisticsService} from "../../statistics.service";

export class ResponseTimeAverageModel{
    public globalResponseTimeAverage = -1;
    public getResponseTimeAverage = -1;
    public postResponseTimeAverage = -1;
    public putResponseTimeAverage = -1;
    public patchResponseTimeAverage = -1;
    public deleteResponseTimeAverage = -1;

    onRequestSent(method: string, responseTime: number, updatedRequestCount: RequestCountModel): void{
        switch (method){
            case "GET":
                this.getResponseTimeAverage = StatisticsService.computeAverage(this.getResponseTimeAverage, updatedRequestCount.getRequestsCount - 1, responseTime);
                break;
            case "POST":
                this.postResponseTimeAverage = StatisticsService.computeAverage(this.postResponseTimeAverage, updatedRequestCount.postRequestsCount - 1, responseTime);
                break;
            case "PUT":
                this.putResponseTimeAverage = StatisticsService.computeAverage(this.putResponseTimeAverage, updatedRequestCount.putRequestsCount - 1, responseTime);
                break;
            case "PATCH":
                this.patchResponseTimeAverage = StatisticsService.computeAverage(this.patchResponseTimeAverage, updatedRequestCount.patchRequestsCount - 1, responseTime);
                break;
            case "DELETE":
                this.deleteResponseTimeAverage = StatisticsService.computeAverage(this.deleteResponseTimeAverage, updatedRequestCount.deleteRequestsCount - 1, responseTime);
                break;
        }
        this.globalResponseTimeAverage = StatisticsService.computeAverage(this.globalResponseTimeAverage, updatedRequestCount.globalRequestsCount - 1, responseTime);
    }
}
