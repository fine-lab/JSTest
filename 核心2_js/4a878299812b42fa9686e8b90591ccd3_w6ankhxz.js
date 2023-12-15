let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 如果域名包含 dbox，  dev-irc1.yonisv.com
    // 如果域名包含 core1， core1-irc1.yonisv.com
    // 如果域名包含 core3， core3-irc1.yonisv.com
    // 生产环境 pro-irc1.yonisv.com
    const urls = {
      dbox: "https://www.example.com/",
      core1: "https://www.example.com/",
      core3: "https://www.example.com/",
      prod: "https://www.example.com/"
    };
    const locationUrl = request.locationUrl;
    let resp;
    if (locationUrl.indexOf("dbox") > -1) {
      resp = urls.dbox;
    } else if (locationUrl.indexOf("core1") > -1) {
      resp = urls.core1;
    } else if (locationUrl.indexOf("core3") > -1) {
      resp = urls.core3;
    } else {
      resp = urls.prod;
    }
    return { resp: resp };
  }
}
exports({ entryPoint: MyAPIHandler });