let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //发送人
    var username = JSON.parse(AppContext()).currentUser.name;
    //发送时间
    var funAPI2 = extrequire("AT179D04BE0940000B.frontDesignerFunction.setzxLog");
    var resAPI2 = funAPI2.execute(username, "", "3", "ascs4", "8");
  }
}
exports({ entryPoint: MyTrigger });