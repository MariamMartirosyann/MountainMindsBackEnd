const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRecuest");

cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequest = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequest.map((request) => request.toUserId.emailId)),
    ];
    console.log(listOfEmails);

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New friend request pending for" + email,
          "There are so many friend requests, please login monutain-minds.com to check the requests"
        );
        console.log(res)
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
