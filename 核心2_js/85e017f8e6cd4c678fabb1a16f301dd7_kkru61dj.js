viewModel.on("beforeBatchdelete", function (params) {
  let selected = JSON.parse(params.data.data);
  selected.forEach((row) => {
    let promiseArr = [];
    let releItemsRes = [];
    promiseArr.push(
      getRelePlanItems().then((res) => {
        releItemsRes = res;
      })
    );
    let returnPromise = new cb.promise();
    Promise.all(promiseArr).then((res) => {
      let mId = row.id;
      let exist = false;
      if (releItemsRes.length > 0) {
        for (let i = 0; i < releItemsRes.length; i++) {
          if (releItemsRes[i].releaseCode == mId) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        cb.utils.alert("单据编码为：" + row.code + "的放行项目已被放行方案表引用，无法删除", "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
});
function getRelePlanItems() {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("ISY_2.public.getRelePlanItems", {}, function (err, res) {
      console.log(res);
      console.log(err);
      if (typeof res != "undefined" && res != null) {
        let releItemsRes = res.releItemsRes;
        resolve(releItemsRes);
      } else if (err != null) {
        reject();
      }
    });
  });
}
viewModel.on("customInit", function (data) {
  // 放行行项目--页面初始化
});