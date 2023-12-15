let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let return_info = [];
    let Info = [];
    let id = request.id;
    let uri = request.uri;
    //查询调整单
    let stocksql = "select  mainid.code  from st.stockstatuschange.StockStatusChanges where  sourceid =" + id;
    let changesList = ObjectStore.queryByYonQL(stocksql, "ustock");
    if (changesList != null && changesList.length > 0) {
      let mainid_code = changesList[0].mainid_code;
      let memo = "已经生成调整单" + mainid_code + "不允许在下推!\n";
      return_info.push(memo);
    }
    let sql = "select bIsStockState,code from GT22176AT10.GT22176AT10.SY01_bad_drugv7 where  id =" + id;
    let List = ObjectStore.queryByYonQL(sql);
    for (let i = 0; i < List.length; i++) {
      let bIsStockState = List[i].bIsStockState;
      let code = List[i].code;
      if (bIsStockState == "1") {
        let memo = "单据号:" + code + " 已经生成调整单不允许在下推\n";
        return_info.push(memo);
      }
    }
    let sqldetail = "select stockstate,warehouse from GT22176AT10.GT22176AT10.SY01_unqualison7 where  SY01_bad_drugv2_id =" + id;
    let Listdetail = ObjectStore.queryByYonQL(sqldetail);
    for (let i = 0; i < Listdetail.length; i++) {
      let stockstate = Listdetail[i].stockstate;
      let warehouse = Listdetail[i].warehouse;
      if (stockstate == undefined) {
        return_info.push("库存状态不能为空！\n");
      }
      if (warehouse == undefined) {
        return_info.push("仓库不能为空！\n");
      }
    }
    let count = 0;
    for (var i = 0; i < return_info.length; i++) {
      count += 1;
      Info += return_info[i];
    }
    if (Info.length > 0) {
      return { Info };
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyAPIHandler });