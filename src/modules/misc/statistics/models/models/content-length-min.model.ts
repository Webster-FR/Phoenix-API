export class ContentLengthMinModel{
    public globalContentLengthMin = -1;
    public getContentLengthMin = -1;
    public postContentLengthMin = -1;
    public putContentLengthMin = -1;
    public patchContentLengthMin = -1;
    public deleteContentLengthMin = -1;

    onRequestSent(method: string, contentLength: number): void{
        switch (method){
            case "GET":
                if(this.getContentLengthMin === -1)
                    this.getContentLengthMin = contentLength;
                else
                    this.getContentLengthMin = Math.min(this.getContentLengthMin, contentLength);
                break;
            case "POST":
                if(this.postContentLengthMin === -1)
                    this.postContentLengthMin = contentLength;
                else
                    this.postContentLengthMin = Math.min(this.postContentLengthMin, contentLength);
                break;
            case "PUT":
                if(this.putContentLengthMin === -1)
                    this.putContentLengthMin = contentLength;
                else
                    this.putContentLengthMin = Math.min(this.putContentLengthMin, contentLength);
                break;
            case "PATCH":
                if(this.patchContentLengthMin === -1)
                    this.patchContentLengthMin = contentLength;
                else
                    this.patchContentLengthMin = Math.min(this.patchContentLengthMin, contentLength);
                break;
            case "DELETE":
                if(this.deleteContentLengthMin === -1)
                    this.deleteContentLengthMin = contentLength;
                else
                    this.deleteContentLengthMin = Math.min(this.deleteContentLengthMin, contentLength);
                break;
        }
        if(this.globalContentLengthMin === -1)
            this.globalContentLengthMin = contentLength;
        else
            this.globalContentLengthMin = Math.min(this.globalContentLengthMin, contentLength);
    }
}
