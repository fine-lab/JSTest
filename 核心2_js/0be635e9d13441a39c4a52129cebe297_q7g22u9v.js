let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0];
    throw new Error("========nima" + JSON.stringify(bill));
    if (!queryUtils.isEmpty(bill["source"]) && bill["source"].indexOf("developplatform") >= 0) {
      //这个是检验单id
      let id = bill["goodChanges"][0].bodyItem.define4;
      //库存状态调整单件数
      let stockstatuschangesubqty = bill.subQty;
      //库存状态调整单id
      let stockstatuschangeid = bill.id;
      //库存状态调整单数量
      let stockstatuschangeqty = bill.qty;
      //库存状态调整单编码
      let stockstatuschangecode = bill.code;
      var object = {
        id: id,
        stockstatuschangesubqty: stockstatuschangesubqty,
        stockstatuschangeid: stockstatuschangeid,
        stockstatuschangeqty: stockstatuschangeqty,
        stockstatuschangecode: stockstatuschangecode
      };
      let func1 = extrequire("ustock.backDefaultGroup.getOpenApiToken");
      let res = func1.execute();
      var hmd_contenttype = "application/json;charset=UTF-8";
      let header = {
        "Content-Type": hmd_contenttype
      };
      var token = res.access_token;
      let base_path = "https://www.example.com/";
      // 请求数据
      var str = JSON.stringify(object);
      let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), str);
      var obj = JSON.parse(apiResponse);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });