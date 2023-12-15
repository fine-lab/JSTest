let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let zuhuid = JSON.parse(AppContext()).currentUser.tenantId;
    let zuhuidarr = {};
    zuhuidarr["index"] = 2000;
    zuhuidarr["type"] = "tenant_id";
    let zuhuidbrr = {};
    zuhuidbrr["format"] = "string";
    zuhuidbrr["value"] = zuhuid;
    zuhuidarr["data"] = zuhuidbrr;
    let res = param.data;
    let allbody = [];
    for (var i = 0; i < res.length; i++) {
      let thisMap = {};
      thisMap["templateVersion"] = "银行网点单据标识模板";
      let code = res[i].code;
      let codearr = {};
      codearr["index"] = 2001;
      codearr["type"] = "bank_branch_code";
      let codebrr = {};
      codebrr["format"] = "string";
      codebrr["value"] = code;
      codearr["data"] = codebrr;
      let name = res[i].name.zh_CN;
      let namearr = {};
      namearr["index"] = 2002;
      namearr["type"] = "bank_branch_name";
      let namebrr = {};
      namebrr["format"] = "string";
      namebrr["value"] = name;
      namearr["data"] = namebrr;
      let type = res[i].bank_name;
      let typearr = {};
      typearr["index"] = 2003;
      typearr["type"] = "bank_type";
      let typebrr = {};
      typebrr["format"] = "string";
      typebrr["value"] = type;
      typearr["data"] = typebrr;
      let hanghao = res[i].linenumber;
      if (hanghao == null || hanghao == "") {
        hanghao = code;
      }
      let hanghaoarr = {};
      hanghaoarr["index"] = 2004;
      hanghaoarr["type"] = "interbank_no";
      let hanghaobrr = {};
      hanghaobrr["format"] = "string";
      hanghaobrr["value"] = hanghao;
      hanghaoarr["data"] = hanghaobrr;
      let valuebody = [];
      valuebody[0] = zuhuidarr;
      valuebody[1] = codearr;
      valuebody[2] = namearr;
      valuebody[3] = typearr;
      valuebody[4] = hanghaoarr;
      let biaoshi = hanghao;
      thisMap["handle"] = "88.263.1/" + biaoshi;
      thisMap["value"] = valuebody;
      allbody[i] = thisMap;
    }
    var flge = true;
    let doThisCheck = {};
    if (allbody.length > 0) {
      let body = {};
      let header = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let strResponse = postman(
        "get",
        "https://www.example.com/",
        JSON.stringify(header),
        JSON.stringify(body)
      );
      strResponse = JSON.parse(strResponse);
      if (strResponse.code == "200" && strResponse.message == "SUCCESS") {
      } else if (strResponse.code == "400" && strResponse.message.indexOf("token已失效") != -1) {
        let strtokenResponse = postman(
          "put",
          "https://www.example.com/",
          JSON.stringify(header),
          JSON.stringify(body)
        );
        strtokenResponse = JSON.parse(strtokenResponse);
        if (strtokenResponse.code == "200" && strtokenResponse.message == "SUCCESS") {
          strResponse = postman(
            "get",
            "https://www.example.com/",
            JSON.stringify(header),
            JSON.stringify(body)
          );
          strResponse = JSON.parse(strResponse);
        }
      } else {
        throw new Error("连接标识系统失败" + JSON.stringify(strResponse));
      }
      let dataResponse = strResponse.data;
      let tokenSStr = dataResponse.token;
      doThisCheck["token"] = tokenSStr;
      doThisCheck["list"] = allbody;
      let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(doThisCheck));
      responseObj = JSON.parse(responseObj);
      if (responseObj.code == "200" && responseObj.message == "SUCCESS") {
        let retdate = responseObj.data;
        for (i = 0; i < retdate.length; i++) {
          let shuji = retdate[i];
          if ((shuji.code == 1 && shuji.msg == "success") || (shuji.code == -2 && shuji.msg == "标识已存在")) {
          } else {
            flge = false;
            errMsg = errMsg + shuji.msg + ";";
          }
        }
      }
    }
    if (!flge) {
      throw new Error("------" + errMsg + "------");
    }
    return { flge };
  }
}
exports({ entryPoint: MyTrigger });