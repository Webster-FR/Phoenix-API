export class ResponseTimeMaxModel{
    public globalResponseTimeMax = -1;
    public getResponseTimeMax = -1;
    public postResponseTimeMax = -1;
    public putResponseTimeMax = -1;
    public patchResponseTimeMax = -1;
    public deleteResponseTimeMax = -1;

    onRequestSent(method: string, responseTime: number): void{
        switch (method){
            case "GET":
                this.getResponseTimeMax = Math.max(this.getResponseTimeMax, responseTime);
                break;
            case "POST":
                this.postResponseTimeMax = Math.max(this.postResponseTimeMax, responseTime);
                break;
            case "PUT":
                this.putResponseTimeMax = Math.max(this.putResponseTimeMax, responseTime);
                break;
            case "PATCH":
                this.patchResponseTimeMax = Math.max(this.patchResponseTimeMax, responseTime);
                break;
            case "DELETE":
                this.deleteResponseTimeMax = Math.max(this.deleteResponseTimeMax, responseTime);
                break;
        }
        this.globalResponseTimeMax = Math.max(this.globalResponseTimeMax, responseTime);
    }
}
