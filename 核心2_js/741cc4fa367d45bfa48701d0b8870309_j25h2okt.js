let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestDataList = param.requestData;
    let requestData = requestDataList[0];
    if (requestData.bustype_name == "工厂间调拨入库" && requestData.bustype_name == "工厂与物流仓间调拨入库") {
      let details = requestData.details;
      if (details != undefined) {
        for (var i = 0; i < details.length; i++) {
          let storeProRecord = details[i];
          let bodyItem = storeProRecord.bodyItem;
          //待检
          if (bodyItem.define1 == "01") {
            storeProRecord.stockStatusDoc = "1479622384030842885";
            //放行
          } else if (bodyItem.define1 == "02") {
            storeProRecord.stockStatusDoc = "1479622495685836808";
            //禁用
          } else if (bodyItem.define1 == "03") {
            storeProRecord.stockStatusDoc = "1479622753376010241";
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });