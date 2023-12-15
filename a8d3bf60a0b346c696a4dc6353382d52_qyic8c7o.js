let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    //设置时间带时分秒
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeonds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    var d = new Date(data.contractDate); //创建一个Date对象
    var localTime = d.getTime();
    var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
    var gmt = localTime + localOffset; //GMT时间
    var offset = 8; //东8区
    var beijing = gmt + 3600000 * offset;
    var nd = new Date(beijing);
    let body = [
      {
        areaId: data.areaId,
        busiType: data.busiType,
        calMoney: data.calMoney,
        calType: data.calType,
        certLevelName: data.certLevelName,
        certlevel: data.certlevel,
        contractDate: formatDateTime(nd),
        contractMoney: data.contractMoney,
        contractid: data.contractid,
        contractno: data.contractno,
        corpname: data.corpname,
        cyear: data.cyear,
        orgName: data.orgName,
        partnerName: data.partnerName
      }
    ];
    let yhtUserId = JSON.parse(AppContext()).currentUser.id;
    throw new Error(JSON.stringify(body));
  }
}
exports({ entryPoint: MyTrigger });