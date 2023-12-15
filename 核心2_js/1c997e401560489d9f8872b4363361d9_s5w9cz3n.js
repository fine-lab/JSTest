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
    throw new Error(JSON.stringify(resutlData));
    // 如果赢单自定义项实体为空则返回
    if (!resutlData) {
      return {};
    }
    // 查询赢单实体未了获取商机id
    let winOrderres = ObjectStore.selectByMap(winOrderApplyDef, object);
    let winOrderData = winOrderres[0];
    let busiId = winOrderData.busi;
    let opptDefFinalData = { id: "" + busiId }; // 商机def实体
    // 回写内容 合同名称、签约客户名称
    // 赢单：     合同名称define1   签约客户名称define3
    // 商机：     合同名称define9   签约客户名称define8
    // 商机报备： 合同名称define9   签约客户名称define8
    // 判断8和9是否有值
    let isReWrite = false;
    if (resutlData["define1"] || resutlData["define3"]) {
      isReWrite = true;
      resutlData["define1"] ? (opptDefFinalData["define9"] = resutlData["define1"]) : undefined;
      resutlData["define3"] ? (opptDefFinalData["define8"] = resutlData["define3"]) : undefined;
    }
    throw new Error(JSON.stringify(isReWrite));
    // 如果没有需要会写的值直接返回
    if (!isReWrite) return {};
    // 根据商机id查询商机是否维护自定义项
    let opptObject = { ids: ["" + busiId] };
    let opptRes = ObjectStore.selectBatchIds(opptDefEntityName, opptObject);
    // 商机自定义数据
    // 如果商机未维护自定义项则新增
    if (opptRes.length == 0) {
      ObjectStore.insert(opptDefEntityName, opptDefFinalData, "yycrm");
    } else {
      ObjectStore.updateById(opptDefEntityName, opptDefFinalData, "yycrm");
    }
    // 查询商机实体  用于获取来源商机报备信息 此处由于商机报备和商机code相同，查询出code利用code来查询
    let opptReses = ObjectStore.selectByMap(opptEntityName, { id: "" + busiId });
    let opptResutlData = opptReses ? opptReses[0] : null;
    throw new Error(JSON.stringify(opptResutlData));
    // 查询商机报备实体
    let opptReportRes = ObjectStore.selectByMap(opptreportEntityName, { code: opptResutlData.code });
    let opptReportResultData = opptReportRes ? opptReportRes[0] : null;
    throw new Error(JSON.stringify(opptReportResultData));
    // 如果存在关联的商机报备
    if (opptReportResultData) {
      let opptReportDefFinalData = { id: "" + opptReportResultData.id };
      resutlData["define1"] ? (opptReportDefFinalData["define9"] = resutlData["define1"]) : undefined;
      resutlData["define3"] ? (opptReportDefFinalData["define8"] = resutlData["define3"]) : undefined;
      let opptReportDefRes = ObjectStore.selectBatchIds(opptreportDefEntityName, [{ id: opptReportResultData.id + "" }]);
      if (opptReportDefRes.length == 0) {
        ObjectStore.insert(opptreportDefEntityName, opptReportDefFinalData, "yycrm");
      } else {
        ObjectStore.updateById(opptreportDefEntityName, opptReportDefFinalData, "yycrm");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });