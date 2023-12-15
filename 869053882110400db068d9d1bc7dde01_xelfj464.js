let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //批量插入实体
    var res1 = S4();
    var object = [
      { cCode: "202303230013", cShopID: "yourIDHere", sales_dailysonList: [{ tid: "youridHere", num: 3, cardpayment: 231 }] },
      { cCode: "202303230014", cShopID: "yourIDHere", sales_dailysonList: [{ tid: "youridHere", num: 2, cardpayment: 230 }] }
    ];
    var res = ObjectStore.insertBatch("AT17631B1817B80009.AT17631B1817B80009.sales_dailytest", object, "sales_dailytest3List");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });