export class HttpService {

    constructor() {}

    public get(url:string, callback:Function):any {
        let xhr:XMLHttpRequest = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "json";
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback.call(null, xhr);
            }
        }
        xhr.send();
    }

    public post():any {

    }
}