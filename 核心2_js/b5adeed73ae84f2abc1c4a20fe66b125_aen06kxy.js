let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var uid = cb.utils.getCookie("yonyou_uid");
    // 先触发搜索，才能走到beforeSearch
    setTimeout(function () {
      // 移动调用搜索search
      cb.invoker.invokeBackFunction("cmdSearch", viewModel);
    }, 30);
    viewModel.on("beforeSearch", function (args) {
      console.log("xxxxxx before search start ");
      args.isExtend = true;
      var commonVOs = args.params.condition.commonVOs;
      commonVOs.push({
        itemName: "creator",
        op: "eq",
        value1: uid + "1"
      });
    });
    return {};
  }
}
exports({ entryPoint: MyTrigger });