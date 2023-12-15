let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let paramObj = JSON.parse(param);
    let ifUrl = DOMAIN + "/yonbip/digitalModel/admindept/detail"; //组织架构
    let docType = paramObj.docType;
    if (includes(docType, "org")) {
      let orgID = paramObj.orgId;
      let body = { id: orgID };
      let apiRes = openLinker("GET", ifUrl + "?id=" + orgID, "GT3734AT5", JSON.stringify(body)); //GZTBDM
      return JSON.parse(apiRes);
    } else if (includes(docType, "staff")) {
      let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail";
      let userID = paramObj.userId;
      let body = { id: userID };
      let apiRes = openLinker("POST", staffUrl, "GT3734AT5", JSON.stringify(body)); //HRED
      return JSON.parse(apiRes);
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });