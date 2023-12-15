function GetCurrentTime() {
  const difference = new Date().getTimezoneOffset() * 60 * 1000; //将差异值转成毫秒值
  const GreenwichMillminutes = new Date().getTime() + difference;
  const GreenwichDate = new Date(GreenwichMillminutes);
  var beijingTimeStamp = GreenwichMillminutes + 8 * 60 * 60 * 1000;
  const myDate = new Date(beijingTimeStamp);
  var currentTime = "";
  var year = myDate.getFullYear();
  var month = parseInt(myDate.getMonth().toString()) + 1; //month是从0开始计数的，因此要 + 1
  if (month < 10) {
    month = "0" + month.toString();
  }
  var date = myDate.getDate();
  if (date < 10) {
    date = "0" + date.toString();
  }
  var hour = myDate.getHours();
  if (hour < 10) {
    hour = "0" + hour.toString();
  }
  var minute = myDate.getMinutes();
  if (minute < 10) {
    minute = "0" + minute.toString();
  }
  var second = myDate.getSeconds();
  if (second < 10) {
    second = "0" + second.toString();
  }
  currentTime = year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hour.toString() + ":" + minute.toString() + ":" + second.toString(); //以时间格式返回
  return currentTime;
}
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = " select * from aa.merchant.Merchant where  code = '103917'";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    return { res };
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var day = date.getDate();
    var dateStr = [year, "-", month, "-", day].join("");
    var custId = "yourIdHere";
    var orgId = "yourIdHere";
    var productClassIDOne = "1712713695128190982";
    var productClassIDTwo = "1743150668087033861";
    var productCode = request.productCode;
    var sql =
      "select  beginDate, c.agentId agentId,c.productId productId,a.price price,d.name amountUnit , d.id  amountUnitid   " +
      "from marketing.price.PriceRecord " +
      "inner join marketing.price.PriceAdjustDetail a on a.id = priceAdjustmentItemId " +
      "inner join marketing.price.PriceTemplate b on b.id = priceTemplateId " +
      "inner join marketing.price.PriceAdjustDetailDimension c on c.priceAdjustDetailId = a.id " +
      "left join pc.unit.Unit d on amountUnit = d.id " +
      "where   orgScope = '" +
      orgId +
      "' and  enable = 1  and  c.productId = 'yourIdHere'   and adddate(beginDate,0)  <=  '" +
      dateStr +
      " 23:59:59' and  adddate(endDate,0)  >=  '" +
      dateStr +
      " 23:59:59'  and b.name = '客户+商品'   ";
    if (custId != null && custId != "") {
      sql += " and c.agentId = '" + custId + "'";
    }
    let listMap = {};
    var list = ObjectStore.queryByYonQL(sql, "marketingbill");
    for (var z = 0; z < list.length; z++) {
      listMap[list[z].productId] = list[z];
    }
    return { list };
    var sql = "select mobile from hred.staff.Staff where id = 'youridHere' ";
    var res = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });