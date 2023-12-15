let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var versionNum = param.data[0].versionNum;
    var id = param.data[0].id;
    if (!id || id === "") {
      if (!versionNum) {
        versionNum = "0";
      }
      var newVersionNum = Number(versionNum) + 1;
      param.data[0].set("versionNum", newVersionNum.toString());
      param.data[0].set("lastflag", "1"); //是否最新1-是
    }
    let logfunc1 = extrequire("GT33423AT4.backDefaultGroup.TestLog");
    var log2 = { billName: "子项目变更", operation: "保存前", ziduan1: "更新版本号", logLevel: "info", content: JSON.stringify(param) };
    let res2 = logfunc1.execute(log2);
  }
}
exports({ entryPoint: MyTrigger });