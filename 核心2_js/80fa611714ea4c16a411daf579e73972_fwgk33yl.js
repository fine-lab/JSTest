let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var processInstId = request.processInstId;
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    var object = { id: businessKey };
    //实体查询
    var res = ObjectStore.selectById("GT25173AT14.GT25173AT14.FQXT", object);
    var orgid = res.org_id;
    //查询组织信息
    let func1 = extrequire("GT25173AT14.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var strResponse = postman("get", "https://www.example.com/" + token + "&id=" + orgid, null, null);
    var resp = JSON.parse(strResponse);
    if (resp.code == "200") {
      let data = resp.data;
      res["applyOrgName"] = data.name.zh_CN; //申请机构
      res["applyOrgCode"] = data.code; //申请机构编码
    }
    //基本信息
    res["industry"] = res.MainIndustry || ""; //行业
    res["productLine"] = res.ProductLine || ""; //产品线
    res["area"] = res.Province || ""; //地区
    res["field"] = res.Field || ""; //领域
    res["inputTime"] = res.applyDate || ""; //申请时间
    res["applyPersonName"] = res.applyPerson || ""; //申请人姓名
    //获取申请人信息
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      userId: [res.creator]
    };
    var handleMoblie = function (mobile) {
      return mobile.replace("+86-", "");
    };
    var userInfos = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(body));
    var userRes = JSON.parse(userInfos);
    if (userRes.code == "200") {
      if (userRes.data.status == "1") {
        let data = userRes.data.data;
        if (data.length > 0) {
          var id = data[0].id;
          var code = data[0].code;
          res["applyPersonName"] = data[0].name || ""; //申请人姓名
          res["applyPersonCode"] = data[0].code || ""; //申请人编码
          res["applyPersonPhone"] = handleMoblie(data[0].mobile || ""); //申请人电话
          var userDetail = postman("get", "https://www.example.com/" + token + "&id=" + id + "&code=" + code, null, null);
          var userDetailRes = JSON.parse(userDetail);
          if (userDetailRes.code == "200") {
            res["applyPersonEmail"] = userDetailRes.data.email || ""; //申请人邮箱
          }
        }
      }
    }
    //调用第三方接口推送数据
    let token_url = "https://www.example.com/";
    let tokenResponse = postman("get", token_url, null, null);
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let pompheader = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var resultRet = postman("post", "https://www.example.com/", JSON.stringify(pompheader), JSON.stringify(res));
      var resultRes = JSON.parse(resultRet);
    }
  }
}
exports({ entryPoint: MyAPIHandler });