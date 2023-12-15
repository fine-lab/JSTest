viewModel.on("beforeBatchaudit", function (args) {
  debugger;
  let promiseArr = [];
  let returnMsg = {};
  let jsdata = args.data.data;
  let customerLicenseRes = [];
  let UserId = cb.context.getUserId(); // 用户id
  let TenantId = cb.context.getTenantId();
  const datajs = JSON.parse(jsdata);
  promiseArr.push(
    GMPSaveByList(datajs[0].id, UserId, TenantId).then(
      (res) => {
        customerLicenseRes = res;
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
    }
    promise.resolve();
  });
  return promise;
});
viewModel.on("customInit", function (data) {
  // 客户申请单列表--页面初始化
});
function GMPSaveByList(apply_id, UserId, TenantId) {
  return new Promise((resolve, reject) => {
    cb.rest.invokeFunction(
      "ISY_2.public.applyToGMPByList",
      {
        apply_id: apply_id,
        UserId: UserId,
        TenantId: TenantId
      },
      function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let result_tf = res.result_tf;
          if (result_tf) {
            resolve(result_tf);
          } else {
            reject(res.message);
          }
        } else if (typeof err != "undefined") {
          reject(err);
        }
      }
    );
  });
}