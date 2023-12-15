let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let billId = data.id;
    // 赢单自定义档案实体
    let winOrderDefEntityName = "sfa.winorderapply.WinOrderApplyDef";
    // 商机自定义档案实体
    let opptDefEntityName = "sfa.oppt.OpptDef";
    // 商机实体
    let opptEntityName = "sfa.oppt.Oppt";
    // 商机报备
    let opptreportEntityName = "sfa.opptreport.OpptReport";
    // 商机报备自定义
    let opptreportDefEntityName = "sfa.opptreport.OpptReportDef";
    // 赢单实体
    let winOrderApplyDef = data[`_entityName`];
    let object = { id: "" + billId };
    // 查询赢单自定义项实体
    let res = ObjectStore.selectByMap(winOrderDefEntityName, object);
    let resutlData = res ? res[0] : null;
    // 如果赢单自定义项实体为空则返回
    if (!resutlData) {
      return {};
    }
    // 查询赢单实体未了获取商机id
    let winOrderres = ObjectStore.selectByMap(winOrderApplyDef, object);
    let winOrderData = winOrderres[0];
    let busiId = winOrderData.busi;
    let opptDefFinalData = { id: "" + busiId }; // 商机def实体
    opptDefFinalData["define30"] = "test";
    ObjectStore.updateById(opptDefEntityName, opptDefFinalData, "yycrm");
    return {};
  }
}
exports({ entryPoint: MyTrigger });