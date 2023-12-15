let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //保存成功后获取上下文信息
    let data = param.data[0];
    var { id, tyyd } = data;
    let resp = ObjectStore.updateById("GT44903AT33.GT44903AT33.simpletest", { id, beizhu: "保存单据后回写值" + tyyd });
    //根据id更新保存的这条数据，给字段beizhu赋值
    //保存成功后列表上检查beizhu字段的值
    return { context, param };
  }
}
exports({ entryPoint: MyTrigger });