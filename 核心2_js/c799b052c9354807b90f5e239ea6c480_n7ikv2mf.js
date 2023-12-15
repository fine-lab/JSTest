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
  }
}
exports({ entryPoint: MyTrigger });