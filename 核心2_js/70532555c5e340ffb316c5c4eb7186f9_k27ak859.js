let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      var sql;
      var dt; //sql查询返回的对象
      var dtBody; //sql查询返回的对象
      // 更新条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", param.data[0].id);
      var data = "";
      if (param.data[0].verifystate == 2) {
        data = "待推单";
      } else {
        //已推单的数据不允许弃审！
      }
      // 待更新字段内容
      var toUpdate = {
        tdzt: data
      };
      // 执行更新
      var res = ObjectStore.update(context.fullname, toUpdate, updateWrapper, context.billnum);
    } catch (e) {
      throw new Error("审核失败：" + e.toString());
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});