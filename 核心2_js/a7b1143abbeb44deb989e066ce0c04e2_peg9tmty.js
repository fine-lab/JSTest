let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 主表id
    var Mainid = request.mainId;
    var id = request.id;
    var arrList = JSON.stringify(request.ArrList);
    var ArrayList = request.ArrayList;
    var messageData = request.messageData;
    var pageState = request.pageState;
    // 查询入库单子表
    let sqls = "select id from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where WarehousingAcceptanceSheet_id = '" + Mainid + "'";
    var List = ObjectStore.queryByYonQL(sqls);
    if (pageState == 1) {
      if (List.length > 0) {
        for (let j = 0; j < List.length; j++) {
          // 子表id
          let Sid = List[j].id;
          // 更新
          var object = [{ id: Mainid, storageState: "3", Confirmthestatus: "0", remark: messageData, product_lisList: ArrayList }];
          var res = ObjectStore.updateBatch("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
        }
      }
    } else {
      // 查询入库单子表
      let sql = "select id from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where WarehousingAcceptanceSheet_id = '" + id + "'";
      var list = ObjectStore.queryByYonQL(sqls);
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          // 子表id
          let Sunid = list[i].id;
          // 更新
          var JSobject = [{ id: Mainid, product_lisList: ArrayList }];
          var Res = ObjectStore.updateBatch("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", JSobject, "e84ee900");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });