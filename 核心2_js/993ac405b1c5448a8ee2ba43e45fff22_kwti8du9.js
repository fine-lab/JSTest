let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 页面状态
    let InAfterSave = request.insertorUpdate;
    if (InAfterSave == "Update") {
      let Data = JSON.parse(request.data);
      let OldData = getOtherOutRecoeds([Data.id]);
      let orderItem = { data: OldData };
      let fun = extrequire("ST.rule.publicInDelete");
      let orderItemData = fun.execute(null, orderItem);
      console.log(JSON.stringify(orderItemData));
      let header = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(orderItemData.orderBody));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        if (str.errorCode != "A1000") {
          throw new Error("调用OMS采购入库取消API失败：" + JSON.stringify(str));
        }
      }
    }
    function getOtherOutRecoeds(ids) {
      var object = {
        ids: ids,
        compositions: [
          {
            name: "purInRecords"
          }
        ]
      };
      return ObjectStore.selectBatchIds("st.purinrecord.PurInRecord", object);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });