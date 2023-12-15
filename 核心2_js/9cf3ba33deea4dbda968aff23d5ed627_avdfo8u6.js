let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var user = AppContext();
    var userInfo = JSON.parse(user);
    var name = userInfo.currentUser.name;
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var strDate = date.getFullYear() + "-";
    var month = date.getMonth() + 1; //月
    var getData = date.getDate(); //日
    var hours = date.getHours(); //时
    var minutes = date.getMinutes(); //分
    var seconds = date.getSeconds(); //秒
    month = month < 10 ? "0" + month : month;
    getData = getData < 10 ? "0" + getData : getData;
    strDate += month + "-";
    strDate += getData;
    var object = { id: request.id, isTakeEffect: "true", takeEffecter: name, takeEffectTime: strDate };
    var res = ObjectStore.updateById("AT164D981209380003.AT164D981209380003.salesPlan", object, "f6ccd139List");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });