let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let flag = true;
    var zuhu = JSON.parse(AppContext()).currentUser.tenantId;
    let zuhuarr = {};
    zuhuarr["index"] = 2000;
    zuhuarr["type"] = "tenant_id";
    let zuhubrr = {};
    zuhubrr["format"] = "string";
    zuhubrr["value"] = zuhu;
    zuhuarr["data"] = zuhubrr;
    var salesOrg = param.data[0].salesOrg;
    let salesOrgarr = {};
    salesOrgarr["index"] = 2001;
    salesOrgarr["type"] = "sale_organization";
    let salesOrgbrr = {};
    salesOrgbrr["format"] = "string";
    salesOrgbrr["value"] = salesOrg;
    salesOrgarr["data"] = salesOrgbrr;
    var code = param.data[0].code;
    let codearr = {};
    codearr["index"] = 2002;
    codearr["type"] = "bill_no";
    let codebrr = {};
    codebrr["format"] = "string";
    codebrr["value"] = code;
    codearr["data"] = codebrr;
    var i = 0;
    var incount = 0;
    let allbody = [];
    var entrys = param.data[0].details;
    while (entrys[i] != null) {
      let entry = entrys[i];
      if (entry._status != null && entry._status == "Insert") {
        let thisMap = {};
        let valuebody = [];
        valuebody[0] = zuhuarr;
        valuebody[1] = salesOrgarr;
        valuebody[2] = codearr;
        var skucode = entry.productsku_cCode;
        var wlcode = entry.product_cCode;
        var wlname = entry.product_cName;
        var vouchdate = param.data[0].vouchdate;
        let skucodearr = {};
        skucodearr["index"] = 2003;
        skucodearr["type"] = "sku_code";
        let skucodebrr = {};
        skucodebrr["format"] = "string";
        skucodebrr["value"] = skucode;
        skucodearr["data"] = skucodebrr;
        valuebody[3] = skucodearr;
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
        vouchdatearr["type"] = "delivery_time";
        let vouchdatebrr = {};
        vouchdatebrr["format"] = "string";
        vouchdatebrr["value"] = vouchdate;
        vouchdatearr["data"] = vouchdatebrr;
        valuebody[5] = vouchdatearr;
        let handle = "88.263.1/" + code + "-" + wlcode;
        entry.set("extendidentification", handle);
        thisMap["handle"] = handle;
        thisMap["templateVersion"] = "供应链库存出库记录标识模板";
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
      }
      if (!flag) {
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });