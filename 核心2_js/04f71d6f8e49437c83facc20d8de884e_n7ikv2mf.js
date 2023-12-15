let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var result = {};
    result.param = param;
    var id = param.data[0].id;
    var cprojectId = param.data[0].source_id;
    var versionNum = param.data[0].versionNum;
    var changeStatus = "3"; //变更完成
    //更新子项目的变更状态为changeStatus
    if (versionNum === "1") {
      changeStatus = "1"; //未变更
    }
    var object = { id: cprojectId, changeStatus: changeStatus };
    var res = ObjectStore.updateById("GT27606AT15.GT27606AT15.HBZXM", object);
    result.updateRes = res;
    //查询上一个变更子项目
    var preVersionNum = Number(versionNum) - 1;
    object = { source_id: cprojectId, versionNum: preVersionNum.toString() };
    var cproChanges = ObjectStore.selectByMap("GT27606AT15.GT27606AT15.HBZXMBG", object);
    result.cproChanges = cproChanges;
    //更新变更子项目的是否最新为1-是
    if (cproChanges !== undefined && cproChanges.length > 0) {
      object = { id: cproChanges[0].id, lastflag: "1" };
      var changeRes = ObjectStore.updateById("GT27606AT15.GT27606AT15.HBZXMBG", object);
      result.changeRes = changeRes;
    }
    let logfunc1 = extrequire("GT33423AT4.backDefaultGroup.TestLog");
    var log2 = { billName: "子项目变更", operation: "删除", ziduan1: "恢复子项目状态", logLevel: "info", content: JSON.stringify(result) };
    let res2 = logfunc1.execute(log2);
    return {};
  }
}
exports({ entryPoint: MyTrigger });