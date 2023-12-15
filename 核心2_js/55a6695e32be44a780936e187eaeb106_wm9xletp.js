let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //通过用户ID查询员工信息
    let base_path = "https://www.example.com/";
    var body = {
      srcSystemCode: "figl",
      accbookCode: "01",
      voucherTypeCode: "1",
      makerMobile: "13116169127",
      bodies: [
        {
          description: "凭证摘要",
          accsubjectCode: "3",
          debitOriginal: 13.0,
          debitOrg: 13.0,
          rateType: "01",
          settlementModeCode: "00026",
          billTime: "2021-08-23",
          billNo: "10001",
          bankVerifyCode: "20001"
        },
        {
          description: "凭证摘要",
          accsubjectCode: "4",
          creditOriginal: 13.0,
          creditOrg: 13.0,
          rateType: "01"
        }
      ]
    };
    //请求数据
    let apiResponse = openLinker("post", base_path, "GT87848AT43", JSON.stringify(body));
    throw new Error(JSON.stringify(apiResponse));
    return {};
  }
}
exports({ entryPoint: MyTrigger });