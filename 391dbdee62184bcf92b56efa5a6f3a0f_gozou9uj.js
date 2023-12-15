let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configParamsFun = extrequire("EFA.backDefaultGroup.configParamsFun");
    let configParams = configParamsFun.execute({ envUrl: request.envUrl, appcode: "EFA" }).configParams;
    let authUrl = configParams.envUrl + "/iuap-api-gateway" + configParams.apiurl.fixedasset + "?accountID=" + configParams.tenantId + "&ncucode=" + configParams.code;
    let billCodes = request.billCodes;
    let codeToSN = JSON.parse(request.codeToSN);
    let codeInSqlCond = "('" + billCodes.join("','") + "')";
    var yonsql =
      "select 'Update' _status,*,(select *,'Unchanged' _status  from bodies),(select *,'Unchanged' _status from departments),freeChId from fa.faaddition.AdditionBill  where  code in " + codeInSqlCond;
    var res = ObjectStore.queryByYonQL(yonsql, "yonbip-fi-efa");
    let data = [];
    let errorMap = [];
    let errorNum = 0;
    let successNum = 0;
    var reg = new RegExp("^[0-9]+$");
    if (res && res.length > 0) {
      res.map((item) => {
        let tempCode = item.code;
        if (codeToSN[tempCode].sn && codeToSN[tempCode].assetcode) {
          if (codeToSN[tempCode].showTime) {
            if (reg.test(codeToSN[tempCode].showTime)) {
              let datePar = new Date((parseInt(codeToSN[tempCode].showTime) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
              codeToSN[tempCode].showTime = datePar.getFullYear() + "-" + prefixInteger(datePar.getMonth() + 1, 2) + "-" + prefixInteger(datePar.getDate(), 2);
            } else if (codeToSN[tempCode].showTime.length == 8 && codeToSN[tempCode].showTime.indexOf("-") == -1) {
              let showTimeDate = codeToSN[tempCode].showTime.substring(0, 4) + "-" + codeToSN[tempCode].showTime.substring(4, 6) + "-" + codeToSN[tempCode].showTime.substring(6, 8);
              codeToSN[tempCode].showTime = showTimeDate;
            }
          }
          if (item.freeChId) {
            item.freeChId.attrext5 = codeToSN[tempCode].sn;
            item.freeChId.attrext10 = codeToSN[tempCode].equipcode || "";
            item.freeChId.attrext9 = codeToSN[tempCode].assetcode || "";
            item.freeChId.attrext4 = codeToSN[tempCode].requiremcode || "";
            item.freeChId.attrext6 = codeToSN[tempCode].contractnumber || "";
            item.freeChId.attrext7 = codeToSN[tempCode].showTime || "";
            item.freeChId._status = "Update";
          } else {
            // 特征升级
            item.freeChId = {
              attrext5: codeToSN[tempCode].sn,
              attrext10: codeToSN[tempCode].equipcode,
              attrext9: codeToSN[tempCode].assetcode,
              attrext4: codeToSN[tempCode].requiremcode,
              attrext6: codeToSN[tempCode].contractnumber,
              attrext7: codeToSN[tempCode].showTime,
              _status: "Insert"
            };
          }
        }
        if (codeToSN[tempCode].location) {
          item.location = UrlDecode(UrlDecode(codeToSN[tempCode].location || ""));
        }
        if (codeToSN[tempCode].specification) {
          item.specification = codeToSN[tempCode].specification || "";
        }
        if (codeToSN[tempCode].begintime) {
          if (reg.test(codeToSN[tempCode].begintime)) {
            let datePar = new Date((parseInt(codeToSN[tempCode].begintime) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
            item.begintime = datePar.getFullYear() + "-" + prefixInteger(datePar.getMonth() + 1, 2) + "-" + prefixInteger(datePar.getDate(), 2);
          } else {
            item.begintime = codeToSN[tempCode].begintime || "";
          }
        }
        item._status = "Update";
        if (item.verifyState != "0") {
          errorNum++;
          errorMap.push(item.code + ",卡片已提审或已审核，不允许修改。");
        } else {
          let itemData = [];
          itemData.push(item);
          data.push(item);
          let apiResponse = openLinker("POST", authUrl, "EFA", JSON.stringify({ data: itemData }));
          apiResponse = JSON.parse(apiResponse);
          if (apiResponse.code != "200") {
            errorNum++;
            errorMap.push(item.code + "," + apiResponse.message);
          } else {
            successNum++;
          }
        }
      });
      if (!errorMap || errorMap.length > 0) {
        let message = " 原因：" + join(errorMap, "\n");
        throw new Error(message);
      } else {
        return { codeToSN, questData: JSON.stringify({ data: data }) };
      }
    } else {
      throw new Error("未找到对应资产卡片数据");
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });