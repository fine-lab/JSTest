let AbstractAPIHandler = require("AbstractAPIHandler");
class StartScanningHandler extends AbstractAPIHandler {
  execute(request) {
    let header = { "Domain-Key": "ustock" };
    let body = {
      isReturn: 0,
      keyword: "",
      billnum: "st_storecheckreality",
      codeType: "",
      snWarehouse: 2406013652047104,
      iSerialManage: false,
      isMaterial: false,
      storeCheckRange: 0,
      orgid: "youridHere",
      isGoodsPosition: true,
      transtype: "2404585276445972",
      keywords: '{"1004000001":1,"CM000001":1}'
    };
    let apiResponse = apiman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: StartScanningHandler });