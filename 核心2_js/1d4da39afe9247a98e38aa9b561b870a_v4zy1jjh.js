let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let flag = true;
    let zuhuid = JSON.parse(AppContext()).currentUser.tenantId;
    let zuhuidarr = {};
    zuhuidarr["index"] = 2000;
    zuhuidarr["type"] = "tenant_id";
    let zuhuidbrr = {};
    zuhuidbrr["format"] = "string";
    zuhuidbrr["value"] = zuhuid;
    zuhuidarr["data"] = zuhuidbrr;
    let dataStr = request.data.data;
    let dataObj = JSON.parse(dataStr);
    let extendcheck = dataObj.extendcheck;
    let a = JSON.stringify(extendcheck);
    let code = dataObj.code;
    let codearr = {};
    codearr["index"] = 2001;
    codearr["type"] = "bank_branch_code";
    let codebrr = {};
    codebrr["format"] = "string";
    codebrr["value"] = code;
    codearr["data"] = codebrr;
    let name = dataObj.name.zh_CN;
    let namearr = {};
    namearr["index"] = 2002;
    namearr["type"] = "bank_branch_name";
    let namebrr = {};
    namebrr["format"] = "string";
    namebrr["value"] = name;
    namearr["data"] = namebrr;
    let type = dataObj.bank_name;
    let typearr = {};
    typearr["index"] = 2003;
    typearr["type"] = "bank_type";
    let typebrr = {};
    typebrr["format"] = "string";
    typebrr["value"] = type;
    typearr["data"] = typebrr;
    let hanghao = dataObj.linenumber;
    let hanghaoarr = {};
    hanghaoarr["index"] = 2004;
    hanghaoarr["type"] = "interbank_no";
    let hanghaobrr = {};
    hanghaobrr["format"] = "string";
    hanghaobrr["value"] = hanghao;
    hanghaoarr["data"] = hanghaobrr;
    let dobody = [];
    dobody[0] = zuhuidarr;
    dobody[1] = codearr;
    dobody[2] = namearr;
    dobody[3] = typearr;
    dobody[4] = hanghaoarr;
    let biaoshi = code;
    let doThisCheck = {};
    doThisCheck["handle"] = "88.263.1/" + biaoshi;
    doThisCheck["templateVersion"] = "银行网点单据标识模板";
    doThisCheck["value"] = dobody;
    if (dobody.length > 0) {
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
      let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(doThisCheck));
      responseObj = JSON.parse(responseObj);
      if ((responseObj.code == "200" && responseObj.message == "SUCCESS") || (responseObj.code == "400" && responseObj.message.indexOf("标识已存在") != -1)) {
        flag = true;
      } else {
        flag = false;
      }
    }
    return {
      flag
    };
  }
}
exports({ entryPoint: MyAPIHandler });