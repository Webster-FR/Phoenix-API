export class RequestCountModel{
    public globalRequestsCount = 0;
    public getRequestsCount = 0;
    public postRequestsCount = 0;
    public putRequestsCount = 0;
    public patchRequestsCount = 0;
    public deleteRequestsCount = 0;

    onRequestSent(method: string): void{
        switch (method){
            case "GET":
                this.getRequestsCount++;
                break;
            case "POST":
                this.postRequestsCount++;
                break;
            case "PUT":
                this.putRequestsCount++;
                break;
            case "PATCH":
                this.patchRequestsCount++;
                break;
            case "DELETE":
                this.deleteRequestsCount++;
                break;
        }
        this.globalRequestsCount++;
    }
}
