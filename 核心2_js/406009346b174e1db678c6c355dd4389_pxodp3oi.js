let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var obj = JSON.parse(AppContext());
    var tid = obj.currentUser.tenantId;
    let reqEmail = request.reqEmail;
    let reqOrgId = request.reqOrgId;
    let org_name = request.reqOrgName;
    let reqClueCode = request.reqClueCode;
    let user_id = request.userid; //询盘人员
    let customerName = request.reqCustomerName; //客户名称
    let tel = request.reqTel; //电话
    let billNo = "3199a3d6"; //合一潜客单据
    let gsURI = "GT3734AT5.GT3734AT5.GongSi"; //合一潜客URI
    let gsLxrURI = "LianXiRenXinXi";
    let gsSuffix = "";
    let zuZhiLeiBie = "";
    //开始检测潜在客户
    if (includes(org_name, "建机")) {
      gsSuffix = "_JJ";
      billNo = "b979b0e9";
      zuZhiLeiBie = 1;
    } else if (includes(org_name, "游乐")) {
      gsSuffix = "_YL";
      billNo = "04a3e644";
      zuZhiLeiBie = 3;
    } else if (includes(org_name, "环保")) {
      gsSuffix = "_HB";
      billNo = "7b52cdac";
      zuZhiLeiBie = 2;
    }
    gsURI = gsURI + gsSuffix;
    gsLxrURI = gsLxrURI + gsSuffix + "List";
    let EnterpriseEmail = true;
    let emailSuffixs = "";
    let emailSuffix = "";
    let dataObj = {};
    let rst = false;
    let res = [];
    let gsSql = " select *," + gsLxrURI + ".YouXiang as keHuYouXiang," + gsLxrURI + ".DianHua as keHuDianHua," + gsLxrURI + ".mobile,Sales.name from " + gsURI;
    let limitStr = " limit 10";
    let msg = "0";
    if (reqEmail != null && reqEmail != "") {
      res = ObjectStore.queryByYonQL(gsSql + " where " + gsLxrURI + ".YouXiang='" + reqEmail + "' " + limitStr);
      if (res.length > 0) {
        rst = true;
        dataObj = res[0];
        dataObj.verifystate = 2;
        return { rst: rst, data: [dataObj], msg: "有重复数据,邮箱:" + reqEmail };
      }
    }
    if (tel != null && tel != "") {
      res = ObjectStore.queryByYonQL(gsSql + " where " + gsLxrURI + ".DianHua='" + tel + "' or " + gsLxrURI + ".mobile='" + tel + "' " + limitStr);
      if (res.length > 0) {
        rst = true;
        dataObj = res[0];
        dataObj.verifystate = 2;
        return { rst: rst, data: [dataObj], msg: "有重复数据,客户电话:" + tel };
      }
    }
    res = ObjectStore.queryByYonQL(gsSql + " where MingChen='" + customerName + "' " + limitStr);
    if (res.length > 0) {
      rst = true;
      dataObj = res[0];
      dataObj.verifystate = 2;
      return { rst: rst, data: [dataObj], msg: "有重复数据,客户名称:" + customerName };
    }
    //检测线索，尚未审核生成潜客的线索重复情况
    var sqlStr =
      "select *,xunPanRenY.name from GT3734AT5.GT3734AT5.XunPanXSBill where verifystate!=2 and org_id='" + reqOrgId + "' and code !='" + reqClueCode + "' and (keHuMingCheng='" + customerName + "'";
    if (reqEmail != null && reqEmail != "") {
      sqlStr = sqlStr + " or keHuYouXiang='" + reqEmail + "'";
    }
    if (tel != null && tel != "") {
      sqlStr = sqlStr + " or keHuDianHua='" + tel + "'";
    }
    sqlStr = sqlStr + ")";
    let clueRes = ObjectStore.queryByYonQL(sqlStr);
    if (clueRes.length > 0) {
      let clueData = clueRes[0];
      return { rst: true, data: [clueData], msg: "与线索" + clueData.code + "有重复数据，不允许录入", dataType: "clueData" };
    }
    return { rst: rst, data: res, EnterpriseEmail: EnterpriseEmail, msg: msg };
  }
}
exports({ entryPoint: MyAPIHandler });