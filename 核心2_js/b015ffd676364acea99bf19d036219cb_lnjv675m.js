viewModel.get("purchaseprocess") &&
  viewModel.get("purchaseprocess").on("afterValueChange", function (data) {
    // 在线采购进程--值改变后
    console.log("==========================================================================================");
    console.log("才购进程改变后");
    console.log("data", JSON.stringify(data));
  });