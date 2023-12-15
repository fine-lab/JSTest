let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取值
    var alReturn = param.return;
    //获取id
    var id = alReturn.id;
    //校准周期
    var ZhouQi = alReturn.xiaozhunzhouqi;
    //开始日期
    var StartDate = alReturn.ziduan7;
    //拿到周
    var Dsh = new Date(StartDate);
    Dsh.setMonth(Dsh.getMonth() + ZhouQi);
    var year = Dsh.getFullYear();
    var month = Dsh.getMonth() + 1;
    var startDay = Dsh.getDate();
    var AllTime = year.toString() + "-" + month.toString() + "-" + startDay.toString();
    //把字段更新到库里
    var object = { id: id, xiacixiaozhunriqi: AllTime };
    var res = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DeviceManagement", object, "f7ca41a7");
    return {};
  }
}
exports({ entryPoint: MyTrigger });