let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    console.log("开始执行销售订单删除任务");
    //设置要删除N天前的数据
    const day = 10;
    //获取token
    let tokenFun = extrequire("SCMSA.DSRW.getAccessToken");
    let tokenRes = tokenFun.execute();
    var access_token = tokenRes.access_token;
    console.log("access_token=" + access_token);
    let date_end = recentTime(-1 * day - 1, "yyyy-MM-dd") + " 23:59:59";
    let body = {
      pageIndex: 1,
      pageSize: 1000,
      nextStatusName: "CONFIRMORDER", //开立态
      open_vouchdate_begin: "1900-01-01 00:00:00",
      open_vouchdate_end: date_end,
      isSum: true,
      simpleVOs: [
        {
          op: "eq",
          value1: "NOTPAYMENT", //未付款
          field: "payStatusCode"
        }
      ]
    };
    let header = {};
    let queryRes = postman("POST", "https://www.example.com/" + access_token, JSON.stringify(header), JSON.stringify(body));
    queryRes = JSON.parse(queryRes);
    let deleteIds = queryRes.data.recordList.map((item) => {
      return item.id;
    });
    //删除数据
    let deleteBody = {
      data: {
        id: deleteIds
      }
    };
    let deleteRes = postman("POST", "https://www.example.com/" + access_token, JSON.stringify(header), JSON.stringify(deleteBody));
    //临时函数
    //查询要删除的数据
    function recentTime(day, fmt, time) {
      //获取当前时间的毫秒值
      let now = (time ? new Date(time) : new Date()).getTime();
      // 获取前后n天时间
      let recent = new Date(now + day * 24 * 60 * 60 * 1000);
      let fmtObj = {
        "M+": recent.getMonth() + 1, //月份
        "d+": recent.getDate(), //日
        "h+": recent.getHours(), //时
        "m+": recent.getMinutes(), //分
        "s+": recent.getSeconds() //秒
      };
      // 获取匹配年份替换
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (recent.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (let key in fmtObj) {
        if (new RegExp(`(${key})`).test(fmt)) {
          //日期，时、分、秒替换，判断fmt是否需要补0，如：yyyy-M-d h:m:s 不补0,yyyy-MM-dd hh:mm:ss 则自动补0
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? fmtObj[key] : ("00" + fmtObj[key]).substr(("" + fmtObj[key]).length));
        }
      }
      return fmt;
    }
    return { success: true };
  }
}
exports({ entryPoint: MyTrigger });