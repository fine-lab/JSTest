let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute() {
    let apiResponse = apiman("post", "https://www.example.com/", '{"Content-Type":"multipart/form-data"}', {
      useTime: 3,
      applicantEmail: "https://www.example.com/",
      startTime: 2020 - 10 - 19
    });
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });