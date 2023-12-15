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
      "select 'Update' _status,isWfControlled,code,usedepredept,status,createassetdate,moredepartment,specification,accentity,addway,id,amount,begintime,usagestate,name,category,(select lifemonth,id,extractedperiod,scrapvaluerate,netvalue,exchangerate,depreciationmethod,currency,fcoriginalvalue,depreciation,exchangeRateType,impairment,'Unchanged' _status  from bodies),(select *,'Unchanged' _status from departments),fixedAssetsInfoCharacter from fa.fixedasset.FixedAssetsInfo  where  code in " +
      codeInSqlCond;
    var res = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
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
          if (item.fixedAssetsInfoCharacter) {
            item.fixedAssetsInfoCharacter.attrext3 = codeToSN[tempCode].sn;
            item.fixedAssetsInfoCharacter.attrext4 = codeToSN[tempCode].equipcode || "";
            item.fixedAssetsInfoCharacter.attrext5 = codeToSN[tempCode].assetcode || "";
            item.fixedAssetsInfoCharacter.attrext6 = codeToSN[tempCode].requiremcode || "";
            item.fixedAssetsInfoCharacter.attrext8 = codeToSN[tempCode].contractnumber || "";
            item.fixedAssetsInfoCharacter.attrext9 = codeToSN[tempCode].showTime || "";
            item.fixedAssetsInfoCharacter._status = "Update";
          } else {
            item.fixedAssetsInfoCharacter = {
              // 特征升级
              attrext3: codeToSN[tempCode].sn,
              attrext4: codeToSN[tempCode].equipcode,
              attrext5: codeToSN[tempCode].assetcode,
              attrext6: codeToSN[tempCode].requiremcode,
              attrext8: codeToSN[tempCode].contractnumber,
              attrext9: codeToSN[tempCode].showTime,
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
        if (item.status != "0") {
          errorNum++;
          errorMap.push(item.code + ",卡片已提审或已审核，不允许修改。");
        } else {
          let itemData = [];
          itemData.push(item);
          data.push(item);
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
        return { codeToSN, questData: JSON.stringify({ data: data }) };
      }
    } else {
      throw new Error("未找到对应资产卡片数据");
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });