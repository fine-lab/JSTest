let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取调度作业传参ORGCODE
    var orgCode = param == undefined ? undefined : param.orgCode;
    orgCode = orgCode == undefined ? param : orgCode;
    let orgSql = "select finorgid,finorgid.name,id,id.name from org.func.InventoryOrg ";
    var orgList = ObjectStore.queryByYonQL(orgSql, "ucf-org-center");
    // 获取GSP参数配置
    let gspParamSql = "select stopsaleparam,org_id,org_id.name from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where 1=1 and dr=0 and stopsaleparam is not null ";
    if (orgCode != undefined) {
      // 兼容配置和不配置组织参数的代码
      gspParamSql += " and  org_id.code=" + orgCode;
    }
    var gspParamList = ObjectStore.queryByYonQL(gspParamSql, "sy01");
    if (gspParamList.length == 0) {
      throw new Error(orgCode != undefined ? orgCode + "不存在停售期提前天数配置!" : "未找到配置停售提前天的匹配组织！");
    }
    // 获取GSP参数配置的组织对应的库存组织， 若有库存组织，按照库存组织计算， 若无库存组织
    var orgsArr = [];
    var tmp;
    for (var i = 0; i < gspParamList.length; i++) {
      // 循环所有参数配置的组织
      for (var j = 0; j < orgList.length; j++) {
        // 循环所有库存组织
        // 若某个库存组织的关联会计主体是当前GSP参数配置的组织, 记录当前组织的库存组织
        if (orgList[j].finorgid != undefined && orgList[j].finorgid != "" && orgList[j].finorgid != null && orgList[j].finorgid == gspParamList[i].org_id) {
          tmp = {
            orgId: orgList[j].id,
            orgName: orgList[j].id_name,
            paramOrgName: gspParamList[i].org_id_name,
            paramOrgId: gspParamList[i].org_id,
            stopsaleparam: gspParamList[i].stopsaleparam,
            type: orgList[j].id == orgList[j].finorgid ? "param" : "union"
          };
          orgsArr.push(tmp);
        }
      }
    }
    if (orgsArr == undefined || orgsArr.length == 0) {
      throw new Error("未查询到需要计算的组织！");
    }
    // 时间格式化方法
    var dateFormat = function (date, format) {
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours() + 8, //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
    // 获取库存状态
    var stockStatusDoc = "";
    let sql = "select id,code,statusName from st.stockStatusRecord.stockStatusRecord where statusName ='合格'";
    var list = ObjectStore.queryByYonQL(sql, "ustock");
    if (list.length > 0) {
      stockStatusDoc = list[0].id;
    } else {
      throw new Error("查询库存状态失败，请稍后重试！");
    }
    // 获取当前任务的租户ID
    var tenantid = context.tenantid;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (tenantid != "x5f9yw7w") {
      //生产环境
      apiRestPre = "https://www.example.com/";
    }
    var salt = "|fb4f91ab_2663738529976576|";
    // 时间戳，精确到分钟
    var timestampStr = dateFormat(new Date(), "yyyy-MM-dd HH:mm");
    //为防止被攻击，添加签名校验
    var objstr = tenantid + salt + timestampStr + stockStatusDoc;
    var sign = MD5Encode(objstr);
    // 拼装请求报文
    var obj = { tenantId: tenantid, logId: "test", time: timestampStr, uuid: sign, stockStatusDoc: stockStatusDoc, orgs: orgsArr };
    //获取api前缀等信息 参数： 请求方式 ， 地址  ，header ， body
    var strResponse = postman("post", apiRestPre + "/task/syncClosedProductStock", null, JSON.stringify(obj));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });