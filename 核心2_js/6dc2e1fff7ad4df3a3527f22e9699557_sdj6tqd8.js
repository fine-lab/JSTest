let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前时间 和当前时间的前7分钟  fmt和fmt1
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    date.setDate(date.getDate() - 1);
    var fmt = "yyyy-MM-dd";
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate() //日
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    //查询门店编号
    var sqlStore =
      "select storeId,storeName,paidAt,t1.house as storeCode from AT1862650009200008.AT1862650009200008.posOrder t inner join AT1862650009200008.AT1862650009200008.store t1 on t1.posHouse = storeCode where paidAt >= '" +
      fmt +
      "' group by storeId  ";
    var resStore = ObjectStore.queryByYonQL(sqlStore, "developplatform");
    for (let i = 0; i < resStore.length; i++) {
      var sqlStoreId =
        "select t1.productId as productId,t1.productName as productName,t1.sku as sku,sum(t1.count1) as count1,t1.unit as unit from AT1862650009200008.AT1862650009200008.posOrder t inner join AT1862650009200008.AT1862650009200008.posOrderItem t1 on t1.posOrder_id=id where storeId=" +
        resStore[i].storeId +
        " and paidAt >= '" +
        fmt +
        "' and dr = 0 group by t1.productId";
      var resStoreId = ObjectStore.queryByYonQL(sqlStoreId, "developplatform");
      const detail = resStore[i];
      detail["posOrderItemSumList"] = resStoreId;
      var order = ObjectStore.insert("AT1862650009200008.AT1862650009200008.posOrderSum", detail, "yb2c8a0414");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });