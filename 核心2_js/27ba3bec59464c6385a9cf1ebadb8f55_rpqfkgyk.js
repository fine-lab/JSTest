let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var compDate = request.complete_At;
    var salesCode = request.out_Id;
    var salesId = `select id from voucher.order.Order where code ='${salesCode}'`;
    var sales_Id = ObjectStore.queryByYonQL(salesId, "udinghuo");
    var sId = sales_Id[0].id;
    let body = {
      billnum: "voucher_order",
      datas: [
        {
          id: sId,
          code: salesCode,
          definesInfo: [
            {
              define12: compDate,
              isHead: true,
              isFree: true
            },
            {
              define13: "已完工",
              isHead: true,
              isFree: true
            }
          ]
        }
      ]
    };
    var strResponse = openLinker("POST", "https://www.example.com/", "IMP_PES", JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });