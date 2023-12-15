let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let flag = true;
    var r = request.r;
    let dataStr = r.data.data;
    let dataObj = JSON.parse(dataStr);
    var zuhu = JSON.parse(AppContext()).currentUser.tenantId;
    let zuhuarr = {};
    zuhuarr["index"] = 2000;
    zuhuarr["type"] = "tenant_id";
    let zuhubrr = {};
    zuhubrr["format"] = "string";
    zuhubrr["value"] = zuhu;
    zuhuarr["data"] = zuhubrr;
    let purchaseOrg = dataObj.purchaseOrg;
    let purchaseOrgarr = {};
    purchaseOrgarr["index"] = 2001;
    purchaseOrgarr["type"] = "purchasing_organization";
    let purchaseOrgbrr = {};
    purchaseOrgbrr["format"] = "string";
    purchaseOrgbrr["value"] = purchaseOrg;
    purchaseOrgarr["data"] = purchaseOrgbrr;
    let code = dataObj.code;
    let codearr = {};
    codearr["index"] = 2002;
    codearr["type"] = "batch_no";
    let codebrr = {};
    codebrr["format"] = "string";
    codebrr["value"] = code;
    codearr["data"] = codebrr;
    var i = 0;
    var incount = 0;
    let allbody = [];
    let msgMap = {};
    var entrys = dataObj.purInRecords;
    while (entrys[i] != null) {
      let entry = entrys[i];
      if (entry._status != null && entry._status == "Insert") {
        let thisMap = {};
        let valuebody = [];
        valuebody[0] = zuhuarr;
        valuebody[1] = purchaseOrgarr;
        valuebody[2] = codearr;
        var wlcode = entry.product_cCode;
        var wlname = entry.product_cName;
        var vouchdate = dataObj.vouchdate;
        let wlcodearr = {};
        wlcodearr["index"] = 2003;
        wlcodearr["type"] = "item_code";
        let wlcodebrr = {};
        wlcodebrr["format"] = "string";
        wlcodebrr["value"] = wlcode;
        wlcodearr["data"] = wlcodebrr;
        valuebody[3] = wlcodearr;
        let wlnamearr = {};
        wlnamearr["index"] = 2004;
        wlnamearr["type"] = "item_name";
        let wlnamebrr = {};
        wlnamebrr["format"] = "string";
        wlnamebrr["value"] = wlname;
        wlnamearr["data"] = wlnamebrr;
        valuebody[4] = wlnamearr;
        let vouchdatearr = {};
        vouchdatearr["index"] = 2005;
        vouchdatearr["type"] = "warehousing_time";
        let vouchdatebrr = {};
        vouchdatebrr["format"] = "string";
        vouchdatebrr["value"] = vouchdate;
        vouchdatearr["data"] = vouchdatebrr;
        valuebody[5] = vouchdatearr;
        let handle = zuhu + purchaseOrg + code + wlcode + vouchdate;
        msgMap["extendidentification"] = "handle";
        thisMap["handle"] = "88.263.1/" + handle;
        thisMap["templateVersion"] = "供应链库存入库记录标识模板";
        thisMap["value"] = valuebody;
        allbody[incount] = thisMap;
        incount++;
      }
      i++;
    }
    let doThisCheck = {};
    let errMsg = "";
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
        var entrys = responseObj.data;
        var j = 0;
        while (entrys[j] != null) {
          let entry = entrys[j];
          let msg = entry.msg;
          if (msg == "标识已存在") {
            flag = true;
          } else if (msg == "success") {
            flag = true;
          } else {
            flag = false;
          }
          j++;
        }
      } else {
        flag = false;
        throw new Error("flag=false" + responseObj);
      }
      msgList["flag"] = flag;
    }
    return {
      msgList
    };
  }
}
exports({ entryPoint: MyAPIHandler });