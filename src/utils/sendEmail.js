
const { SendEmailCommand }= require( "@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");


const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      
      CcAddresses: [
       
      ],
      ToAddresses: [
        toAddress,
       
      ],
    },
    Message: {
   
      Body: {
      
        Html: {
          Charset: "UTF-8",
          Data: "<h1>This is email body</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is text format of email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Hello from AWS SES",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "mmartrisoyan.developer@gmail.com",
    "mariam@mountain-minds.com",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports= { run };