let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestData = request.data;
    //验证编码
    let queryCode = requestData.code;
    let querySql = "select * from  GT80266AT1.GT80266AT1.salesAdvanceOrder where code='" + queryCode + "'";
    var queryRes = ObjectStore.queryByYonQL(querySql);
    if (queryRes.length == 0) {
      throw new Error("更新销售预订单失败，【单据编码】:" + queryCode + "未查询到对应的数据！");
    } else if (queryRes.length > 1) {
      throw new Error("更新销售预订单失败，【单据编码】:" + queryCode + "查询到多条对应的数据！");
    }
    if (queryRes[0].verifystate == 2) {
      throw new Error("更新销售预订单失败，【单据编码】:" + queryCode + "为已审核数据，该接口不支持修改！");
    }
    //更新id
    let updateId = queryRes[0].id;
    //更新参数
    var object = { id: updateId };
    //验证开票网址，验证码
    let linkText = requestData.linkText;
    let linkAddress = requestData.linkAddress;
    if (linkText != "" && linkText != null) {
      if (linkAddress != null && linkAddress != "") {
        var linkAddressArray = linkAddress.split("//");
        if (linkAddressArray.length != 2) {
          throw new Error("更新销售预订单失败，【开票网址】:" + linkAddress + "格式不正确！");
        }
        if (linkAddressArray[0] != "http:" && linkAddressArray[0] != "https:") {
          throw new Error("更新销售预订单失败，【开票网址】:" + linkAddress + "格式不正确,应以http和https开头！");
        }
        if (linkAddressArray[1].length > 200) {
          throw new Error("更新销售预订单失败，【开票网址】:" + linkAddress + "输入的长度不能超过200位！");
        }
        let updateData = { linkText: linkText, linkAddress: linkAddress };
        object.fapiaowangzhi = JSON.stringify(updateData);
      } else {
        throw new Error("更新销售预订单失败，【开票网址】为空！");
      }
    } else {
      if (linkAddress != null && linkAddress != "") {
        throw new Error("更新销售预订单失败，【验证码】为空！");
      }
    }
    //验证是否开票
    let isbillingData = requestData.isbilling;
    if (isbillingData != null && isbillingData != "") {
      if (isbillingData != "false" && isbillingData != "true") {
        throw new Error("更新销售预订单失败，【是否开票】字段值错误" + isbillingData);
      } else {
        object.isbilling = isbillingData;
      }
    }
    //验证是否关闭
    let iscloseData = requestData.isclose;
    if (iscloseData != null && iscloseData != "") {
      if (iscloseData != "true") {
        throw new Error("更新销售预订单失败，【是否关闭】字段值错误:" + iscloseData);
      } else {
        object.isclose = iscloseData;
      }
    }
    //验证快递单号
    let couriernumData = requestData.couriernum;
    if (couriernumData != null && couriernumData != "") {
      object.couriernum = couriernumData;
    }
    //更新
    var res = ObjectStore.updateById("GT80266AT1.GT80266AT1.salesAdvanceOrder", object, "34d58361");
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });