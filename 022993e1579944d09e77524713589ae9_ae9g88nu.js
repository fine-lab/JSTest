run = function (event) {
  //合格供应商目录台账
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  let vendorArrays = [];
  let objs = [];
  let promises = [];
  let currentIndex = 1;
  gridModel.on("afterSetDataSource", function (data) {
    if (objs.length > 0) {
      for (let i = 0; i < objs.length; i++) {
        gridModel.appendRow({ code: objs[i].code, name: objs[i].name });
      }
    } else {
      getVendors().then(() => {
        for (let i = 0; i < vendorArrays.length; i++) {
          //查询出所有明细并放到objs中
          promises.push(
            getQualifiedVendor(vendorArrays[i].id).then((vendorLicenseInfo) => {
              for (let j = 0; j < vendorLicenseInfo.length; j++) {
                if (
                  typeof vendorLicenseInfo[j].extend_license != "undefined" &&
                  typeof vendorLicenseInfo[j].extend_license_code != "undefined"
                ) {
                  objs.push({ code: vendorArrays[i].code, name: vendorArrays[i].name, licence_code: vendorLicenseInfo[j].extend_license_code, licence_name: vendorLicenseInfo[j].extend_license });
                }
              }
            })
          );
        }
        Promise.all(promises).then(() => {
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
      });
    }
  });
  getVendors = function () {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.reportData.getVendors", {}, function (err, res) {
        if (typeof res !== "undefined") {
          let vendorList = res.vendorListRes;
          for (let i = 0; i < vendorList.length; i++) {
            vendorArrays.push({ id: vendorList[i].id, code: vendorList[i].code, name: vendorList[i].name });
          }
        } else if (err !== null) {
          alert(err.message);
        }
        resolve();
      });
    });
  };
  getQualifiedVendor = function (vendorId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.reportData.getVendorLicense", { vendorId: vendorId }, function (err, res) {
        if (typeof res !== "undefined") {
          let vendorLicenseInfo = res.vendorLicenseListRes;
          console.log(vendorLicenseInfo);
          resolve(vendorLicenseInfo);
        } else if (err !== null) {
          alert(err.message);
        }
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
  let prev = viewModel.get("button5qh");
  prev.on("click", function () {
    initPage(gridModel, objs, (currentIndex = currentIndex - 1));
    gridModel.appendRow({
      code: currentIndex,
      name: "第" + currentIndex + "页"
    });
  });
  //下一页
  let next = viewModel.get("button11ee");
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