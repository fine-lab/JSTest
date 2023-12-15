let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    var object = {
      id: businessKey,
      compositions: [
        {
          name: "ssp_parter_proline_prodlineList",
          compositions: []
        }
      ]
    };
    var partner = ObjectStore.selectById("GT30659AT3.GT30659AT3.ssp_parter_proline", object);
    var workNotice = extrequire("GT30659AT3.backDefaultGroup.workNotice");
    var authItem = [];
    let getFiledCode = extrequire("GT30659AT3.backDefaultGroup.queryFieldCode");
    //授权产品线
    var certProductLineList = partner.ssp_parter_proline_prodlineList;
    var productLineIds = [];
    if (certProductLineList !== null && certProductLineList !== undefined) {
      for (var plNum = 0; plNum < certProductLineList.length; plNum++) {
        productLineIds.push(certProductLineList[plNum].prodline);
      }
      let plParam = { ids: productLineIds };
      let prolineRes = getFiledCode.execute(plParam);
      var prolineCodeArray = prolineRes.codes;
      if (prolineCodeArray !== null) {
        for (var cpxi = 0; cpxi < prolineCodeArray.length; cpxi++) {
          authItem.push({ authItemId: prolineCodeArray[cpxi], authTypeId: "PRL" });
        }
      }
    }
    var content = "【" + partner.partnerOrgName + "】产品线变更同步完成，同步结果：";
    var yhtUserId = partner.creator;
    let token_url = "https://www.example.com/" + yhtUserId;
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
        partnerCertId: "",
        name: partner.partnerOrgName,
        authItem: authItem
      };
      let query_url = "https://www.example.com/";
      let detail = postman("post", query_url, JSON.stringify(header), JSON.stringify(body));
      content = content + detail;
      d = JSON.parse(detail);
    }
    var notice = { title: "伙伴产品线变更", content: content };
    let res11 = workNotice.execute(notice);
    return d;
  }
}
exports({ entryPoint: MyAPIHandler });