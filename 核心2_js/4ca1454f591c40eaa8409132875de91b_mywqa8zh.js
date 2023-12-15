let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var a = JSON.parse(param.requestData);
    var stu = a._status;
    if (stu == "Insert") {
      var resultList = param.return;
      //获取字段1的值
      var num1 = resultList.ziduan1;
      //获取字段2的值
      var num2 = resultList.new2;
      var number = num1 + num2;
      //获取id
      var id = resultList.lwy2List[0].lwy1_id;
      var object = { id: id, new6: number };
      var res = ObjectStore.updateById("GT614AT5.GT614AT5.lwy1", object, "cbd76583");
      var list = resultList.lwy2List;
      if (resultList.new8 == null) {
        var sum = 0;
      } else {
        var sum = resultList.new8;
      }
      for (var i = 0; i < list.length; i++) {
        var num = list[i].new1 + list[i].new2;
        sum += num;
        //获取字段3的毫秒值
        var date3 = new Date(list[i].new3).getTime();
        var date4 = new Date(list[i].new4).getTime();
        var time = date4 - date3;
        //计算出相差天数
        var day = Math.floor(time / (24 * 3600 * 1000));
        //获取子表的id
        var pid = resultList.lwy2List[i].id;
        //更新子表字段
        var object = { id: pid, days: day };
        var res = ObjectStore.updateById("GT614AT5.GT614AT5.lwy2", object, "cbd76583");
      }
      //更新主表字段
      var object = { id: id, new8: sum };
      var res = ObjectStore.updateById("GT614AT5.GT614AT5.lwy1", object, "cbd76583");
    } else {
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });