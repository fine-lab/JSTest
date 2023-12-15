let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var name = request.name;
    var object = { partnerName: name, verifystate: 2 }; //
    var records = ObjectStore.selectByMap("GT29372AT19.GT29372AT19.HBWGJL", object);
    var level = new Map();
    level.set("1", "一级");
    level.set("2", "二级");
    level.set("3", "三级");
    level.set("4", "四级");
    var ViolationVOList = [];
    for (var num = 0; num < records.length; num++) {
      var record = records[num];
      var re = {
        xiangmumingchen: record.projectName,
        name: record.name,
        weiguishijian: record.shijianmingchen,
        fashengriqi: record.fashengriqi,
        shijiandengji: level.get(record.eventLevel),
        shijian: record.shijian,
        jiluren: record.jiluren,
        jiluriqi: record.jiluriqi
      };
      ViolationVOList.push(re);
    } //             "xiangmumingchen":"项目名称",
    return { ViolationVOList };
  }
}
exports({ entryPoint: MyAPIHandler });