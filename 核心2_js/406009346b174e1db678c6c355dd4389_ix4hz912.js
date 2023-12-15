let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    let reqEmail = request.reqEmail;
    let reqOrgId = request.reqOrgId;
    let reqClueCode = request.reqClueCode;
    let user_id = request.userid; //询盘人员
    let customerName = request.reqCustomerName; //客户名称
    let tel = request.reqTel; //电话
    var sqlStr = "select * from GT3734AT5.GT3734AT5.XunPanXSBill where org_id='" + reqOrgId + "' and code !='" + reqClueCode + "' and (keHuMingCheng='" + customerName + "'";
    if (reqEmail != null && reqEmail != "") {
      sqlStr = sqlStr + " or keHuYouXiang='" + reqEmail + "'";
    }
    if (tel != null && tel != "") {
      sqlStr = sqlStr + " or keHuDianHua='" + tel + "'";
    }
    sqlStr = sqlStr + ") order by xunPanJieShouSJ desc";
    res = ObjectStore.queryByYonQL(sqlStr);
    var rst = false;
    let EnterpriseEmail = true;
    let emailSuffixs = "";
    let emailSuffix = "";
    let dataObj;
    if (res.length > 0) {
      rst = true;
      for (var i = 0; i < res.length; i++) {
        dataObj = res[i];
        if (reqEmail == dataObj.keHuYouXiang) {
          return { rst: rst, data: [dataObj], msg: "有重复数据,邮箱:" + reqEmail };
        }
      }
      for (var j = 0; j < res.length; j++) {
        //电话 检测
        dataObj = res[j];
        if (tel == dataObj.keHuDianHua) {
          return { rst: rst, data: [dataObj], msg: "有重复数据,客户电话:" + tel };
        }
      }
      for (var k = 0; k < res.length; k++) {
        //客户名称 检测
        dataObj = res[k];
        if (tel == dataObj.keHuMingCheng) {
          return { rst: rst, data: [dataObj], msg: "有重复数据,客户名称:" + customerName };
        }
      }
    } else {
      if (false) {
        //企业邮箱判断是否复盘
        emailSuffixs = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: "1", emunURI: "EmailSuffix" }));
        emailSuffixs = "," + capitalizeEveryWord(emailSuffixs) + ",";
        emailSuffix = reqEmail.split("@")[1]; //split(reqEmail,'@');
        emailSuffix = "," + capitalizeEveryWord(emailSuffix) + ",";
        if (includes(emailSuffixs, emailSuffix)) {
          //非企业邮箱--不可用于鉴别重复
          EnterpriseEmail = false;
        } else {
          //企业邮箱--可用于鉴别复盘线索
          EnterpriseEmail = true;
        }
      }
    }
    return { rst: rst, data: res, EnterpriseEmail: EnterpriseEmail };
  }
}
exports({ entryPoint: MyAPIHandler });