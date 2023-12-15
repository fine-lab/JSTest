let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productId = request.productId;
    let batchno = request.batchno;
    //查询采购入库单子表
    let purChildSql = "select mainid from st.purinrecord.PurInRecords where product='" + productId + "' and batchno = '" + batchno + "'";
    let purChildRes = ObjectStore.queryByYonQL(purChildSql); //, "ustock"
    let purMasterRes = [];
    if (purChildRes.length > 0) {
      //查询采购入库单主表
      let purMasterSql = "select vendor from st.purinrecord.PurInRecord where id=" + purChildRes[0].mainid;
      purMasterRes = ObjectStore.queryByYonQL(purMasterSql, "ustock");
    }
    return { purMasterRes };
  }
}
exports({ entryPoint: MyAPIHandler });