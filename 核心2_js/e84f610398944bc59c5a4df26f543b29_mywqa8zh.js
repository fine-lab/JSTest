let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //同步智保云佣金数据
    let beginTime = param != undefined && param.end != undefined ? param.begin + " 23:59:59" : getTime(new Date());
    let endTime = param != undefined && param.begin != undefined ? param.begin + " 00:00:00" : getTime(new Date(new Date().setDate(new Date().getDate() - 1)));
    let tenantId = ObjectStore.env().tenantId;
    let funcToken = extrequire("AT175542E21C400007.backDefaultGroup.getTokenZby");
    let resToken = funcToken.execute(null, null);
    let access_token = JSON.parse(resToken.apiResponse).access_token;
    let getBipUrl = "https://www.example.com/" + tenantId;
    let header = { "content-type": "application/json;charset=utf-8" };
    let bipUrlResponse = postman("get", getBipUrl, JSON.stringify(header), null);
    bipUrlResponse = JSON.parse(bipUrlResponse);
    let tokenUrl = bipUrlResponse.data.tokenUrl;
    let bipUrl = bipUrlResponse.data.gatewayUrl;
    var akasSql = "select appkey,appsecret from   AT175542E21C400007.AT175542E21C400007.akAndAsInfo";
    var resAkAs = ObjectStore.queryByYonQL(akasSql);
    var collection = resAkAs[0];
    let bip_appkey = collection.appkey;
    let bip_secret = collection.appsecret;
    //获取所有组织
    let orgCodeList = new Array();
    let getOrgListUrl = bipUrl + "/yonbip/uspace/org/page_list";
    let size = 50;
    let index = 1;
    let orgParam = {
      index: index,
      size: size
    };
    while (true) {
      let orgResponse = openLinker("POST", getOrgListUrl, "AT175542E21C400007", JSON.stringify(orgParam));
      orgResponse = JSON.parse(orgResponse);
      let content = orgResponse.data.content;
      for (let i = 0; i < content.length; i++) {
        orgCodeList.push(content[i].code);
      }
      if (content.length < size) {
        break;
      } else {
        index += 1;
      }
    }
    let body = {
      tenantId: tenantId,
      date: endTime + "," + beginTime,
      access_token: access_token,
      tokenUrl: tokenUrl,
      bipUrl: bipUrl,
      orgCodeList: orgCodeList,
      bipAppkey: bip_appkey,
      bipSecret: bip_secret
    };
    //调用外部服务
    let wbUrl = "http://123.57.144.10:8899/payAble/syncZbyPayAble";
    postman("post", wbUrl, JSON.stringify(header), JSON.stringify(body));
    function getTime(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
      var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      var todayDate = year + "-" + month + "-" + day + " " + "00:00:00";
      return todayDate;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });