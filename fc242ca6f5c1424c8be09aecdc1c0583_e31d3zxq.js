viewModel.on("customInit", function (data) {
  viewModel.get("button40dg").on("click", function () {
    debugger;
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要生单的数据", "error");
      return false;
    }
    let masterId = [];
    let orgIds = [];
    let orgNames = [];
    for (let i = 0; i < data.length; i++) {
      let index = masterId.indexOf(data[i].id);
      let index1 = orgIds.indexOf(data[i].org_id);
      if (index == -1) {
        masterId.push(data[i].id);
      }
      if (index1 == -1) {
        orgIds.push(data[i].org_id);
        orgNames.push(data[i].org_id_name);
      }
    }
    if (orgIds.length > 1) {
      cb.utils.alert("请选择同一组织的单据", "error");
      return false;
    }
    let promises = [];
    let dataInfo = [];
    promises.push(
      getMaster(masterId, orgIds, orgNames).then((res) => {
        dataInfo = res;
      })
    );
    let returnPromise = new cb.promise();
    Promise.all(promises).then((res) => {
      if (dataInfo.length > 0) {
        console.log(dataInfo);
        cb.loader.runCommandLine(
          "bill",
          {
            billtype: "Voucher",
            billno: "c2d5f5ea",
            params: {
              mode: "add",
              dataInfo: dataInfo
            }
          },
          viewModel
        );
        //手动刷新页面
        viewModel.execute("refresh");
        //手动返回上个页面
        //核心代码
      }
    });
    return returnPromise;
  });
  viewModel.get("button32sd").on("click", function () {
    //手动刷新页面
    viewModel.execute("refresh");
    //手动返回上个页面
    //核心代码
    viewModel.communication({ type: "return" });
  });
  function getMaster(masterId, orgIds, orgNames) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.addUseless",
        {
          masterId: masterId,
          orgIds: orgIds,
          orgNames: orgNames
        },
        function (err, res) {
          if (typeof res != "undefined") {
            let data = res.data;
            resolve(data);
            console.log(data);
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