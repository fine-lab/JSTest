const isAfterDate = (dateA, dateB) => dateA > dateB;
viewModel.get("bizhong_name") &&
  viewModel.get("bizhong_name").on("afterValueChange", function (data) {
    // 收款币种--值改变后 根据收款币种取对应币种的汇率
    let bizhong = viewModel.get("bizhong").getValue(); //id
    let targetCurrencyId = "yourIdHere"; //人民币  ---汇率：目的币种
    if (bizhong == null || bizhong == "" || bizhong == targetCurrencyId) {
      viewModel.get("hl").setValue(1);
      return;
    }
    let quotationdate = "";
    let exchangeRate = "";
    cb.rest.invokeFunction("GT3734AT5.APIFunc.getNewExchange", { targetCurrencyId: targetCurrencyId, sourceCurrencyId: bizhong }, function (err, res) {
      if (err == null) {
        let resData = res.data;
        let simpleObj = resData; //JSON.parse(resData);
        if (simpleObj != null && simpleObj.length > 0) {
          let dataList = resData;
          for (var idx in dataList) {
            let oneData = dataList[idx];
            if (oneData.sourcecurrency_id == bizhong && oneData.targetcurrency_id == targetCurrencyId) {
              let tempDataStr = oneData.quotationdate;
              if (quotationdate == "" || isAfterDate(new Date(tempDataStr), new Date(quotationdate))) {
                quotationdate = tempDataStr;
                exchangeRate = oneData.exchangerate;
              }
            }
          }
        }
        viewModel.get("hl").setValue(exchangeRate);
      }
    });
  });