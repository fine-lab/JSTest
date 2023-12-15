let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取json串里面的数据  获取字段1的值
    var result1 = param.return.ziduan1;
    var data = param.return;
    //获取json串里面的数据  获取字段2的值
    var ziduan2 = param.return.new2;
    //字段1加字段2 赋值字段6
    var zd6 = result1 + ziduan2;
    //拿到实体id
    var id = param.return.id;
    var object = { id: id, new6: zd6 };
    var res = ObjectStore.updateById("GT614AT5.GT614AT5.lwy1", object, "c0e774cd");
    var list = data.lwy2List;
    //避免新增出问题 如果有值就相加没有从0开始
    if (data.new8 == null) {
      var sum = 0;
    } else {
      var sum = data.new8;
    }
    //遍历拿1 和2 的值
    for (var i = 0; i < list.length; i++) {
      // 根据时间戳获取时间  var date = new Date(list[i].new1).getTime();
      var s = list[i].new1 + list[i].new2;
      var day = list[i].new4 - list[i].new3;
      //计算天数
      var tian = Math.floor(day / (24 * 3600 * 1000));
      sum += s;
      //拿到子表的id
      var sid = data.lwy2List[i].id;
      //更新到days的值
      var object = { id: sid, days: tian };
      var res = ObjectStore.updateById("GT614AT5.GT614AT5.lwy2", object, "c0e774cd");
    }
    //更新new8的值
    var object = { id: id, new8: sum };
    var res = ObjectStore.updateById("GT614AT5.GT614AT5.lwy1", object, "c0e774cd");
    return {};
  }
}
exports({ entryPoint: MyTrigger });