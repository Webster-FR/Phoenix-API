import {StatisticsService} from "../../statistics.service";
import {RequestCountModel} from "./request-count.model";

export class ContentLengthAverageModel{
    public globalContentLengthAverage = -1;
    public getContentLengthAverage = -1;
    public postContentLengthAverage = -1;
    public putContentLengthAverage = -1;
    public patchContentLengthAverage = -1;
    public deleteContentLengthAverage = -1;

    onRequestSent(method: string, contentLength: number, updatedRequestCount: RequestCountModel): void{
        switch (method){
            case "GET":
                this.getContentLengthAverage = StatisticsService.computeAverage(this.getContentLengthAverage, updatedRequestCount.getRequestsCount - 1, contentLength);
                break;
            case "POST":
                this.postContentLengthAverage = StatisticsService.computeAverage(this.postContentLengthAverage, updatedRequestCount.postRequestsCount - 1, contentLength);
                break;
            case "PUT":
                this.putContentLengthAverage = StatisticsService.computeAverage(this.putContentLengthAverage, updatedRequestCount.putRequestsCount - 1, contentLength);
                break;
            case "PATCH":
                this.patchContentLengthAverage = StatisticsService.computeAverage(this.patchContentLengthAverage, updatedRequestCount.patchRequestsCount - 1, contentLength);
                break;
            case "DELETE":
                this.deleteContentLengthAverage = StatisticsService.computeAverage(this.deleteContentLengthAverage, updatedRequestCount.deleteRequestsCount - 1, contentLength);
                break;
        }
        this.globalContentLengthAverage = StatisticsService.computeAverage(this.globalContentLengthAverage, updatedRequestCount.globalRequestsCount - 1, contentLength);
    }
}
