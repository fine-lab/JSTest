let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dateApi = extrequire("B2Bpricing.utils.getDataNow");
    let dateResultBeforOne = dateApi.execute(null, new Date(new Date().getTime() + 28200000)); //十分钟前的时间
    let dateResult = dateApi.execute(null, new Date(new Date().getTime() + 28800000)); //当前时间
    let startDate = dateResultBeforOne.dateView;
    let endDate = dateResult.dateView;
    startDate = "2023-09-12 00:00:00";
    endDate = "2023-09-12 23:59:59";
    var sqlTjd =
      "select * from marketing.price.PriceRecord where (priceTemplateId = 'yourIdHere' or priceTemplateId = 'yourIdHere') and enable = 0 and 	expireTime >= '" +
      startDate +
      "' and 	expireTime <= '" +
      endDate +
      "'";
    var resTjd = ObjectStore.queryByYonQL(sqlTjd, "marketingbill");
    for (let x = 0; x < resTjd.length; x++) {
      let bodyOms = {
        appCode: "beiwei-base-data", //应用编码
        appApiCode: "item.price.stop.interface", //接口编码
        schemeCode: "beiwei_bd", //方案编码
        jsonBody: {
          priceId: resTjd[x].id,
          status: 0
        }
      };
      let headerOms = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("POST", "http://47.100.73.161:888/api/unified", JSON.stringify(headerOms), JSON.stringify(bodyOms));
      strResponse = JSON.parse(strResponse);
      if (strResponse.success == "false") {
        throw new Error("========价格表同步OMS报错========");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });