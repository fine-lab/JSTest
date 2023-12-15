let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Data = param.data;
    let ArrList = new Array();
    for (let i = 0; i < Data.length; i++) {
      // 单号
      let DeliveryorderNo = Data[i].DeliveryorderNo;
      // 委托方id
      let ClientCode = Data[i].ClientCode;
      var timezone = 8; //目标时区时间，东八区
      // 本地时间和格林威治的时间差，单位为分钟
      var offset_GMT = new Date().getTimezoneOffset();
      // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var nowDate = new Date().getTime();
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      // 当前日期时间戳
      var endDate = new Date(date).getTime();
      let _status = Data[i]._status;
      if (_status == "Update") {
        let sql = "select fromDate,toDate,expiryDate from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where id = '" + ClientCode + "'";
        let res = ObjectStore.queryByYonQL(sql);
        // 开始委托时间
        let fromDate = res[0].fromDate;
        let fromDate_date = new Date(fromDate);
        let fromDate_time = fromDate_date.getTime();
        // 停止委托时间
        let toDate = res[0].toDate;
        let toDate_date = new Date(toDate);
        let toDate_time = toDate_date.getTime();
        // 备案凭证有效期
        let expiryDate = res[0].expiryDate;
        let expiryDate_date = new Date(expiryDate);
        let expiryDate_time = expiryDate_date.getTime();
        var messageList = {};
        if (endDate > fromDate_time && endDate < toDate_time && endDate < expiryDate_time) {
        } else {
          messageList = {
            预到货单号为: DeliveryorderNo,
            错误信息: "委托方合同不在有效期内不可新增！"
          };
          ArrList.push(messageList);
        }
      } else {
        let sql = "select fromDate,toDate,expiryDate from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where id = '" + ClientCode + "'";
        let res = ObjectStore.queryByYonQL(sql);
        // 开始委托时间
        let fromDate = res[0].fromDate;
        let fromDate_date = new Date(fromDate);
        let fromDate_time = fromDate_date.getTime();
        // 停止委托时间
        let toDate = res[0].toDate;
        let toDate_date = new Date(toDate);
        let toDate_time = toDate_date.getTime();
        // 备案凭证有效期
        let expiryDate = res[0].expiryDate;
        let expiryDate_date = new Date(expiryDate);
        let expiryDate_time = expiryDate_date.getTime();
        var object = {};
        if (endDate > fromDate_time && endDate < toDate_time && endDate < expiryDate_time) {
        } else {
          object = {
            预到货单号为: DeliveryorderNo,
            错误信息: "委托方合同不在有效期内不可新增！"
          };
          ArrList.push(object);
        }
      }
    }
    if (ArrList.length > 0) {
      throw new Error(JSON.stringify(ArrList));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });