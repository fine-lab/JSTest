let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = JSON.parse(AppContext());
    var currentUser = res.currentUser;
    let data = param.data;
    if (data[0].creator && !data[0].snCreator) {
      // 此数据为新增
      data[0].set("snCreator", currentUser.id + "");
      data[0].set("snCreator_name", currentUser.name + "");
    }
    data[0].set("snModifier", currentUser.id + "");
    data[0].set("snModifier_name", currentUser.name + "");
    return { context, param };
  }
}
exports({ entryPoint: MyTrigger });