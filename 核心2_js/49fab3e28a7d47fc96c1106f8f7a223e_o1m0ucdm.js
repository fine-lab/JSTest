let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //同时更
    var object = {
      id: context.customMap.ref.data[0].id,
      shifuguidang: true,
      yifukuanjine: 0,
      shengyujine: context.customMap.ref.data[0].hetonjine,
      zaitujine: 0
    };
    var result = ObjectStore.selectByMap("GT879AT352.GT879AT352.htxqc", object);
    if (result.length == 0) {
      var res = ObjectStore.updateById("GT879AT352.GT879AT352.htxqc", object, "7b78e263");
    } else {
      throw new Error("不可重复下推归档-更新记录不存在");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });