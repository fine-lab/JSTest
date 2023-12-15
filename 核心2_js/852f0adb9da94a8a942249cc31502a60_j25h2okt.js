let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.requestData;
    let storeProRecords = requestData.purInRecords;
    if (storeProRecords != undefined) {
      for (var i = 0; i < storeProRecords.length; i++) {
        let storeProRecord = storeProRecords[i];
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
exports({ entryPoint: MyTrigger });