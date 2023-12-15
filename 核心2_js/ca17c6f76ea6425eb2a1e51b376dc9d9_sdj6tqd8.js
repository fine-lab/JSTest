let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前时间 和当前时间的前7分钟  fmt和fmt1
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    date.setMinutes(date.getMinutes() - 35);
    var fmt = "yyyy-MM-dd HH:mm";
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
      "H+": date.getHours() - 1, //小时
      "m+": date.getMinutes() //分
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    var dateNow = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var fmt1 = "yyyy-MM-dd HH:mm";
    var o1 = {
      "M+": dateNow.getMonth() + 1, //月份
      "d+": dateNow.getDate(), //日
      "h+": dateNow.getHours() % 12 == 0 ? 12 : dateNow.getHours() % 12, //小时
      "H+": dateNow.getHours() - 1, //小时
      "m+": dateNow.getMinutes() //分
    };
    if (/(y+)/.test(fmt1)) fmt1 = fmt1.replace(RegExp.$1, (dateNow.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o1) if (new RegExp("(" + k + ")").test(fmt1)) fmt1 = fmt1.replace(RegExp.$1, RegExp.$1.length == 1 ? o1[k] : ("00" + o1[k]).substr(("" + o1[k]).length));
    //请求头
    let header = { "Content-Type": "application/json" };
    //总页数
    var totalPage = 1;
    for (let page = 1; page <= totalPage; page++) {
      //请求体
      var mess =
        "end_time=" + fmt1 + "&include_wm_order=true&mch_id=1000000057&nonce_str=2696142511&page_no=" + page + "&page_size=100&start_time=" + fmt + "&store_id=18&key=9b9e3ef5a8464cc59ac338289c7844d4";
      var signList = capitalizeEveryWord(MD5Encode(mess));
      let body = {
        end_time: fmt1,
        include_wm_order: true,
        mch_id: "youridHere",
        nonce_str: "2696142511",
        page_no: page,
        page_size: "100",
        start_time: fmt,
        store_id: "18",
        sign: signList
      };
      //查询pos销售订单列表
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
      const res = JSON.parse(strResponse);
      totalPage = res.result_data.totalPage;
      let obj = res.result_data.data;
      if (obj == null) {
        return {};
      }
      //根据列表id遍历调用订单详情接口，组合数据新增到自建表中
      for (let i = 0; i < obj.length; i++) {
        var sqlId = "select bill from AT1862650009200008.AT1862650009200008.posOrder where  bill ='" + obj[i].bill + "'";
        var resId = ObjectStore.queryByYonQL(sqlId, "developplatform");
        if (resId == "") {
          var mes = "bill=" + obj[i].bill + "&mch_id=1000000057&nonce_str=269614251&key=9b9e3ef5a8464cc59ac338289c7844d4";
          var sign = capitalizeEveryWord(MD5Encode(mes));
          let bodydetais = {
            mch_id: "youridHere",
            nonce_str: "269614251",
            bill: obj[i].bill,
            sign: sign
          };
          //调用pos详情接口
          let strResponseDet = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(bodydetais));
          const detail = JSON.parse(strResponseDet).result_data;
          //赋值orderId
          detail["orderId"] = detail.id;
          let items = detail.items;
          //取pos items中product中数据赋值到子表行
          for (let j = 0; j < items.length; j++) {
            items[j]["productId"] = items[j].product.id;
            items[j]["unit"] = items[j].product.unit;
            items[j]["productName"] = items[j].product.name;
            items[j]["count1"] = items[j].count;
            items[j]["itemId"] = items[j].id;
          }
          detail["posOrderItemList"] = items;
          var order = ObjectStore.insert("AT1862650009200008.AT1862650009200008.posOrder", detail, "ybc72baad8");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });