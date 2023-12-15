let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = {
      ids: ["1629651149352075270", "1629554959279718406"],
      compositions: [
        {
          name: "testMove_id"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectBatchIds("AT162DF46809880005.AT162DF46809880005.testMove", object);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });