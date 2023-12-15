viewModel.on("customInit", function (data) {
  // 实际入库单信息详情--页面初始化
  console.log("页面初始化");
});
// 生成物料--单击
viewModel.get("button22ig") &&
  viewModel.get("button22ig").on("click", function (data) {
    var value = viewModel.get("rfcode").getValue();
    var arr = value.replace(/(\r\n)|\r|\n/g, "\n").split(/\n+/g);
    var gridModel = viewModel.getGridModel();
    var details = gridModel.getData();
    console.log("====>", details);
    for (let i = 0; i < arr.length; i++) {
      let x = arr[i];
      if (x == null || x == "") {
        continue;
      }
      console.log(x);
      var yarr = x.split(" ");
      console.log(yarr);
      var detail = {};
      for (let j = 0; j < yarr.length; j++) {
        let y = yarr[j];
        if (j == 0) {
          detail.DI = y;
        } else if (j == 1) {
          detail.batchNo = y;
        } else if (j == 2) {
          if (y.length == 8) {
            let yyyy = y.slice(0, 4);
            let mm = y.slice(4, 6);
            let dd = y.slice(-2);
            detail.productDate = yyyy + "-" + mm + "-" + dd;
          }
        } else if (j == 3) {
          if (y.length == 8) {
            let yyyy = y.slice(0, 4);
            let mm = y.slice(4, 6);
            let dd = y.slice(-2);
            detail.validityDate = yyyy + "-" + mm + "-" + dd;
          }
        }
      }
      detail.ct = 1;
      var idx = idxDetail(details, detail);
      if (idx > -1) {
        details[idx].ct++;
      } else {
        details.push(detail);
      }
      console.log(details);
    }
    console.log(details);
    gridModel.clear();
    gridModel.insertRows(1, details);
    viewModel.get("rfcode").clear();
  });
function idxDetail(list, e) {
  for (var i = list.length - 1; i >= 0; i--) {
    var a = list[i];
    if (a.DI == e.DI && a.batchNo == e.batchNo && a.productDate == e.productDate && a.validityDate == e.validityDate) {
      return i;
    }
  }
  return -1;
}