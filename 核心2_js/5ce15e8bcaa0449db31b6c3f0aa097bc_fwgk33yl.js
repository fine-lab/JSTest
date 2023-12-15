let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 扩展代码 start
    var pdata = param.data[0];
    if (pdata !== null && pdata.new37 !== null) {
      var presaleA_1Lis = pdata.PresaleA_1List;
      if (presaleA_1Lis === null || presaleA_1Lis === "") {
        throw new Error("售前支持人员不能为空,请先分配售前支持人员！");
      }
    }
    // 扩展代码 end
    return {};
  }
}
exports({ entryPoint: MyTrigger });