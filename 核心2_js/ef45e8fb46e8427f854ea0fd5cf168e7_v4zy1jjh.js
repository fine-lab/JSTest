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
    let orgid = param.data[0].orgId;
    let orgidarr = {};
    orgidarr["index"] = 2001;
    orgidarr["type"] = "factory";
    let orgidbrr = {};
    orgidbrr["format"] = "string";
    orgidbrr["value"] = orgid;
    orgidarr["data"] = orgidbrr;
    let code = param.data[0].code;
    var i = 0;
    var incount = 0;
    let allbody = [];
    if (param.data[0].finishedReportDetail != null) {
      var entrys = param.data[0].finishedReportDetail;
      while (entrys[i] != null) {
        let entry = entrys[i];
        if (entry._status != null && entry._status == "Insert") {
          let thisMap = {};
          thisMap["templateVersion"] = "制造云生产记录标识模板";
          let valuebody = [];
          valuebody[0] = zuhuidarr;
          valuebody[1] = orgidarr;
          //批次号
          let batch = entry.batchNo;
          let batcharr = {};
          batcharr["index"] = 2002;
          batcharr["type"] = "batch_no";
          let batchbrr = {};
          batchbrr["format"] = "string";
          if (batch == null || batch == "") {
            batch = code;
          }
          batchbrr["value"] = batch;
          batcharr["data"] = batchbrr;
          valuebody[2] = batcharr;
          //物编码
          let materialCode = entry.materialCode;
          let materialCodearr = {};
          materialCodearr["index"] = 2003;
          materialCodearr["type"] = "item_code";
          let materialCodebrr = {};
          materialCodebrr["format"] = "string";
          materialCodebrr["value"] = materialCode;
          materialCodearr["data"] = materialCodebrr;
          valuebody[3] = materialCodearr;
          //物料名称
          let materialName = entry.materialName;
          let materialNamearr = {};
          materialNamearr["index"] = 2004;
          materialNamearr["type"] = "item_name";
          let materialNamebrr = {};
          materialNamebrr["format"] = "string";
          materialNamebrr["value"] = materialName;
          materialNamearr["data"] = materialNamebrr;
          valuebody[4] = materialNamearr;
          //真实的完工时间
          let finishDate = entry.finishDate;
          let finishDatearr = {};
          finishDatearr["index"] = 2005;
          finishDatearr["type"] = "completion_time";
          let finishDatebrr = {};
          finishDatebrr["format"] = "string";
          finishDatebrr["value"] = finishDate;
          finishDatearr["data"] = finishDatebrr;
          valuebody[5] = finishDatearr;
          let biaoshi = code + "-" + materialCode;
          thisMap["handle"] = "88.263.1/" + biaoshi;
          thisMap["value"] = valuebody;
          allbody[incount] = thisMap;
          incount++;
        }
        i++;
      }
      let doThisCheck = {};
      let flge = true;
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
        throw new Error(flge);
      }
    }
    return { param };
  }
}
exports({ entryPoint: MyTrigger });