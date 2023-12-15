let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var accessToken;
    let pricing_policy_ref_name_select = request.pricing_policy_ref_name_select;
    let profileBSql = "";
    if (pricing_policy_ref_name_select) {
      profileBSql =
        "select *,businessprofile.name pricing_policy_ref_name from GT80750AT4.GT80750AT4.storeprofile where enablestatus = '0' and businessprofile = '" + pricing_policy_ref_name_select + "'";
    } else {
      profileBSql = "select *,businessprofile.name pricing_policy_ref_name from GT80750AT4.GT80750AT4.storeprofile where enablestatus = '0' ";
    }
    let code = request.code; //下单客户编码
    let agentId = request.agentId; //下单客户id
    let orgId = request.orgId; //下单客户所属组织
    //订单上没获取到下单客户编码 调接口根据id查询一下
    if (code == undefined || code == "" || code.length == 0) {
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + agentId + "&orgId=" + orgId, "", "");
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data.code == undefined || result.data.code == "") {
          code = "0";
        } else {
          code = result.data.code;
        }
      } catch (e) {
        throw new Error("获取所属分销商 " + e + ";参数:" + JSON.stringify(agentId));
      }
    }
    //跨域调用Ncc接口 查询下单客户所属分销商code
    let uri = `https://ncc-test.49icloud.com:8080/servlet/QueryCustomerCode?code=${code}`;
    let strResponse = postman("post", uri, "", "");
    let fxscode = JSON.parse(strResponse).data;
    if (fxscode == undefined) {
      fxscode = "0";
    }
    let currentPage = 1;
    let pageSize = 10;
    let currentDate = new Date(); // 获取当前日期时间
    let currentDateISO = currentDate.toISOString().slice(0, 10); //截取年月日
    if (request != undefined) {
      if (fxscode != undefined && fxscode != "") {
        profileBSql = `${profileBSql} and distributorcode = '${fxscode}' and (usestatus = '3' or usestatus = '2')   and stopdate >= '${currentDateISO}'`;
      }
      if (request.currentPage != undefined && request.currentPage != "") {
        currentPage = request.currentPage;
      }
      if (request.pageSize != undefined && request.pageSize != "") {
        pageSize = request.pageSize;
      }
    }
    let profileBs = ObjectStore.queryByYonQL(profileBSql);
    var resData = {
      profileBs: [],
      currentPage: currentPage,
      pageSize: pageSize,
      sql: profileBSql,
      re: request,
      totalNum: 0
    };
    if (profileBs == undefined || profileBs.length == 0) {
      return { code: 200, data: resData };
    }
    // 分页处理
    let startPageSize = (currentPage - 1) * pageSize;
    let endPageSize = currentPage * pageSize;
    profileBs.forEach((self, index) => {
      if (index >= startPageSize && index < endPageSize) {
        resData.profileBs.push(self);
      }
    });
    resData.totalNum = profileBs.length;
    return { code: 200, data: resData };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
  }
}
exports({ entryPoint: MyAPIHandler });