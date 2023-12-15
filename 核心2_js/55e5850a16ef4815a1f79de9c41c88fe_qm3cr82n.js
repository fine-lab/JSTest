let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    data.status = "2";
    //置空时间戳，一定要置空，不然单据版本不是最新
    data.pubts = null;
    ObjectStore.updateById("AT16139EE209C8000A.AT16139EE209C8000A.supplierBankAcc_sr", data);
    // 把修改完状态的最新数据筛选出来返回给前端
    const sql = "select * from AT16139EE209C8000A.AT16139EE209C8000A.supplierBankAcc_sr where id='" + data.id + "' ";
    const retobj = ObjectStore.queryByYonQL(sql);
    if (retobj != null) {
      return { data: retobj[0] };
    } else {
      return { data: data };
    }
  }
}
exports({ entryPoint: MyAPIHandler });