let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "200"; //接口返回状态码
    var msg; //接口返回状态信息
    var sql;
    var dt; //sql查询返回的对象
    var errMsg = "";
    try {
      if (request.data.customerClass == "undefined") {
        throw new Error("客户分类不存在");
      }
      sql = "SELECT shijian,n FROM AT163BD39E08680003.AT163BD39E08680003.kehufahuoshixiaodangan where kehufenleibianma =  '" + request.data.customerClass + "'";
      dt = ObjectStore.queryByYonQL(sql);
      if (dt.length == 0) {
        errMsg += "客户分类[" + request.data.customerClass_Name + "]未配置发货时效";
      } else if (dt.length > 1) {
        errMsg += "客户分类[" + request.data.customerClass_Name + "]重复配置发货时效";
      }
      if (errMsg.length > 0) {
        throw new Error(errMsg);
      }
      //只有在dt行数等于1才进行后续的判断
      for (var i = 0; i < request.data.detail.length; i++) {
        var timezone = 8; //目标时区时间，东八区
        var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
        var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
        var time = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
        //检验下单时间是否超过配置的时间
        let time1 = new Date("2022-1-1 " + dt[0].shijian.toString());
        let time2 = new Date("2022-1-1 " + time.toLocaleTimeString().toString());
        if (time1 < time2) {
          //超过当天下单时间 N+1
          dt[0].n = dt[0].n + 1;
        }
        //期望发货时间
        var consignTime = new Date(request.data.detail[i].consignTime);
        //根据配置计算的发货时间
        time.setDate(time.getDate() + dt[0].n);
        var stime = time.getFullYear().toString() + "-" + (time.getMonth() + 1).toString() + "-" + time.getDate().toString();
        if (consignTime < new Date(stime)) {
          errMsg += "[" + request.data.detail[i].lineno + "]行发货时间不能早于【" + stime + "】";
        }
      }
      if (errMsg.length > 0) {
        throw new Error(errMsg);
      }
    } catch (e) {
      code = "999";
      msg = e.toString();
    } finally {
      var res = {
        code: code,
        msg: msg
      };
      return {
        res
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});