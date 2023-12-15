let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let X_HW_ID = "yourIDHere";
    let X_HW_APPKEY = "yourKEYHere";
    let factoryInventoryList = [];
    let testData = {
      vendorFactoryCode: "YT102701150001",
      vendorItemCode: "test",
      customerCode: "157",
      vendorStock: "test",
      vendorLocation: "test",
      stockTime: "2017-06-01",
      vendorItemRevision: "test",
      goodQuantity: 300,
      inspectQty: 10,
      faultQty: 1
    };
    factoryInventoryList.push(testData);
    let body = { factoryInventoryList: factoryInventoryList };
    let header = {
      "X-HW-ID": X_HW_ID,
      "X-HW-APPKEY": X_HW_APPKEY,
      "Content-Type": "application/json"
    };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    let responseJson = JSON.parse(strResponse);
    //根据接口请求结果构建返回信息
    let retData = {
      success: responseJson.success,
      message: responseJson.errorMessage || responseJson.message || "",
      responseJson: responseJson
    };
    return retData;
  }
}
exports({ entryPoint: MyTrigger });