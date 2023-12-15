let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var result = {};
    result.param = param;
    var id = param.data[0].id;
    var contractId = param.data[0].source_id;
    var versionNum = param.data[0].versionNum;
    var contractStatus = "3";
    //更新合同的变更状态为contractStatus
    if (versionNum === "1") {
      contractStatus = "1";
    }
    var object = { id: contractId, changeStatus: contractStatus };
    var res = ObjectStore.updateById("GT27606AT15.GT27606AT15.HBHTGL", object);
    result.updateRes = res;
    //查询上一个变更合同
    var preVersionNum = Number(versionNum) - 1;
    object = { source_id: contractId, versionNum: preVersionNum.toString() };
    var conChanges = ObjectStore.selectByMap("GT27606AT15.GT27606AT15.HBHTGLBG", object);
    result.conChanges = conChanges;
    //更新变更合同的是否最新为1-是
    if (conChanges !== undefined && conChanges.length > 0) {
      object = { id: conChanges[0].id, lastflag: "1" };
      var changeRes = ObjectStore.updateById("GT27606AT15.GT27606AT15.HBHTGLBG", object);
      result.changeRes = changeRes;
    }
    let logfunc1 = extrequire("GT33423AT4.backDefaultGroup.TestLog");
    var log2 = { billName: "合同变更", operation: "删除", ziduan1: "更新合同状态", logLevel: "info", content: JSON.stringify(result) };
    let res2 = logfunc1.execute(log2);
    return {};
  }
}
exports({ entryPoint: MyTrigger });