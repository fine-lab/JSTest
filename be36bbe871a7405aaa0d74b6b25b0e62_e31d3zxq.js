viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function (data) {
    //去掉取消，确定按钮
    document.getElementById("gspSelectOrgPop|btnModalConfirm").addEventListener("click", function () {
      let selectedRows = gridModel.getSelectedRows();
      if (selectedRows.length > 1) {
        cb.utils.alert("只能选择一行数据", "error");
        return;
      }
      if (selectedRows.length == 0) {
        cb.utils.alert("至少选择一条数据", "error");
        return;
      }
      let row = selectedRows[0];
      let orgId = row["item7qg"];
      let orgName = row["item9ri"];
      let type = viewModel.getParams().distributionType;
      //这里type只能为：material，customer，supplier
      let objId = viewModel.getParams()[type];
      let relationId = viewModel.getParams().relationId;
      allocateRecord(type, orgId, objId, relationId).then(
        (res) => {
          let typeDictionary = {
            material: "f6fd06e0",
            customer: "2e4cb1d5",
            supplier: "6f8efa8a"
          };
          let billData = {
            billtype: "Voucher",
            billno: typeDictionary[type],
            params: {
              mode: "add",
              relationId: viewModel.getParams().relationId,
              orgId: orgId,
              orgName: orgName,
              licInfo: res
            }
          };
          cb.loader.runCommandLine("bill", billData, viewModel);
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      );
    });
  });
  gridModel.on("afterSetDataSource", function (data) {
    gridModel.deleteAllRows();
    let codeName = viewModel.getCache("FilterViewModel").get("ziduan1").getFromModel().getValue();
    getOrgs(codeName).then(
      (res) => {
        let rows = [];
        for (let i = 0; i < res.length; i++) {
          rows.push({
            ziduan1: res[i].name,
            item7qg: res[i].id,
            item13qj: res[i].code,
            item9ri: res[i].name
          });
        }
        gridModel.insertRows(0, rows);
      },
      (err) => {
        cb.utils.alert(err, "error");
      }
    );
  });
  let getOrgs = function (codeName) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getOrgs", { codeName: codeName }, function (err, res) {
        if (res != undefined) {
          resolve(res.orgInfos);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  viewModel.get("button6wi").on("click", function (data) {
    let orgId = gridModel.getRows()[data.index]["item7qg"];
    let orgName = gridModel.getRows()[data.index]["item9ri"];
    let type = viewModel.getParams().distributionType;
    //这里type只能为：material，customer，supplier
    let objId = viewModel.getParams()[type];
    let relationId = viewModel.getParams().relationId;
    allocateRecord(type, orgId, objId, relationId).then(
      (res) => {
        let typeDictionary = {
          material: "f6fd06e0",
          customer: "2e4cb1d5",
          supplier: "6f8efa8a"
        };
        let billData = {
          billtype: "Voucher",
          billno: typeDictionary[type],
          params: {
            mode: "add",
            relationId: viewModel.getParams().relationId,
            orgId: orgId,
            orgName: orgName,
            licInfo: res
          }
        };
        cb.loader.runCommandLine("bill", billData, viewModel);
      },
      (err) => {
        cb.utils.alert(err, "error");
      }
    );
  });
  let allocateRecord = function (type, orgId, objId, relationId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.sygl.allocateRecord", { type: type, orgId: orgId, objId: objId, relationId: relationId }, function (err, res) {
        if (res != undefined) {
          if (res.errCode != "200") {
            reject(res.msg);
          } else {
            resolve(res.licInfo);
          }
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
});