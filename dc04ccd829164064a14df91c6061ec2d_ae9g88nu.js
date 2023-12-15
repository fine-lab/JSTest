run = function (event) {
  //首营品种报表
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
      getProducts().then((productList) => {
        console.log(productList);
        for (let i = 0; i < productList.length; i++) {
          //查询出所有明细并放到objs中
          if (
            typeof productList[i].extend_is_gsp != "undefined" &&
            typeof productList[i].extend_syzt != "undefined" &&
            (productList[i].extend_is_gsp == 1 || productList[i].extend_is_gsp == "1" || productList[i].extend_is_gsp == "true" || productList[i].extend_is_gsp == true) &&
            (productList[i].extend_syzt == 1 || productList[i].extend_syzt == "1")
          ) {
            objs.push({ code: productList[i].code, name: productList[i].name });
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
  getProducts = function () {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.reportData.getProducts", {}, function (err, res) {
        if (typeof res !== "undefined") {
          let productList = res.proListRes;
          resolve(productList);
        } else if (err !== null) {
          alert(err.message);
        }
        resolve();
      });
    });
  };
  let prev = viewModel.get("button5sg");
  prev.on("click", function () {
    initPage(gridModel, objs, (currentIndex = currentIndex - 1));
    gridModel.appendRow({
      code: currentIndex,
      name: "第" + currentIndex + "页"
    });
  });
  //下一页
  let next = viewModel.get("button17fg");
  next.on("click", function () {
    initPage(gridModel, objs, (currentIndex = currentIndex + 1));
    gridModel.appendRow({
      code: currentIndex,
      name: "第" + currentIndex + "页"
    });
  });
};