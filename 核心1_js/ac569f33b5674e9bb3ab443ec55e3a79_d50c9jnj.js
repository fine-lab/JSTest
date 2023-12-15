let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    if (data[0].status == "1") {
      // 启用不允许删除
      throw new Error("算力编码：" + data[0].suanliType + "，合同编码：" + data[0].contractNum + "已启用，不允许删除！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });