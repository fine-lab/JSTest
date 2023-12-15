viewModel.on("customInit", function (data) {
  //组织过滤
  //客户过滤
  //有效期至值改变后
  function selectParamOrg() {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("ISY_2.public.getParamInfo", {}, function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let paramRres = res.paramRes;
          resolve(paramRres);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  }
  viewModel.on("beforeSave", function (args) {
    var currentState = viewModel.getParams().mode; //获取单据状态
    let customer = viewModel.get("customerCode").getValue();
    let promises = [];
    let customerErr = {};
    var promisesReturn = new cb.promise();
    if (currentState == "add") {
      promises.push(
        selectCustomerFile(customer).then((res, err) => {
          customerErr = err;
        })
      );
    }
    Promise.all(promises).then(() => {
      let state = true;
      if (customerErr != null && typeof customerErr == "{}") {
        if (customerErr.message.length > 0) {
          promisesReturn.reject();
        } else {
          promisesReturn.resolve();
        }
      } else {
        promisesReturn.resolve();
      }
    });
    return promisesReturn;
  });
  function selectCustomerFile(customer) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction(
        "ISY_2.backOpenApiFunction.selectCustomFile",
        {
          customer: customer
        },
        function (err, res) {
          debugger;
          if (typeof res != "undefined") {
            console.log(res);
            resolve(res);
          } else if (typeof err != "undefined") {
            cb.utils.alert(err.message, "error");
            console.log(err);
            reject(err);
            return false;
          }
        }
      );
    });
  }
});
function check_has_change(license_id) {
  return new Promise((resolve, reject) => {
    cb.rest.invokeFunction(
      "ISY_2.public.licHasChange",
      {
        license_id: license_id
      },
      function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let paramRres = res.paramRes;
          if (res.paramRes.length == 0) {
            resolve(paramRres);
          } else {
            reject("该证照存在未处理的变更单");
          }
        } else if (typeof err != "undefined") {
          reject(err);
        }
      }
    );
  });
}
function go_to_change2(license_id) {
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "SY01_customer_license_change", // 单据号
    domainKey: "sy01",
    params: {
      mode: "add", // (卡片页面区分编辑态edit、新增态add、)
      license_id: license_id //TODO:填写详情id
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
}
//添加变更单
function go_to_change(license_id) {
  cb.rest.invokeFunction("ISY_2.public.saveLicChange", { license_id: license_id }, function (err, res) {
    console.log(res);
    console.log(err);
    if (typeof res != "undefined") {
      let data = {
        billtype: "Voucher", // 单据类型
        billno: "SY01_customer_license_change", // 单据号
        domainKey: "sy01",
        params: {
          mode: "add", // (卡片页面区分编辑态edit、新增态add、)
          id: res.paramRes.id //TODO:填写详情id
        }
      };
      cb.loader.runCommandLine("bill", data, viewModel);
    }
  });
}
viewModel.get("button53ij") &&
  viewModel.get("button53ij").on("click", function (event) {
    // 变更--单击
    //判断是否存在未处理的变更单
    var has_license = [];
    let promiseArr = [];
    let returnMsg = {};
    let license_id = viewModel.originalParams.id;
    promiseArr.push(
      check_has_change(license_id).then(
        (res) => {
          has_license = res;
        },
        (err) => {
          returnMsg.returnMsg = err;
        }
      )
    );
    let promise = new cb.promise();
    Promise.all(promiseArr).then((res) => {
      if (returnMsg.returnMsg != "" && returnMsg.returnMsg != undefined) {
        cb.utils.alert(returnMsg.returnMsg, "error");
        promise.reject();
      } else {
        go_to_change2(license_id);
      }
      promise.resolve();
    });
    return promise;
  });