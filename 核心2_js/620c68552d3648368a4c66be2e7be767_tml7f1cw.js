let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var lastMonth = getLastMonth();
    //获取待开票的订单
    var sql = "select smallBillNumber from AT16879EEA1CB0000A.AT16879EEA1CB0000A.goodsOrder where invoicingStatus = 1 and orderDate > '" + lastMonth + "' order by code desc limit 10";
    var res = ObjectStore.queryByYonQL(sql);
    var goodsOrder = [];
    //查询是否已开票
    let access_token = extrequire("AT16879EEA1CB0000A.rule.getAccessToken").execute().access_token;
    for (var i = 0; i < res.length; i++) {
      let fpqqlsh = res[i].smallBillNumber;
      let header = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      let strResponse = postman(
        "POST",
        "https://www.example.com/" + access_token,
        JSON.stringify(header),
        "fpqqlsh=" + fpqqlsh
      );
      let resData = JSON.parse(strResponse);
      // 接口请求成功 且 状态为开票成功
      if (resData.code == "0000" && resData.statuscode == "4") {
        throw new Error(strResponse);
        let goods = { purchaserName: "", invoiceNumber: "" };
        let invoiceData = JSON.parse(JSON.parse(resData.data).data);
        //购买方名称
        goods.purchaserName = invoiceData.gmfMc;
        //发票号码
        goods.invoiceNumber = invoiceData.fpHm;
        if (invoiceData.bred == "Y") {
          goods.invoicingStatus = "3";
        } else {
          goods.invoicingStatus = "2";
        }
        // 发票类型
        if (invoiceData.fplx == "2" || invoiceData.fplx == "4") {
          goods.invoiceType = "1";
        } else {
          goods.invoiceType = "2";
        }
        goods.orderStatus = "3";
        goods.id = fpqqlsh;
        goodsOrder.push(goods);
      }
    }
    let config = extrequire("AT16879EEA1CB0000A.rule.baseConfig").execute().config;
    let updateOrderUrl = config.baseUrl + config.updateOrderUrl;
    let header = {
      "Content-Type": "application/json"
    };
    let body = { goodsOrder: goodsOrder };
    //更新订单信息
    var apiResponse = openLinker("POST", updateOrderUrl, "AT16879EEA1CB0000A", JSON.stringify(body));
    return { apiResponse };
  }
}
function getLastMonth() {
  // 获取上一个月的时间
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours() + 8;
  var minute = now.getMinutes();
  var second = now.getSeconds();
  // 如果当前月份为1月，则上一个月的年份需要减1，月份为12
  if (month === 1) {
    year -= 1;
    month = 12;
  } else {
    month -= 1;
  }
  // 获取上一个月的最后一天
  var lastDayOfMonth = new Date(year, month, 0);
  var lastDay = lastDayOfMonth.getDate();
  // 如果当前日期大于上一个月的最后一天，则日份需要设置为最后一天
  if (day > lastDay) {
    day = lastDay;
  }
  // 格式化时间
  var formatDate =
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day) +
    " " +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minute < 10 ? "0" + minute : minute) +
    ":" +
    (second < 10 ? "0" + second : second);
  return formatDate;
}
exports({ entryPoint: MyTrigger });