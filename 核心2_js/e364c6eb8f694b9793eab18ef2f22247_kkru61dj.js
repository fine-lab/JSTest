viewModel.on("beforeBatchdelete", function (params) {
  var check = true;
  var selected = JSON.parse(params.data.data);
  selected.forEach((row) => {
    let orgId = row.org_id;
    let supplierCode = row.supplierName;
    let promiseArr = [];
    let sqwtsChildRes = [];
    promiseArr.push(
      getPerInfo(orgId, supplierCode).then((res) => {
        sqwtsChildRes = res;
      })
    );
    let returnPromise = new cb.promise();
    Promise.all(promiseArr).then((res) => {
      let mId = row.id;
      let exist = false;
      if (sqwtsChildRes.length > 0) {
        for (let i = 0; i < sqwtsChildRes.length; i++) {
          if (sqwtsChildRes[i].authorizerCode == mId) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        cb.utils.alert("单据编码为：" + row.code + "的证照已被预审单引用，无法删除", "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
});
function getPerInfo(orgId, supplierCode) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction(
      "ISY_2.public.getperInfo",
      {
        orgId: orgId,
        supplierCode: supplierCode,
        type: "授权委托书范围"
      },
      function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined" && res != null) {
          let sqwtsChildRes = res.object.sqwtsChildRes;
          resolve(sqwtsChildRes);
        } else if (err != null) {
          reject();
        }
      }
    );
  });
}
viewModel.on("customInit", function (data) {
  // 人员证照--页面初始化
});