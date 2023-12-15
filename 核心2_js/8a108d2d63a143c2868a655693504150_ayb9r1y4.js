let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var str = JSON.stringify(param);
    var count = param.data[0].frequency;
    // 更新主表条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", param.data[0].id);
    // 待更新字段内容
    var toUpdate = { frequency: count + 1 };
    // 执行更新
    var res = ObjectStore.update("GT102917AT3.GT102917AT3.basicinformation", toUpdate, updateWrapper, "50b55ce8List");
    throw new Error(JSON.stringify(res));
    //获取安装合同号
    return { count };
  }
}
exports({ entryPoint: MyTrigger });