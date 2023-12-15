let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0];
    // 时间戳转日期
    function timestampToData(timestamp) {
      const dateObj = new Date(+timestamp + 28800000); // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
      const year = dateObj.getFullYear(); // 获取年，
      const month = pad(dateObj.getMonth() + 1); // 获取月，必须要加1，因为月份是从0开始计算的
      const date = pad(dateObj.getDate()); // 获取日，记得区分getDay()方法是获取星期几的。
      const hours = pad(dateObj.getHours()); // 获取时, pad函数用来补0
      const minutes = pad(dateObj.getMinutes()); // 获取分
      const seconds = pad(dateObj.getSeconds()); // 获取秒
      return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    }
    function timestampToTime(timestamp) {
      const dateObj = new Date(+timestamp + 28800000); // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
      const year = dateObj.getFullYear(); // 获取年，
      const month = pad(dateObj.getMonth() + 1); // 获取月，必须要加1，因为月份是从0开始计算的
      const date = pad(dateObj.getDate()); // 获取日，记得区分getDay()方法是获取星期几的。
      const hours = pad(dateObj.getHours()); // 获取时, pad函数用来补0
      const minutes = pad(dateObj.getMinutes()); // 获取分
      const seconds = pad(dateObj.getSeconds()); // 获取秒
      const milliseconds = dateObj.getMilliseconds(); // 毫秒
      return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }
    function pad(str) {
      return +str >= 10 ? str : "0" + str;
    }
    let convertLongToDateTime = function (paramData, keyName) {
      if (paramData[keyName]) {
        paramData[keyName] = timestampToData(paramData[keyName]);
      }
    };
    let convertLongToTimeStamp = function (paramData, keyName) {
      if (paramData[keyName]) {
        paramData[keyName] = timestampToTime(paramData[keyName]);
      }
    };
    // 检验单流程逻辑处理:自动审核
    if (!queryUtils.isEmpty(bill["source"]) && bill["source"].indexOf("developplatform") >= 0) {
      // 低代码的日期格式为long型,手动转换格式
      convertLongToDateTime(param.data[0], "vouchdate");
      convertLongToDateTime(param.data[0], "modifyDate");
      convertLongToDateTime(param.data[0], "modifyTime");
      convertLongToDateTime(param.data[0], "createTime");
      convertLongToDateTime(param.data[0], "createDate");
      // 保存时已经检查时间戳了
      delete param.data[0]["pubts"];
      // 因日期格式问题，并且审核时不需子表数据,手动删除
      delete param.data[0]["goodChanges"];
      var data = { billnum: param.billnum, data: param.data[0] };
      var res = {};
      res.data = ObjectStore.execute("audit", data);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });