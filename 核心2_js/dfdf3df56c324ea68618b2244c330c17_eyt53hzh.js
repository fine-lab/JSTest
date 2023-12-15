run = function (event) {
  var viewModel = this;
  viewModel.on("afterMount", function () {
    viewModel.get("pass_ec").setState("type", "password");
    var x = viewModel.get("name");
    x.on("afterValueChange", function (data) {
      debugger;
      let tableUri = "GT22176AT10.GT22176AT10.SY01_secondaccepter";
      let fieldName = "name";
      let typenameValue = x.getValue();
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.fieldUniqueCheck", { tableUri: tableUri, fieldName: fieldName, fieldValue: typenameValue }, function (err, res) {
        console.log(res);
        switch (res.errCode) {
          case "200":
            break;
          case "1001":
            cb.utils.alert(res.msg);
            break;
          default:
        }
      });
    });
  });
  viewModel.on("afterLoadData", function () {
    let currentState = viewModel.getParams().mode;
    if (
      currentState == "browse" &&
      document.getElementById("a5defb78|pass_ec").getElementsByClassName("text-wrapper") != undefined &&
      document.getElementById("a5defb78|pass_ec").getElementsByClassName("text-wrapper").length > 0
    ) {
      document.getElementById("a5defb78|pass_ec").getElementsByClassName("text-wrapper")[0].children[0].innerHTML = "●●●●●●";
    }
  });
  viewModel.on("modeChange", function (data) {
    if (data == "browse") {
      if (
        document.getElementById("a5defb78|pass_ec").getElementsByClassName("text-wrapper") != undefined &&
        document.getElementById("a5defb78|pass_ec").getElementsByClassName("text-wrapper").length > 0
      ) {
        document.getElementById("a5defb78|pass_ec").getElementsByClassName("text-wrapper")[0].children[0].innerHTML = "●●●●●●";
      }
    }
  });
  viewModel.get("btnSave").on("click", function () {
    let specialsalecontrol = viewModel.get("specialsalecontrol");
    //创建获取服务端数据proxy对象
    const proxy = viewModel.setProxy({
      queryData: {
        url: "rest/uploadAli",
        method: "POST"
      }
    });
    const param = {};
    param.otherCompanyName = "科兴（大连）疫苗技术有限公司";
    //单据编码
    param.billCode = "QTCK00002";
    //单据事件
    param.billTime = "2021-12-15 00:00:00";
    param.billType = "237";
    //操作人
    param.operIcName = "张士航";
    //追溯码，多个用逗号隔开 ,
    param.traceCodes = "81895630014915497152";
    proxy.queryData(param, function (error, result) {
      console.log(error);
      console.log(result);
      if (error.msg != null) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
  viewModel.on("beforeDelete", function (params) {
    let id = viewModel.get("id").getValue();
    let type = "二次验收人";
    var promise = new cb.promise();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.isQuote",
      {
        id: id,
        type: type
      },
      function (err, res) {
        if (typeof res != "undefined") {
          let error_info = res.error_info;
          if (typeof error_info != "undefined" && JSON.stringify(error_info) != "{}") {
            cb.utils.alert(error_info.errInfo);
            promise.reject();
            return false;
          } else {
            promise.resolve();
          }
        }
      }
    );
    return promise;
  });
};