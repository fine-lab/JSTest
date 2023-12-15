let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 待更新字段内容
    //通过条件更新实体（不支持更新原厂单据）
    // 待更新字段内容
    // 执行更新
    //通过sql查询实体
    //通过实体ID查询实体
    //查询内容
    //通过条件查询实体
    return {};
  }
}
exports({ entryPoint: MyTrigger });