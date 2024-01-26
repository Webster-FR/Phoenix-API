export class ContentLengthMaxModel{
    public globalContentLengthMax = -1;
    public getContentLengthMax = -1;
    public postContentLengthMax = -1;
    public putContentLengthMax = -1;
    public patchContentLengthMax = -1;
    public deleteContentLengthMax = -1;

    onRequestSent(method: string, contentLength: number): void{
        switch (method){
            case "GET":
                this.getContentLengthMax = Math.max(this.getContentLengthMax, contentLength);
                break;
            case "POST":
                this.postContentLengthMax = Math.max(this.postContentLengthMax, contentLength);
                break;
            case "PUT":
                this.putContentLengthMax = Math.max(this.putContentLengthMax, contentLength);
                break;
            case "PATCH":
                this.patchContentLengthMax = Math.max(this.patchContentLengthMax, contentLength);
                break;
            case "DELETE":
                this.deleteContentLengthMax = Math.max(this.deleteContentLengthMax, contentLength);
                break;
        }
        this.globalContentLengthMax = Math.max(this.globalContentLengthMax, contentLength);
    }
}
