import { AzureFunction, Context, Form, HttpRequest } from "@azure/functions"
import * as vcard from 'vcard3';
import * as multipart from "parse-multipart";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const method = req.method;

    if (method == "GET") {
        context.log('INFO - GET - returning the upload form');
        context.res = {
            headers: {
                "Content-Type": "text/html",
             },
             // status: 200, /* Defaults to 200 */
             body: `<html>
             <head></head>
             <body>
             <p>Hi! Welcome to vcardecho. Please upload your vcard:</p>
             <form action="vcardecho" method="post" enctype="multipart/form-data">
                <input type="file" id="vcardfile" name="vcardfile">
                <input type="submit">
            </form>
            </body>
            </html>`   
        };
        return;
    }

    if (method != "POST") {
        context.log('ERROR - ${method} - unknown method');
        context.res = {
            headers: {
                "Content-Type": "text/html",
             },
             status: 405,
             body: `<html>
             <head></head>
             <body>
             <p>Expected a GET or POST</p>
            </body>
            </html>`   
        };
        return
    }

    context.log(`INFO - POST - processing the vcard - body length = ${req.body.length}`);

    const bodyBuffer = Buffer.from(req.body);
    const boundary = multipart.getBoundary(req.headers["content-type"]);
    const parts = multipart.Parse(bodyBuffer, boundary);

    context.log(`INFO - POST - parsed the multipart: ${parts.length}`);

    let fileBuffer: Buffer = parts[0]?.data;
    //let body = fileBuffer.toString('base64');
    let body = fileBuffer.toString();

    context.log(`INFO - POST - body: ${body.length}`);

    let card = vcard.VCARD(body); //.parsedVcard; // as vcard4.ParsedVcard;
     
    console.error({
        msg: "card keys",
        keys: Object.keys(card)
    });

    //context.log(`INFO - POST - file content is '${fileContent}'`);

    const contentType="Content-Type: text/x-vcard;charset=utf-8;";
    // const converted = toBinary(fileContent);
    //const body = btoa(fileBuffer);
    const contentDisposition = "attachment";
    
    let url=`http://localhost/7071/api/vcardecho?data=${body}`

    const responseMessage = `contentType: ${contentType}
    body: ${body}`;
    
    context.res = {
        headers: {
           "Content-Type": contentType,
          // "Content-Disposition": contentDisposition,
           //filename,
        },
        status: 200,
        body: url
    };

};

export default httpTrigger;