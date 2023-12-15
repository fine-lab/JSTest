let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取保存时的类型，如果不是import则放行
    let requestAction = param.requestAction;
    if (requestAction != "import") {
      return {};
    }
    let func = extrequire("GT37595AT2.commonFun.checkVendorPush");
    let res = func.execute(context, param);
    let vendorIdToVendor = res.vendorIdToVendor || {};
    let data = param.data;
    for (let i = 0; i < data.length; i++) {
      let sql =
        "select *, main.creation_date as create_time, main.id as mainId,main.vendorId as vendorId from	GT37595AT2.GT37595AT2.shippingscheduleb left join GT37595AT2.GT37595AT2.shippingschedule main " +
        " on main.id = shippingschedule_id  where shippingschedule_id = '" +
        data[i].id +
        "'";
      var localData = ObjectStore.queryByYonQL(sql);
      if (localData && localData.length == 0) {
        throw new Error("要货计划主表不存在,请检查数据");
      }
      let vendorId = localData[0].vendorId;
      if (vendorIdToVendor[vendorId] && vendorIdToVendor[vendorId].extendPushDown) {
        throw new Error("接口下推的数据，禁止通过导入方式进行要货计划回复！");
      }
      let details = data[i].shippingschedulebList;
      let dataStatuRely;
      details &&
        details.forEach((item) => {
          if (!dataStatuRely && item.supplier_feedback_cpd) {
            dataStatuRely = "5"; // 预计交期回复
          }
          if (item.supplier_feedback_apd) {
            dataStatuRely = "6"; // 实际交期回复
          }
          if (item.id) {
            item.set("_status", "Update");
          }
        });
      if (data[i].shippingscheduleSN && data[i].shippingscheduleSN.length > 0) {
        dataStatuRely = "7"; // sn信息回复
      }
      if (dataStatuRely) {
        data[i].set("dataStatus", dataStatuRely);
      }
      data[i].set("_status", "Update");
    }
    param.requestData.set("_status", "Update");
    param.requestData.set("id", data[0].id);
    param.set("importMode", 1);
    param.set("id", data[0].id);
    return {};
  }
}
exports({ entryPoint: MyTrigger });