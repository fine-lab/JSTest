let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var DOMAIN = "https://www.example.com/"; //https://c2.yonyoucloud.com/iuap-api-gateway
    let paramObj = JSON.parse(param);
    let ifUrl = DOMAIN + "/yonbip/digitalModel/admindept/detail"; //组织架构
    let docType = paramObj.docType;
    if (includes(docType, "org")) {
      let orgID = paramObj.orgId;
      let body = { id: orgID };
      let apiRes = openLinker("GET", ifUrl + "?id=" + orgID, "GZTBDM", JSON.stringify(body));
      return JSON.parse(apiRes);
    } else if (includes(docType, "staff")) {
      let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail";
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