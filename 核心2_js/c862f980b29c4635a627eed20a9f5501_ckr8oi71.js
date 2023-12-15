let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var alldata = request.data[0];
    var zid = alldata.id;
    //数据库编码
    var code = "AT17604A341D580008.AT17604A341D580008.Expense_sheet";
    let url = "https://www.example.com/" + code;
    let apiResponse = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(alldata));
    var jsonALL = JSON.parse(apiResponse);
    if (jsonALL.code === "200") {
      var voucherid = jsonALL.eventInfo.srcBusiId;
      var BillVersion = jsonALL.eventInfo.srcBillVersion;
      BillVersion = BillVersion + "";
      //凭证id
      var object = { id: voucherid, isVoucher: "1", srcBillVersion: BillVersion };
      var res = ObjectStore.updateById("AT17604A341D580008.AT17604A341D580008.Expense_sheet", object, "Expensesheet");
      return { jsonALL };
    } else {
      throw new Error("  -- 生成凭证失败 -- ");
    }
    return { jsonALL };
  }
}
exports({ entryPoint: MyAPIHandler });