let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //结果区域-------------------------------begin
    var edited,
      attention,
      invalid,
      alldata = 0;
    var lookResMy = [];
    //结果区域--------------------------------end
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    //当前登录的用户信息
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      var userid = userData[currentUser.id].id;
      //根据条件查询异常记录表
      //系统请求参数
      var option = request.option.commonVOs;
      var optionStr = "";
      option.forEach((data) => {
        if (data.itemName != "schemeName" && data.itemName != "isDefault") {
          optionStr = optionRe(optionStr, data, "and");
        }
      });
      if (undefined != request.option.simpleVOs) {
        var zdyoption = request.option.simpleVOs[0].conditions[0].conditions;
        var optionStr2 = " ";
        //循环自定义条件
        zdyoption.forEach((data) => {
          optionStr2 = optionRe(optionStr2, data, "or");
        });
        optionStr = optionStr + " and (" + optionStr2.substring(4) + ")";
      }
      //获取当前异常记录信息，并循环判断是否是已废弃，并统计废弃数量
      var abnormalevent2 = "select id as abnormalevent,invalid_m from GT8053AT100.GT8053AT100.abnormalevent2 where 1=1 " + optionStr;
      var abnormalevent2Res = ObjectStore.queryByYonQL(abnormalevent2);
      if (undefined != abnormalevent2Res && abnormalevent2Res.length > 0) {
        alldata = abnormalevent2Res.length;
        var abnormalevent2ResArr = [];
        abnormalevent2Res.forEach((data) => {
          abnormalevent2ResArr.push(data.abnormalevent);
          if (data.invalid_m == "1") {
            if (undefined == invalid) invalid = 0;
            invalid++;
          }
        });
        //获取当前用户的关注列表
        var attentionSql = "select abnormalevent from GT8053AT100.GT8053AT100.attentiondoc2 where StaffNew = '" + userid + "'";
        var attentionRes = ObjectStore.queryByYonQL(attentionSql);
        //从阅读记录中获取当前的查看数据
        var lookSql = "select distinct abnormalevent from GT8053AT100.GT8053AT100.looklog2 where StaffNew = '" + userid + "'";
        var lookRes = ObjectStore.queryByYonQL(lookSql);
        //取交集
        if (undefined != attentionRes && null != attentionRes) {
          let attResIntersection = attentionRes.filter(function (val) {
            return abnormalevent2ResArr.indexOf(val.abnormalevent) > -1;
          });
          attention = attResIntersection.length;
        }
        if (undefined != lookRes && null != lookRes) {
          let lookResIntersection = lookRes.filter(function (val) {
            return abnormalevent2ResArr.indexOf(val.abnormalevent) > -1;
          });
          edited = lookResIntersection.length;
          lookResMy = lookResIntersection;
        }
      }
    } else {
      throw new Error("没有获取到当前用户的组织信息");
    }
    //将条件转为str
    function optionRe(optionStr, data, link) {
      var name = undefined == data.field ? data.itemName : data.field;
      var op = undefined == data.op ? "=" : data.op;
      //对条件进行处理
      switch (op) {
        case "eq":
          op = "=";
          break;
        default:
      }
      var value1 = "";
      //如果值为数组
      if (Array.isArray(data.value1)) {
        value1 = "('" + data.value1.join("','") + "')";
      } else {
        value1 = "'" + data.value1 + "'";
      }
      optionStr += " " + link + " " + name + " " + op + " " + value1;
      return optionStr;
    }
    return { edited: edited, attention: attention, lookResMy: lookResMy, invalid: invalid, alldata: alldata };
  }
}
exports({ entryPoint: MyAPIHandler });