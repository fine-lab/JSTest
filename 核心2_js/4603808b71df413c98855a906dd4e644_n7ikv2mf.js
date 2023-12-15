let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var userId = request.userId;
    var object = { advisorUserid: userId }; //verifystate:2
    var records = ObjectStore.selectByMap("GT29372AT19.GT29372AT19.GWWGJL", object);
    var ViolationVOList = [];
    for (var num = 0; num < records.length; num++) {
      var record = records[num];
      var re = {
        xiangmumingchen: record.projectName,
        name: record.name,
        weiguishijian: record.shijianmingchen,
        fashengriqi: record.fashengriqi,
        shijiandengji: record.shijiandengji,
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