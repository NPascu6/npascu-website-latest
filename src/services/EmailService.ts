import { RestService } from "./RestService";

const EMAIL_API = import.meta.env.VITE_EMAIL_API;

export class EmailService extends RestService {
    private _endpoint = EMAIL_API;

    async sendContactEmail(name: string, email: string, message: string): Promise<any> {
        if (!this._endpoint) {
            return Promise.reject("Email service not configured");
        }
        return this.postData(this._endpoint, { name, email, message }).then((res) => {
            if (typeof res === "string") {
                return res;
            }
            return res.data;
        });
    }
}
