let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    var object = {
      id: businessKey
    };
    var res = ObjectStore.selectById("GT30659AT3.GT30659AT3.ssp_parter_close", object);
    var typeMap = new Map();
    typeMap.set("1", "00103"); //暂停
    typeMap.set("2", "00104"); //注销
    var typeMapName = new Map();
    typeMapName.set("1", "暂停"); //暂停
    typeMapName.set("2", "注销"); //注销
    var content = "【" + res.parterOrgName + "】资质" + typeMapName.get(res.cancelType) + "同步完成，同步结果：";
    let token_url = "https://www.example.com/" + res.creator;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var d;
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let header = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var body = {
        partnerType: "3",
        status: typeMap.get(res.cancelType),
        name: res.parterOrgName
      };
      let query_url = "https://www.example.com/";
      let detail = postman("post", query_url, JSON.stringify(header), JSON.stringify(body));
      content = content + detail;
      d = JSON.parse(detail);
    }
    var notice = { title: "伙伴资质注销申请", content: content };
    let workNotice = extrequire("GT30659AT3.backDefaultGroup.workNotice");
    let res11 = workNotice.execute(notice);
    return d;
  }
}
exports({ entryPoint: MyAPIHandler });