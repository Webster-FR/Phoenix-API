import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {RequestCountModel} from "./models/models/request-count.model";
import {ResponseTimeAverageModel} from "./models/models/response-time-average.model";
import {ResponseTimeMaxModel} from "./models/models/response-time-max.model";
import {ContentLengthAverageModel} from "./models/models/content-length-average.model";
import {ContentLengthMaxModel} from "./models/models/content-length-max.model";
import {ContentLengthMinModel} from "./models/models/content-length-min.model";
import {ResponseTimeMinModel} from "./models/models/response-time-min.model";

@Injectable()
export class StatisticsService{

    private static requestCount = new RequestCountModel();
    private static responseTimeAverage = new ResponseTimeAverageModel();
    private static responseTimeMax = new ResponseTimeMaxModel();
    private static responseTimeMin = new ResponseTimeMinModel();
    private static contentLengthAverage = new ContentLengthAverageModel();
    private static contentLengthMax = new ContentLengthMaxModel();
    private static contentLengthMin = new ContentLengthMinModel();

    constructor(
        private readonly prismaService: PrismaService,
    ){}

    static computeAverage(currentAverage: number, currentCount: number, newValue: number): number{
        if(currentAverage === -1)
            return newValue;
        else
            return Math.round(((currentAverage * (currentCount)) + newValue) / (currentCount + 1) * 100) / 100;
    }

    static onRequestSent(method: string, responseTime: number, contentLength: number): void{
        StatisticsService.requestCount.onRequestSent(method);
        StatisticsService.responseTimeAverage.onRequestSent(method, responseTime, StatisticsService.requestCount);
        StatisticsService.responseTimeMax.onRequestSent(method, responseTime);
        StatisticsService.responseTimeMin.onRequestSent(method, responseTime);
        StatisticsService.contentLengthAverage.onRequestSent(method, contentLength, StatisticsService.requestCount);
        StatisticsService.contentLengthMax.onRequestSent(method, contentLength);
        StatisticsService.contentLengthMin.onRequestSent(method, contentLength);
    }

    async makeRecord(): Promise<void>{
        // Add record to database
        await this.prismaService.statistics.create({
            data: {
                global_request_count: StatisticsService.requestCount.globalRequestsCount,
                get_global_request_count: StatisticsService.requestCount.getRequestsCount,
                post_global_request_count: StatisticsService.requestCount.postRequestsCount,
                put_global_request_count: StatisticsService.requestCount.putRequestsCount,
                patch_global_request_count: StatisticsService.requestCount.patchRequestsCount,
                delete_global_request_count: StatisticsService.requestCount.deleteRequestsCount,

                global_response_time_average: StatisticsService.responseTimeAverage.globalResponseTimeAverage,
                get_global_response_time_average: StatisticsService.responseTimeAverage.getResponseTimeAverage,
                post_global_response_time_average: StatisticsService.responseTimeAverage.postResponseTimeAverage,
                put_global_response_time_average: StatisticsService.responseTimeAverage.putResponseTimeAverage,
                patch_global_response_time_average: StatisticsService.responseTimeAverage.patchResponseTimeAverage,
                delete_global_response_time_average: StatisticsService.responseTimeAverage.deleteResponseTimeAverage,

                global_response_time_max: StatisticsService.responseTimeMax.globalResponseTimeMax,
                get_global_response_time_max: StatisticsService.responseTimeMax.getResponseTimeMax,
                post_global_response_time_max: StatisticsService.responseTimeMax.postResponseTimeMax,
                put_global_response_time_max: StatisticsService.responseTimeMax.putResponseTimeMax,
                patch_global_response_time_max: StatisticsService.responseTimeMax.patchResponseTimeMax,
                delete_global_response_time_max: StatisticsService.responseTimeMax.deleteResponseTimeMax,

                global_response_time_min: StatisticsService.responseTimeMin.globalResponseTimeMin,
                get_global_response_time_min: StatisticsService.responseTimeMin.getResponseTimeMin,
                post_global_response_time_min: StatisticsService.responseTimeMin.postResponseTimeMin,
                put_global_response_time_min: StatisticsService.responseTimeMin.putResponseTimeMin,
                patch_global_response_time_min: StatisticsService.responseTimeMin.patchResponseTimeMin,
                delete_global_response_time_min: StatisticsService.responseTimeMin.deleteResponseTimeMin,

                global_content_length_average: StatisticsService.contentLengthAverage.globalContentLengthAverage,
                get_global_content_length_average: StatisticsService.contentLengthAverage.getContentLengthAverage,
                post_global_content_length_average: StatisticsService.contentLengthAverage.postContentLengthAverage,
                put_global_content_length_average: StatisticsService.contentLengthAverage.putContentLengthAverage,
                patch_global_content_length_average: StatisticsService.contentLengthAverage.patchContentLengthAverage,
                delete_global_content_length_average: StatisticsService.contentLengthAverage.deleteContentLengthAverage,

                global_content_length_max: StatisticsService.contentLengthMax.globalContentLengthMax,
                get_global_content_length_max: StatisticsService.contentLengthMax.getContentLengthMax,
                post_global_content_length_max: StatisticsService.contentLengthMax.postContentLengthMax,
                put_global_content_length_max: StatisticsService.contentLengthMax.putContentLengthMax,
                patch_global_content_length_max: StatisticsService.contentLengthMax.patchContentLengthMax,
                delete_global_content_length_max: StatisticsService.contentLengthMax.deleteContentLengthMax,

                global_content_length_min: StatisticsService.contentLengthMin.globalContentLengthMin,
                get_global_content_length_min: StatisticsService.contentLengthMin.getContentLengthMin,
                post_global_content_length_min: StatisticsService.contentLengthMin.postContentLengthMin,
                put_global_content_length_min: StatisticsService.contentLengthMin.putContentLengthMin,
                patch_global_content_length_min: StatisticsService.contentLengthMin.patchContentLengthMin,
                delete_global_content_length_min: StatisticsService.contentLengthMin.deleteContentLengthMin,
            }
        });

        // Reset data
        StatisticsService.requestCount = new RequestCountModel();
        StatisticsService.responseTimeAverage = new ResponseTimeAverageModel();
        StatisticsService.responseTimeMax = new ResponseTimeMaxModel();
        StatisticsService.responseTimeMin = new ResponseTimeMinModel();
        StatisticsService.contentLengthAverage = new ContentLengthAverageModel();
        StatisticsService.contentLengthMax = new ContentLengthMaxModel();
        StatisticsService.contentLengthMin = new ContentLengthMinModel();
    }

}
