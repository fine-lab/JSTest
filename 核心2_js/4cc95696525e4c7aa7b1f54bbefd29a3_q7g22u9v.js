let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let status = data._status;
    if (status == "Insert") {
      let sourceid = data.details[0].firstsourceid;
      //根据来源id获取调拨订单的自定义项
      var sql = "select define4 from st.transferapply.TransferApplyCustomItem where id= " + sourceid;
      var res = ObjectStore.queryByYonQL(sql, "ustock");
      if (data.bizType == 1 && res && res[0] != undefined && res[0].define4 == "是") {
        let details = data.details;
        for (let i = 0; i < details.length; i++) {
          let detail = details[i];
          detail.set("qty", "0");
          detail.set("subQty", "0");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });