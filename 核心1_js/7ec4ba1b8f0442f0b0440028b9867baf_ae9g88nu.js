run = function (event) {
  //合格供应商目录台账
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  let customerArrays = [];
  let objs = [];
  let promises = [];
  let currentIndex = 1;
  gridModel.on("afterSetDataSource", function (data) {
    if (objs.length > 0) {
      for (let i = 0; i < objs.length; i++) {
        gridModel.appendRow({ code: objs[i].code, name: objs[i].name });
      }
    } else {
      getCustomers().then(() => {
        for (let i = 0; i < customerArrays.length; i++) {
          //查询出所有明细并放到objs中
          promises.push(
            getQualifiedCustomer(customerArrays[i].id).then((customerWtsInfo) => {
              for (let j = 0; j < customerWtsInfo.length; j++) {
                if (typeof customerWtsInfo[j].extend_ry != "undefined") {
                  objs.push({ code: customerArrays[i].code, name: customerArrays[i].name, wts_name: customerWtsInfo[j].extend_ry });
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
  getCustomers = function () {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.reportData.getCustomer", {}, function (err, res) {
        if (typeof res !== "undefined") {
          let customerList = res.customerListRes;
          for (let i = 0; i < customerList.length; i++) {
            customerArrays.push({ id: customerList[i].id, code: customerList[i].code, name: customerList[i].name });
          }
        } else if (err !== null) {
          alert(err.message);
        }
        resolve();
      });
    });
  };
  getQualifiedCustomer = function (customerId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.reportData.getCustomerWts", { customerId: customerId }, function (err, res) {
        if (typeof res !== "undefined") {
          let customerWtsInfo = res.customerWtsListRes;
          console.log(customerWtsInfo);
          resolve(customerWtsInfo);
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
  let prev = viewModel.get("button24eg");
  prev.on("click", function () {
    initPage(gridModel, objs, (currentIndex = currentIndex - 1));
    gridModel.appendRow({
      code: currentIndex,
      name: "第" + currentIndex + "页"
    });
  });
  //下一页
  let next = viewModel.get("button30pg");
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