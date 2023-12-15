let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let urlStr = DOMAIN + "/yonbip/digitalModel/merchant/detail";
    let merchantResp = openLinker("GET", urlStr + "?id=" + id, APPCODE, JSON.stringify({ id: id }));
    let merchantRespObj = JSON.parse(merchantResp);
    if (merchantRespObj.code != 200) {
      let queryCustRes = ObjectStore.queryByYonQL("select id from " + gsURI + " where merchant='" + id + "'", "developplatform");
      for (var k in queryCustRes) {
        ObjectStore.updateById(gsURI, { id: queryCustRes[k].id, merchant: "", isRelated: false, relateArchTime: "" }, billNo);
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });