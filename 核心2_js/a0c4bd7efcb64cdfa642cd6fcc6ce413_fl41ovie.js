let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("creator", "xxx");
    // 待更新字段内容
    var toUpdate = {
      name: "ttt",
      bustype: "1639837036187904",
      item41d: "45gty",
      pX000008_tabpane0List: [
        { hasDefaultInit: true, item20l: "ttt", _status: "Insert" },
        { id: "youridHere", _status: "Delete" }
      ]
    };
    // 单据编号
    var billNum = "f6f7e02c";
    // 执行更新
    var res = ObjectStore.update("developplatform.AX000003.PX000008", toUpdate, updateWrapper, billNum);
    return res;
  }
}
exports({ entryPoint: MyTrigger });