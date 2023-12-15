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
    var sqlStoreId = "select distinct storeId from AT1862650009200008.AT1862650009200008.posOrder where paidAt >= '" + fmt + "' order by storeId  ";
    var resStoreId = ObjectStore.queryByYonQL(sqlStoreId, "developplatform");
    for (let i = 0; i < resStoreId.length; i++) {
      //查询某门店编号下所有主表id
      var sqlId = "select * from AT1862650009200008.AT1862650009200008.posOrder where paidAt >= '" + fmt + "' and storeId =" + resStoreId[i].storeId;
      var resId = ObjectStore.queryByYonQL(sqlId, "developplatform");
      var id = "";
      for (let j = 0; j < resId.length; j++) {
        if (j == resId.length - 1) {
          id = id + resId[j].id;
        } else {
          id = id + resId[j].id + ",";
        }
      }
      if (id) {
        //查询某门店编号下所有子表行
        var sqlDetails =
          "select productId,sum(count1),sum(originalPrice),sum(price),productName,sku,sum(totalOriginalPrice),sum(totalPrice),unit from AT1862650009200008.AT1862650009200008.posOrderItem where  posOrder_id in (" +
          id +
          ") group by productId";
        var resDetails = ObjectStore.queryByYonQL(sqlDetails, "developplatform");
        const detail = resId[0];
        detail["posOrderItemSumList"] = resDetails;
        var order = ObjectStore.insert("AT1862650009200008.AT1862650009200008.posOrderSum", detail, "yb2c8a0414");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });