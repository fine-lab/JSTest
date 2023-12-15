let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //请求的业主清单数据
    var ownerList = param.data[0];
    //根据id判断业主清单绑定的wbs是否为空，如果不是更改已复核
    var ownderWBS = "select wbs_gjFk,id from GT9144AT102.GT9144AT102.wbs_gj where wbs_gjFk='" + ownerList.id + "'";
    var res = ObjectStore.queryByYonQL(ownderWBS);
    if (res.length > 0) {
      var object = { id: ownerList.id, yifuhe: 1 };
      ObjectStore.updateById("GT9144AT102.GT9144AT102.ownerlist", object);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });