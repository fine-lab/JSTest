let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let codeStart = getCodeStart();
    let sql = "select purInRecords.id  subId from st.purinrecord.PurInRecord  where extendReceiptBatchNo like '" + codeStart + "'";
    let outRes = ObjectStore.queryByYonQL(outSql);
    if (!outRes || outRes.length == 0) {
      return { len: 0 };
    } else {
      return { len: outRes.length };
    }
    //获取编码前缀
    function getCodeStart() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      var timeStr = "ZRSG" + date.getFullYear().substring(2);
      if (date.getMonth() < 9) {
        // 月份从0开始的
        timeStr += "0";
      }
      timeStr += date.getMonth() + 1;
      timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return timeStr;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });