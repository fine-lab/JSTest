let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramObj = JSON.parse(param);
    let ifUrl = "https://www.example.com/"; //组织架构
    let docType = paramObj.docType;
    if (includes(docType, "org")) {
      let orgID = paramObj.orgId;
      let body = { id: orgID };
      let apiRes = openLinker("GET", ifUrl + "?id=" + orgID, "GZTBDM", JSON.stringify(body));
      return JSON.parse(apiRes);
    } else if (includes(docType, "staff")) {
      let staffUrl = "https://www.example.com/";
      let userID = paramObj.userId;
      let body = { id: userID };
      let apiRes = openLinker("POST", staffUrl, "HRED", JSON.stringify(body));
      return JSON.parse(apiRes);
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });