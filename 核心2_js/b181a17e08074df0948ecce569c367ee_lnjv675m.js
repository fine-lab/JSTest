let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var txtID = request.txtID;
    //如果切块资金子表fund_cut_id=txtID，说明这个资金主表是通过该切块子表下推生成的，是该切块子表的下级主表
    var sql = "select id from GT35175AT8.GT35175AT8.HyFund_MTB where fund_cut_id = " + txtID;
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    var id = res[0].id;
    //修改切块子表数据   txtID是切块子表的id
    var object = { id: txtID, create_downfund: "1", down_fund_MTB: id, adjust_state: "0" };
    var res1 = ObjectStore.updateById("GT35175AT8.GT35175AT8.HyFund_cut", object, "button20kg");
    return { res1: res1 };
  }
}
exports({ entryPoint: MyAPIHandler });