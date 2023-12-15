run = function (event) {
  //合格供应商目录台账
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  let objs = [];
  let currentIndex = 1;
  gridModel.on("afterSetDataSource", function (data) {
    if (objs.length > 0) {
      for (let i = 0; i < objs.length; i++) {
        gridModel.appendRow({ code: objs[i].code, name: objs[i].name });
      }
    } else {
      getVendors().then((vendorListRes) => {
        console.log(vendorListRes);
        for (let i = 0; i < vendorListRes.length; i++) {
          //查询出所有明细并放到objs中
          if (
            typeof vendorListRes[i].extend_is_gsp != "undefined" &&
            typeof vendorListRes[i].extend_first_status != "undefined" &&
            typeof vendorListRes[i].extend_purchase_status != "undefined" &&
            (vendorListRes[i].extend_is_gsp == 1 || vendorListRes[i].extend_is_gsp == "1" || vendorListRes[i].extend_is_gsp == "true" || vendorListRes[i].extend_is_gsp == true) &&
            (vendorListRes[i].extend_first_status == 2 || vendorListRes[i].extend_first_status == "2") &&
            (vendorListRes[i].extend_purchase_status == 1 || vendorListRes[i].extend_purchase_status == "1")
          ) {
            objs.push({ code: vendorListRes[i].code, name: vendorListRes[i].name });
          }
        }
        if (objs.length > 0) {
          for (let p = 0; p < objs.length && p < 10; p++) {
            gridModel.appendRow({
              code: objs[p].code,
              name: objs[p].name
            });
          }
          gridModel.appendRow({
            code: currentIndex,
            name: "第" + currentIndex + "页"
          });
        }
      });
    }
  });
  getVendors = function () {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.reportData.getVendors", {}, function (err, res) {
        debugger;
        if (typeof res !== "undefined") {
          let vendorListRes = res.vendorListRes;
          resolve(vendorListRes);
        } else if (err !== null) {
          alert(err.message);
        }
        resolve();
      });
    });
  };
  initPage = function (gridModel, objs, index) {
    let length = objs.length;
    if (index - 1 > length / 10) {
      cb.utils.alert("最多" + parseInt(length / 10 + 1) + "页!", "error"); //UI#cShowCaption
      return;
    }
    if (index < 1) {
      cb.utils.alert("已经是第一页", "error");
      return;
    }
    gridModel.deleteAllRows();
    for (let i = (index - 1) * 10; i < index * 10; i++) {
      if (i < objs.length) {
        gridModel.appendRow({ code: objs[i].code, name: objs[i].name });
      }
    }
  };
  let prev = viewModel.get("button5ce");
  prev.on("click", function () {
    initPage(gridModel, objs, (currentIndex = currentIndex - 1));
    gridModel.appendRow({
      code: currentIndex,
      name: "第" + currentIndex + "页"
    });
  });
  //下一页
  let next = viewModel.get("button11kc");
  next.on("click", function () {
    initPage(gridModel, objs, (currentIndex = currentIndex + 1));
    gridModel.appendRow({
      code: currentIndex,
      name: "第" + currentIndex + "页"
    });
  });
  gridModel.on("pageInfoChange", function () {
    return false;
  });
};