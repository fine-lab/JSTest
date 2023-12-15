viewModel.on("customInit", function (data) {
  // 报损申请单拉不合格登记单生单页面--页面初始化
  viewModel.get("button40dg").on("click", function () {
    debugger;
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要生单的数据");
      return false;
    }
    let masterId = [];
    for (let i = 0; i < data.length; i++) {
      let index = masterId.indexOf(data[i].id);
      if (index == -1) {
        masterId.push(data[i].id);
      }
    }
    let promises = [];
    let sccessInfo = [];
    promises.push(
      getMaster(masterId).then((res) => {
        sccessInfo = res;
      })
    );
    let returnPromise = new cb.promise();
    Promise.all(promises).then((res) => {
      if (sccessInfo.sccess != "200") {
        cb.utils.alert("生单失败");
      } else {
        //手动返回上个页面
        //核心代码
        viewModel.communication({ type: "return" });
      }
    });
    return returnPromise;
  });
  function getMaster(masterId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.addUseless",
        {
          masterId: masterId
        },
        function (err, res) {
          if (typeof res != "undefined") {
            let sccessInfo = res.sccessInfo;
            resolve(sccessInfo);
            console.log(sccessInfo);
            console.log("1111111111111");
          } else if (typeof err != "undefined") {
            cb.utils.alert(err);
            return false;
          }
          resolve();
        }
      );
    });
  }
});