let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //任务撤回
    var mainId = param.data[0].source_id;
    var subId = param.data[0].sourcechild_id;
    var object31 = { id: mainId, compositions: [{ name: "xsxx001List" }] };
    var res31 = ObjectStore.selectById("AT1840871816E00004.AT1840871816E00004.xschs001", object31);
    var wanchengshu1 = res31.wanchengshu;
    var zongshu1 = 3; //res31.zongshu;
    var object3;
    if (res31.wanchengshu > 0) {
      wanchengshu1 = res31.wanchengshu - 1;
    }
    if (zongshu1 == wanchengshu1) {
      object3 = { id: mainId, wanchengshu: wanchengshu1, new4: "已全部完成", xsxx001List: [{ hasDefaultInit: true, id: subId, zhuangtai: "已完成", _status: "Update" }] };
    }
    else {
      object3 = { id: mainId, wanchengshu: wanchengshu1, new4: "进行中", xsxx001List: [{ hasDefaultInit: true, id: subId, zhuangtai: "未开始", _status: "Update" }] };
    }
    var res5 = ObjectStore.updateById("AT1840871816E00004.AT1840871816E00004.xschs001", object3, "xschs001");
    return {};
  }
}
exports({ entryPoint: MyTrigger });