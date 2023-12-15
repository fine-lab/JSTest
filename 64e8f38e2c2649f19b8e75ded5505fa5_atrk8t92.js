let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    let cgjsqInformation = param.return.cgjsqInformation;
    if (!cgjsqInformation) {
      return {};
    }
    let sql;
    let billData;
    sql = "select * from AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqbl where id = " + cgjsqInformation;
    billData = ObjectStore.queryByYonQL(sql);
    if (!billData || billData.length <= 0) {
      return {};
    }
    // 办理信息
    let blxx = billData[0];
    if (blxx.nhLeavestatus && blxx.nhLeavestatus == "2") {
      let blxxObj = { id: blxx.id, nhLeavestatus: "8" };
      ObjectStore.updateById("AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqbl", blxxObj, "cgjbl");
    }
    sql = "select * from AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqgl where source_id = " + cgjsqInformation + " order by createTime desc";
    billData = ObjectStore.queryByYonQL(sql);
    if (!billData || billData.length <= 0) {
      return {};
    }
    // 管理信息
    let glxx = billData[0];
    if (glxx.nhLeavestatus && glxx.nhLeavestatus == "2") {
      let glxxObj = { id: glxx.id, nhLeavestatus: "8" };
      ObjectStore.updateById("AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqgl", glxxObj, "cgjsqgl_001");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });