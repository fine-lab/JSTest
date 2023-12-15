let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var obj = JSON.parse(AppContext());
    var tid = obj.currentUser.tenantId;
    let reqEmail = request.reqEmail;
    let reqOrgId = request.reqOrgId;
    let org_name = request.reqOrgName;
    let reqClueCode = request.reqClueCode;
    let emailSuffix = "";
    let emailArray = reqEmail.split("@");
    if (emailArray.length != 2) {
      //非正常邮箱
      return { rst: false, usable: false, msg: "邮箱格式不正确!" };
    }
    emailSuffix = emailArray[1].toLowerCase(); //Email后缀
    let billNo = "3199a3d6"; //合一潜客单据
    let gsURI = "GT3734AT5.GT3734AT5.GongSi"; //合一潜客URI
    let gsLxrURI = "LianXiRenXinXi";
    let gsSuffix = "";
    let zuZhiLeiBie = "";
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
    let emailSuffixs = "";
    let dataObj = {};
    let rst = false;
    let gsSql = " select *," + gsLxrURI + ".YouXiang as keHuYouXiang," + gsLxrURI + ".DianHua as keHuDianHua," + gsLxrURI + ".mobile,Sales.name " + " from " + gsURI;
    let chkEmailEquSql = gsSql + " where " + gsLxrURI + ".YouXiang = '" + reqEmail + "'  limit 5";
    let chkEmailSufixSql = gsSql + " where " + gsLxrURI + ".YouXiang like '@" + emailSuffix + "' order by khxxlysj  limit 5";
    let msg = "0";
    let res = ObjectStore.queryByYonQL(chkEmailEquSql, "developplatform");
    if (res.length > 0) {
      //邮箱有重复
      dataObj = res[0];
      return { rst: true, usable: true, data: [dataObj], msg: "有重复数据,邮箱:" + reqEmail + " 业务员:" + dataObj.Sales_name + " 潜客编码:" + dataObj.code };
    } else {
      //邮箱不重复--检测后缀是否重复
      let emailSufxRst = ObjectStore.queryByYonQL("select id from GT3734AT5.GT3734AT5.CommEmailDomain where emailSuffix_lc='" + emailSuffix + "'", "developplatform");
      if (emailSufxRst != null && emailSufxRst.length > 0) {
        //属于公共邮箱--不用再检测后缀
        //检测是否在线索未审核中有
        var sqlStr =
          "select *,xunPanRenY.name from GT3734AT5.GT3734AT5.XunPanXSBill where verifystate!=2 and org_id='" + reqOrgId + "' and code !='" + reqClueCode + "' and keHuYouXiang='" + reqEmail + "'";
        let clueRes = ObjectStore.queryByYonQL(sqlStr);
        if (clueRes.length > 0) {
          let clueData = clueRes[0];
          if (clueData.code == reqClueCode) {
            return { rst: true, usable: false, msg: "公共邮箱!尚未检测到重复" };
          }
          return { rst: true, usable: true, data: [clueData], msg: "与线索" + clueData.code + "有重复数据，不允许录入!", dataType: "clueData" };
        } else {
          return { rst: true, usable: false, msg: "公共邮箱!尚未检测到重复" };
        }
      } else {
        //企业邮箱--检测后缀
        let emailSuffixRes = ObjectStore.queryByYonQL(chkEmailSufixSql, "developplatform");
        if (emailSuffixRes.length > 0) {
          //后缀有重复
          let emailSuffixObj = emailSuffixRes[0];
          dataObj = emailSuffixRes[0];
          return { rst: true, usable: true, data: [dataObj], msg: "企业邮箱,有重复数据,邮箱:" + dataObj.keHuYouXiang + " 业务员:" + dataObj.Sales_name + " 潜客编码:" + dataObj.code };
        } else {
          //后缀无重复
          //检测在未审核线索中是否存在--TODO 暂不检测20230511
          return { rst: false, usable: false, msg: "非公共邮箱,尚未检测到重复!" };
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });