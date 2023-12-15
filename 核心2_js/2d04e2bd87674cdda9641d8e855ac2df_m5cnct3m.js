let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let body = {};
    var biz_center = "YonBIPTP";
    var grant_type = "client_credentials";
    var client_secret =
      "UPKs4zh%2F88aIfkTaNAINXV4D6bOapBMxegSDP%2BlzNCDigVnKLiyJ3m0CEqMCnK5bRgffhdmyhx6CYOGsp6%2Fzx1sAxRzNEQWPkSbE5MZdT3FfVqbuLyDgdLpJnsvmnuBkUPmVxaBADGwLcQQ1x5jA5vs5Dj7S9JEjs04gat3IosslQ0PVrqL3044TGxJIoExO7VxrnjIG14u4za3Z%2BA7EmZ8vCNPhWdZCnaifNpYks2Pcy93FkT7R6%2Bl6exsVv3xOGEDmifoI9gizsNtBvwcF0Ua5JLdlnSD3Mru3lXaQ7DTj1ZAHqm9wUZwmBfSgMCvZWVoMOD07jC2SJQzzkZtpaw%3D%3D";
    var client_id = "youridHere";
    var signature = "eb1c2902e1809046f11a1d552b3df88c5efbcd45e30c53026d9eb54fec7937f1";
    var apiResponse = postman(
      "post",
      "https://www.example.com/" +
        biz_center +
        "&grant_type=" +
        grant_type +
        "&client_secret=" +
        client_secret +
        "&client_id=" +
        client_id +
        "&signature=" +
        signature,
      JSON.stringify(header),
      JSON.stringify(body)
    );
    return { data: apiResponse };
  }
}
exports({ entryPoint: MyTrigger });