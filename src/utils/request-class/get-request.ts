import { ApiRequest, Methods } from "./api-request";
import axios from "axios";

interface IGetRequest {
    method: Methods.get,
    url: string
    header: Record<string, string>
    params?: Record<string, string>
}

const header = {
    'Accept-Encoding': 'UTF8',
    'Content-Encoding': 'UTF8',
    'Content-Type': 'application/json'
}

class GetRequest extends ApiRequest<IGetRequest> {

    method: IGetRequest["method"] = Methods.get
    url: IGetRequest['url']
    header: IGetRequest['header'] = header
    private params?: IGetRequest['params']

    constructor(url: IGetRequest['url'] = 'https://postman-echo.com/status/200', params?: IGetRequest['params']) {
        super();
        this.url = url
        if (params) this.params = params
    }

    // FIX:
    setHeader(header: IGetRequest['header']) {
        this.header = header

        return this
    }

    async call(): Promise<any> {
        let requestConfig: IGetRequest = {
            url: this.url,
            method: this.method,
            header: this.header,
        }

        if (this.params) requestConfig.params = this.params
        const { data } = await axios(requestConfig)

        return data
    }
}

export { GetRequest }