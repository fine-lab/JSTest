let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configParamsFun = extrequire("GT37522AT1.pubFunction.configParamsFun");
    let configParams = configParamsFun.execute({ envUrl: request.envUrl, appcode: "FA" }).configParams;
    let authUrl = "https://www.example.com/" + configParams.apiurl.fixedasset + "?accountID=" + configParams.tenantId + "&ncucode=" + configParams.code;
    let billCodes = request.billCodes;
    let codeToSN = JSON.parse(request.codeToSN);
    let codeInSqlCond = "('" + billCodes.join("','") + "')";
    var yonsql =
      "select 'Update' _status,isWfControlled,code,usedepredept,status,createassetdate,moredepartment,specification,accentity,addway,id,amount,begintime,usagestate,name,category,(select lifemonth,id,extractedperiod,scrapvaluerate,netvalue,exchangerate,depreciationmethod,currency,fcoriginalvalue,depreciation,exchangeRateType,impairment,'Unchanged' _status  from bodies),(select *,'Unchanged' _status from departments),(select * from fixedDefines) from fa.fixedasset.FixedAssetsInfo  where  code in " +
      codeInSqlCond;
    var res = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
    let data = [];
    let errorMap = [];
    let errorNum = 0;
    let successNum = 0;
    if (res && res.length > 0) {
      res.map((item) => {
        let tempCode = item.code;
        if (codeToSN[tempCode].sn && codeToSN[tempCode].assetcode) {
          if (item.fixedDefines) {
            item.fixedDefines.define1 = codeToSN[tempCode].sn;
            item.fixedDefines.define2 = codeToSN[tempCode].equipcode || "";
            item.fixedDefines.define3 = codeToSN[tempCode].assetcode || "";
            item.fixedDefines.define4 = codeToSN[tempCode].requiremcode || "";
            item.fixedDefines._status = "Update";
          } else {
            item.fixedDefines = {
              define1: codeToSN[tempCode].sn,
              define2: codeToSN[tempCode].equipcode,
              define3: codeToSN[tempCode].assetcode,
              define4: codeToSN[tempCode].requiremcode,
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
        item._status = "Update";
        if (item.status != "0") {
          errorNum++;
          errorMap.push(item.code + ",卡片已提审或已审核，不允许修改。");
        } else {
          data.push(item);
          let itemData = [];
          itemData.push(item);
          let apiResponse = openLinker("POST", authUrl, "FA", JSON.stringify({ data: itemData }));
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
        return { codeToSN };
      }
    } else {
      throw new Error("未找到对应资产卡片数据");
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });