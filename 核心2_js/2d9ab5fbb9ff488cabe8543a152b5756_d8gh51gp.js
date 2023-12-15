let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var dayMilliseconds = 86400000;
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    //获取当前时间
    var currentTime = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    //获取当前时间后一天的时间
    var conditionTime1 = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000 + dayMilliseconds);
    var conditionTime1Year = conditionTime1.getFullYear();
    var conditionTime1Month = conditionTime1.getMonth() + 1;
    var conditionTime1Day = conditionTime1.getDate();
    var conditionTime1Strs = [conditionTime1Year, conditionTime1Month, conditionTime1Day];
    var conditionTime1ToStr = join(conditionTime1Strs, "-");
    //获取当前时间后两天的时间
    var conditionTime2 = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000 + 2 * dayMilliseconds);
    var conditionTime2Year = conditionTime2.getFullYear();
    var conditionTime2Month = conditionTime2.getMonth() + 1;
    var conditionTime2Day = conditionTime2.getDate();
    var conditionTime2Strs = [conditionTime2Year, conditionTime2Month, conditionTime2Day];
    var conditionTime2ToStr = join(conditionTime2Strs, "-");
    var sql =
      "select vorgId,yangbenbianhao,checkStatus,creator,tenant_id,nibaogaoriqi from AT15F164F008080007.AT15F164F008080007.recDetils1 where checkStatus = 10 and nibaogaoriqi in ('" +
      conditionTime1ToStr +
      "','" +
      conditionTime2ToStr +
      "')";
    var object = ObjectStore.queryByYonQL(sql, "developplatform");
    if (object.length > 0) {
      //定义参数对象
      var params = {
        appKey: "yourKeyHere",
        appSecret: "yourSecretHere",
        staffList: object
      };
      //调用后端接口
      //信息体
      let body = {
        param: params
      };
      //信息头
      let header = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      //调用艾雷服务器接口循环发送预警
      postman("post", "http://123.57.144.10:9994/AlertDeal/dateOfProposedReportAlert", JSON.stringify(header), JSON.stringify(body));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });