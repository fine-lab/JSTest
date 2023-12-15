let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (true) {
      //没法确定是否确实删除--有可能只删除部分组织
      return;
    }
    let appObj = JSON.parse(AppContext());
    let tid = appObj.currentUser.tenantId;
    let usrName = appObj.currentUser.name;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let urlStr = DOMAIN + "/yonbip/digitalModel/merchant/detail";
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let APPCODE = "GT3734AT5";
    openLinker("POST", logToDBUrl, APPCODE, JSON.stringify({ LogToDB: true, logModule: 9, description: "删除客户表", reqt: "1", resp: JSON.stringify(param), usrName: usrName }));
    let pdata = param.data[0];
    let id = pdata.id;
    let extendCustomerId = pdata.extendCustomerId;
    let extendZuZhiLeiBie = pdata.extendZuZhiLeiBie;
    let gsURI = "GT3734AT5.GT3734AT5.GongSi";
    let gsSuffix = "";
    let billNo = "3199a3d6";
    if (extendZuZhiLeiBie == 1) {
      //建机
      gsSuffix = "_JJ";
      billNo = "b979b0e9";
    } else if (extendZuZhiLeiBie == 2) {
      //环保
      gsSuffix = "_HB";
      billNo = "7b52cdac";
    } else if (extendZuZhiLeiBie == 3) {
      //游乐
      gsSuffix = "_YL";
      billNo = "04a3e644";
    }
    gsURI = gsURI + gsSuffix;
    let merchantResp = openLinker("GET", urlStr + "?id=" + id, APPCODE, JSON.stringify({ id: id }));
    let merchantRespObj = JSON.parse(merchantResp);
    openLinker("POST", logToDBUrl, APPCODE, JSON.stringify({ LogToDB: true, logModule: 9, description: "删除客户表", reqt: "2", resp: merchantResp, usrName: usrName }));
    if (merchantRespObj.code != 200) {
      let queryCustRes = ObjectStore.queryByYonQL("select id from " + gsURI + " where merchant='" + id + "'", "developplatform");
      for (var k in queryCustRes) {
        ObjectStore.updateById(gsURI, { id: queryCustRes[k].id, merchant: "", isRelated: false, relateArchTime: "" }, billNo);
        openLinker("POST", logToDBUrl, APPCODE, JSON.stringify({ LogToDB: true, logModule: 9, description: "删除客户表", reqt: "", resp: "", usrName: usrName }));
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });