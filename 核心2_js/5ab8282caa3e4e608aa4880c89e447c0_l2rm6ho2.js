let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let shopIdenty = request.shopIdenty;
    let daySart = request.daySart;
    let dayEnd = request.dayEnd;
    let pageNumber = request.pageNumber;
    let timeType = request.timeType;
    let token = request.token;
    let appKey = request.appKey;
    let version = request.version;
    let url = request.orderurl;
    let header = request.header;
    let type = request.type;
    let pageSize = request.pageSize;
    let timestamp = request.timestamp;
    let body = JSON.stringify({ shopIdenty: shopIdenty, startTime: daySart, endTime: dayEnd, pageNo: Number(pageNumber), timeType: timeType, pageSize: pageSize });
    let secrectdata = "appKey" + appKey + "shopIdenty" + shopIdenty + "timestamp" + timestamp + "version" + version + "body" + body + token;
    let resdata = SHA256Encode(secrectdata);
    let signature = encodeURIComponent(resdata);
    let base_path = url + "?appKey=" + appKey + "&shopIdenty=" + shopIdenty + "&timestamp=" + timestamp + "&version=" + version + "&sign=" + signature;
    let strResponse = postman("post", base_path, JSON.stringify(header), body);
    let responsedata = JSON.parse(strResponse);
    if (type === 1) {
      return { responsedata };
    } else {
      let items = responsedata.result.items;
      let shopmap = getAllShopMap();
      let shopfun = extrequire("GT30233AT436.backDefaultGroup.getOrderStatus");
      let tradeStatusmap = shopfun.execute(null);
      if (null !== items && items.length > 0) {
        for (var i = 0; i < items.length; i++) {
          items[i].shopIdenty = shopIdenty;
          items[i].shopName = shopmap.get(shopIdenty);
          items[i].startTime = daySart;
          items[i].endTime = dayEnd;
          items[i].timetype = timeType;
          items[i].tradeStatusName = tradeStatusmap.get(trim(items[i].tradeStatus));
          items[i].orderTimedate = getYMDAndHMS(items[i].orderTime);
          items[i].orderTimePeriod = getHmsperiod(items[i].orderTime, 1);
          items[i].checkOutTimeDate = getYMDAndHMS(items[i].checkOutTime);
          items[i].checkOutTimeperiod = getHmsperiod(items[i].checkOutTime, 1);
          items[i].dingdangeshu = 1;
        }
      }
      return items;
    }
    function getAllShopMap() {
      let sql = "select   shopID,shopName from  GT30233AT436.GT30233AT436.kryShopInfo  where dr=0";
      let rst = ObjectStore.queryByYonQL(sql);
      let map = new Map();
      if (null !== rst && rst.length > 0) {
        for (var i = 0; i < rst.length; i++) {
          map.set(rst[i].shopID, rst[i].shopName);
        }
      }
      return map;
    }
    //就餐类型
    function getDelivertype() {
      let sql = "select   delivertypecode,delivertypename from  GT30233AT436.GT30233AT436.krydelivertype  where dr=0";
      let rst = ObjectStore.queryByYonQL(sql);
      let map = new Map();
      if (null !== rst && rst.length > 0) {
        for (var i = 0; i < rst.length; i++) {
          map.set(trim(rst[i].delivertypecode), rst[i].delivertypename);
        }
      }
      return map;
    }
    function getYMDAndHMS(timestamp) {
      var date = null;
      if (null === timestamp) {
        return "";
      } else {
        var times = timestamp.toString();
        if (times.length === 13) {
          date = new Date((timestamp * 1000) / 1000);
        } else {
          date = new Date(timestamp * 1000);
        }
        var YY = date.getFullYear() + "-";
        var MM = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
        var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return YY + MM + DD;
      }
    }
    function getHmsperiod(timestamp, n) {
      var date = null;
      if (null === timestamp) {
        return "";
      } else {
        var times = timestamp.toString();
        if (times.length === 13) {
          date = new Date((timestamp * 1000) / 1000);
        } else {
          date = new Date(timestamp * 1000);
        }
        var h = date.getHours() + ":";
        var m = date.getMinutes() + ":";
        var s = date.getSeconds();
        var hms = h + m + s;
        var hour = hms.split(":");
        var next = Number(hour[0]) + Number(n);
        return hour[0] + ":00~" + next + ":00";
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });