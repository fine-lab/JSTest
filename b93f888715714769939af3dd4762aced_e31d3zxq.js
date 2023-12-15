viewModel.on("customInit", function (data) {
  var parentObj = viewModel.getParams().obj;
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", function (data) {
    gridModel.deleteAllRows();
    getProductSku(parentObj.product, parentObj.org_id).then((productSku) => {
      getBatchNos(productSku).then((batchNos) => {
        for (let i = 0; i < batchNos.length; i++) {
          gridModel.appendRow({ new6: batchNos[i].id, new7: batchNos[i].batchno });
        }
      });
    });
  });
  //取消按钮
  viewModel.get("button0wd").on("click", function () {
    viewModel.communication({ type: "return" });
  });
  //确定按钮
  viewModel.get("button1pi").on("click", function () {
    let parentViewModel = viewModel.getCache("parentViewModel"); //获取到父model
    let selectData = gridModel.getSelectedRows();
    if (selectData.length > 1) {
      cb.util.alert("不要选择两条数据!");
    } else {
      parentViewModel.getGridModel().setCellValue(parentObj.index, parentObj.batchIdFieldName, selectData[0]["new6"]);
      parentViewModel.getGridModel().setCellValue(parentObj.index, parentObj.batchNoFieldName, selectData[0]["new7"]);
      viewModel.communication({ type: "return" });
    }
  });
  getBatchNos = function (productsku) {
    return new Promise(function (resolve) {
      let materialRequest = {};
      let materialParam = {};
      materialParam.type = "POST";
      materialParam.url = "https://www.example.com/";
      materialParam.domainID = "yourIDHere";
      materialRequest.json = {
        pageIndex: "1",
        pageSize: "100",
        productsku: [productsku]
      };
      materialRequest.params = materialParam;
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.openLink", materialRequest, function (err, res) {
        if (typeof res !== "undefined") {
          batchNos = JSON.parse(res.apiResponse).data.recordList;
          resolve(batchNos);
        } else if (err !== null) {
          alert(err.message);
        }
      });
    });
  };
  getProductSku = function (product, orgId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getProductDetail",
        {
          materialId: product,
          orgId: orgId
        },
        function (err, res) {
          if (typeof res !== "undefined") {
            resolve(res.merchantInfo.defaultSKUId);
          } else if (err !== null) {
            alert(err.message);
          }
        }
      );
    });
  };
});