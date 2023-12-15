let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询昨日订单汇总列表数据
    //获取当前时间 和当前时间的前7分钟  fmt和fmt1
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var fmt = "yyyy-MM-dd";
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate() - 1 //日
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    var sqlStoreId = "select id  from AT1862650009200008.AT1862650009200008.posOrderSum where createdAt >= '" + fmt + "'";
    var resStoreId = ObjectStore.queryByYonQL(sqlStoreId, "developplatform");
    for (var i = 0; i < resStoreId.length; i++) {
      throw new Error(resStoreId[0].id);
      var data = {
        data: {
          org: "2063439785234688",
          vouchdate: "2023-06-29 00:00:00",
          factoryOrg: "2063439785234688",
          warehouse: "2086054747707136",
          bustype: "110000000000026",
          memo: "pos",
          _status: "Insert",
          materOuts: [
            {
              product: "30100145",
              productsku: "30100145",
              qty: 1,
              unit: "2086097956018944",
              stockUnitId: "yourIdHere",
              invExchRate: 1,
              _status: "Insert"
            }
          ]
        }
      };
    }
    throw new Error(JSON.stringify(resStoreId));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });