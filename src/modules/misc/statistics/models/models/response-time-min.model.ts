export class ResponseTimeMinModel{
    public globalResponseTimeMin = -1;
    public getResponseTimeMin = -1;
    public postResponseTimeMin = -1;
    public putResponseTimeMin = -1;
    public patchResponseTimeMin = -1;
    public deleteResponseTimeMin = -1;

    onRequestSent(method: string, responseTime: number): void{
        switch (method){
            case "GET":
                if(this.getResponseTimeMin === -1)
                    this.getResponseTimeMin = responseTime;
                else
                    this.getResponseTimeMin = Math.min(this.getResponseTimeMin, responseTime);
                break;
            case "POST":
                if(this.postResponseTimeMin === -1)
                    this.postResponseTimeMin = responseTime;
                else
                    this.postResponseTimeMin = Math.min(this.postResponseTimeMin, responseTime);
                break;
            case "PUT":
                if(this.putResponseTimeMin === -1)
                    this.putResponseTimeMin = responseTime;
                else
                    this.putResponseTimeMin = Math.min(this.putResponseTimeMin, responseTime);
                break;
            case "PATCH":
                if(this.patchResponseTimeMin === -1)
                    this.patchResponseTimeMin = responseTime;
                else
                    this.patchResponseTimeMin = Math.min(this.patchResponseTimeMin, responseTime);
                break;
            case "DELETE":
                if(this.deleteResponseTimeMin === -1)
                    this.deleteResponseTimeMin = responseTime;
                else
                    this.deleteResponseTimeMin = Math.min(this.deleteResponseTimeMin, responseTime);
                break;
        }
    }
}
