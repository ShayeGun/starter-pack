import { Router } from "express";
import { makeSignature } from "../utils/make-signature";
import { GetRequest } from "../utils/request-class/get-request";
import { PostRequest } from "../utils/request-class/post-request";

const router = Router();
// `${process.env.CUSTOMER_CODE}-${process.env.NATIONAL_CODE}`

router.route('/checkData')
    .post(async (req, res) => {
        const personData = req.body

        const signature = await makeSignature(`${process.env.CUSTOMER_CODE}-${personData.NationalCode}`, `${__dirname}/../.openssl_keys/private-key.pem`)


        const reqBody = {
            caName: process.env.CA_NAME,
            customercode: process.env.CUSTOMER_CODE,
            profileName: process.env.PROFILE_NAME,
            signature,
            personData,
        }

        const request = new PostRequest(`${process.env.BASE_URL}/RegisterInfo`)
        const data = await request.setBody(reqBody).call()

        res.send(data)
    })



export { router as CARoute }