let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取时间
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var format = "-";
    var timefh = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var date1 = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    var strdate =
      year +
      format +
      (month < 10 ? "0" + month : month) +
      format +
      (date1 < 10 ? "0" + date1 : date1) +
      " " +
      (hours < 10 ? "0" + hours : hours) +
      timefh +
      (minutes < 10 ? "0" + minutes : minutes) +
      timefh +
      (second < 10 ? "0" + second : second);
    var gnType = request.functionType; //功能类型
    var djbh = request.documentNo; //单据编号
    var zxTime = strdate; //执行时间
    var zxjg = request.result; //执行结果
    var xqms = request.details; //详情描述
    //新增日志
    var insertlogSql = {
      gongnenleixing: gnType,
      danjubianhao: djbh,
      zhixingshijian: zxTime,
      zhixingjieguo: zxjg,
      xiangqingmiaoshu: xqms
    };
    var insertBomRes = ObjectStore.insert("AT15F164F008080007.AT15F164F008080007.logger", insertlogSql, "129d39e8");
    return { insertBomRes };
  }
}
exports({ entryPoint: MyAPIHandler });