let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.return;
    // 获取id
    let id = param.return.id;
    let ziduan1 = 0;
    let new2 = 0;
    let new3 = 0;
    let new4 = 0;
    let new5 = 0;
    if (data.hasOwnProperty("ziduan1")) {
      ziduan1 = data.ziduan1;
    }
    if (data.hasOwnProperty("new2")) {
      new2 = data.new2;
    }
    if (data.hasOwnProperty("new3")) {
      new3 = data.new3;
    }
    if (data.hasOwnProperty("new4")) {
      new4 = data.new4;
    }
    if (data.hasOwnProperty("new5")) {
      new5 = data.new5;
    }
    let zonghe = ziduan1 + new2 + new3 + new4 + new5;
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", id);
    // 待更新字段内容
    var toUpdate = { zonghe: zonghe };
    // 执行更新
    var res = ObjectStore.update("GT102159AT2.GT102159AT2.importTest", toUpdate, updateWrapper, "b87ee3b3");
    return {};
  }
}
exports({ entryPoint: MyTrigger });