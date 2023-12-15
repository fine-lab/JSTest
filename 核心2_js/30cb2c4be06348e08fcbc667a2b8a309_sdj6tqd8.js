let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
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
    var sqlStoreId = "select storeCode as storeId,storeName,id,paidAt from AT1862650009200008.AT1862650009200008.posOrderSum where dr=0 and paidAt >= '2023-10-14' and paidAt < '2023-10-15'";
    var resStoreId = ObjectStore.queryByYonQL(sqlStoreId, "developplatform");
    for (let i = 0; i < resStoreId.length; i++) {
      //查询某门店编号下所有主表id
      var sqlId =
        "select t2.code as product,t2.yonLiang*sum(count1) as qty,t2.unitCode as unit from AT1862650009200008.AT1862650009200008.posOrderItemSum t inner join 		AT1862650009200008.AT1862650009200008.chengbenkanew t1 on t1.name = t.sku  inner join AT1862650009200008.AT1862650009200008.chengbenkanewc t2 on t2.chengbenkanew_id = t1.id  where t1.dr =0 and dr=0 and  posOrderSum_id ='" +
        resStoreId[i].id +
        "' group by t2.code";
      var resId = ObjectStore.queryByYonQL(sqlId, "developplatform");
      const detail = resStoreId[i];
      detail["bzxhlcList"] = resId;
      var order = ObjectStore.insert("AT1862650009200008.AT1862650009200008.bzxhl", detail, "ybba63dd11");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });