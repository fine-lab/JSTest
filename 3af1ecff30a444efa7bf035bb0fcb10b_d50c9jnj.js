let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let len = request.len;
    let date = getDate();
    let sql = "select id ,batchDate,batchCode  from AT181E613C1770000A.AT181E613C1770000A.purInBatchNo  where batchDate = '" + date + "'";
    let outRes = ObjectStore.queryByYonQL(sql, "developplatform");
    let param = {};
    param.date = date;
    let result = {};
    result.codeStart = "ZRSG" + substring(date.replace("-", "").replace("-", ""), 2);
    if (!outRes || outRes.length == 0) {
      param.type = "1";
      result.codeNum = 1;
      param.len = len;
    } else {
      param.len = len + outRes[0].batchCode;
      result.codeNum = outRes[0].batchCode + 1;
      param.type = "2";
      param.id = outRes[0].id;
    }
    // 调接口更新批次号
    let env = ObjectStore.env();
    let tenantid = env.tenantId;
    let url = "https://www.example.com/" + tenantid + "/product_ref/product_ref_01/updatePurInBatchNo";
    let response = openLinker("POST", url, "ST", JSON.stringify(param));
    response = JSON.parse(response);
    if (response.code != "200") {
      throw new Error(JSON.stringify(response));
      throw new Error("获取批次号异常！请联系管理员！");
    } else {
      return result;
    }
    //获取编码前缀
    function getDate() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      let year = date.getFullYear() + "";
      var timeStr = year + "-";
      if (date.getMonth() < 9) {
        // 月份从0开始的
        timeStr += "0";
      }
      timeStr += date.getMonth() + 1;
      timeStr += "-";
      timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return timeStr;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });