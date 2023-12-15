let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let voucherNumCodeEntity = "AT17C47D1409580006.AT17C47D1409580006.VoucherNumCode";
    let voucherNumCodeBillnum = "ybc38ee7e9List";
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let apiResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(request));
    let apiObject = JSON.parse(apiResponse);
    if (apiObject.code == 200) {
      let itemDatas = apiObject.data;
      var insertDatas = [];
      for (var i = 0; i < itemDatas.length; i++) {
        var rowData = itemDatas[i];
        let messagesReturn = rowData.messages;
        if (messagesReturn.length > 200) {
          var messagesStr = substring(messagesReturn, 0, 199);
          rowData["messages"] = messagesStr;
        }
        var newData = {
          voucherId: rowData.voucherId,
          voucherCodeSap: rowData.voucherCodeSap,
          statusLine: rowData.statusLine,
          voucherIndex: rowData.voucherIndex,
          messages: rowData.messages
        };
        insertDatas.push(newData);
      }
      if (itemDatas.length > 0) {
        var res = ObjectStore.updateBatch(voucherNumCodeEntity, itemDatas, voucherNumCodeBillnum);
      }
    }
    return { tip: "OK" };
  }
}
exports({ entryPoint: MyAPIHandler });