viewModel.on("customInit", function (data) {
  // 余额查询1详情--页面初始化
  viewModel.on("afterMount", function (args) {
    viewModel.get("button21zg").execute("click");
  });
  viewModel.get("button21zg") &&
    viewModel.get("button21zg").on("click", function (data) {
      let CustomerCode = viewModel.getParams().query.agentCode;
      debugger;
      // 获取token的后端API
      cb.rest.invokeFunction("086967a3c53f4d90b1d18343939bd0dd", function (err, res) {
        if (err) {
          cb.utils.alert(err, "error");
        } else {
          if (res.responseObjSet) {
            debugger;
            token = res.responseObjSet.Data;
            let dataSet = {
              data1: token,
              data2: CustomerCode
            };
            // 调用U9C接口
            cb.rest.invokeFunction("efe428e61f6648c7b4debcc223fd58de", { data: dataSet }, function (err, res) {
              if (err) {
                cb.utils.alert(err, "error");
              } else {
                if (res.responseObj1) {
                  let arr = res.responseObj1;
                  arr.forEach((e) => {
                    if (e.bIPResult) {
                      debugger;
                      SPeriodRcdAmount = +e.bIPResult.SPeriodRcdAmount;
                      SPeriodBond = +e.bIPResult.SPeriodBond;
                      RcdAmount = +e.bIPResult.RcdAmount;
                      SalesAmount = +e.bIPResult.SalesAmount;
                      Bond = +e.bIPResult.Bond;
                      TemporaryLine = +e.bIPResult.TemporaryLine;
                      LockRcdAmount = +e.bIPResult.LockRcdAmount;
                      // 可提货金额
                      CanTakeAmount = +e.bIPResult.CanTakeAmount;
                    }
                  });
                  // 期初到款余额
                  viewModel.get("SPeriodRcdAmount").setValue(SPeriodRcdAmount);
                  viewModel.get("SPeriodBond").setValue(SPeriodBond);
                  viewModel.get("RcdAmount").setValue(RcdAmount);
                  viewModel.get("SalesAmount").setValue(SalesAmount);
                  viewModel.get("Bond").setValue(Bond);
                  viewModel.get("TemporaryLine").setValue(TemporaryLine);
                  viewModel.get("LockRcdAmount").setValue(LockRcdAmount);
                  //  可提货金额
                  viewModel.get("CanTakeAmount").setValue(CanTakeAmount);
                  cb.utils.alert(err, "success");
                } else {
                  cb.utils.alert(err, "error");
                }
              }
            });
            cb.utils.alert(err, "success");
          } else {
            cb.utils.alert(err, "error");
          }
        }
      });
      let dataSet0 = {
        data2: CustomerCode
      };
      debugger;
      cb.rest.invokeFunction(
        // 通过yonsql获取merchantId
        "ea94affcd5104136b85729f01147f654",
        { data: dataSet0 },
        function (err, res) {
          if (res) {
            let merchantId = res.resultSales[0].id;
            let dataSet1 = {
              merchantId: merchantId
            };
            debugger;
            // 期初返利余额
            cb.rest.invokeFunction("0ab3eaae52a14ce1979a3a050d4eb6a0", { data: dataSet1 }, function (err, res) {
              if (err) {
                cb.utils.alert(err, "error");
              } else {
                if (res) {
                  debugger;
                  let SPeriodRBBalance = +res.resultSales[0].rebateMoney;
                  let code = res.resultSales[0].code;
                  // 期初返利余额
                  viewModel.get("SPeriodRBBalance").setValue(SPeriodRBBalance);
                  let dataSet2 = {
                    merchantId: merchantId,
                    code: code
                  };
                  debugger;
                  // 返利余额
                  cb.rest.invokeFunction("cf06f063729d4a62934afce9a4145a0e", { data: dataSet2 }, function (err, res) {
                    if (err) {
                      cb.utils.alert(err, "error");
                    } else {
                      if (res) {
                        debugger;
                        let RBBalance = +res.resultSales[0].rebateMoney;
                        // 返利余额
                        viewModel.get("RBBalance").setValue(RBBalance);
                        cb.utils.alert(err, "success");
                      } else {
                        cb.utils.alert(err, "error");
                      }
                    }
                  });
                  cb.utils.alert(err, "success");
                } else {
                  cb.utils.alert(err, "error");
                }
              }
            });
            cb.utils.alert(err, "success");
          } else {
            cb.utils.alert(err, "error");
          }
        }
      );
    });
});