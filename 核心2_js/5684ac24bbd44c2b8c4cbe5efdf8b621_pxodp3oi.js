viewModel.get("wentidalei") &&
  viewModel.get("wentidalei").on("afterValueChange", function (data) {
    wtChangeHandle();
  });
function wtChangeHandle() {
  let wentidalei = viewModel.get("wentidalei").getValue();
  if (wentidalei.includes("1")) {
    let wentiafuzeren_nameObj = viewModel.get("wentiafuzeren_name");
    wentiafuzeren_nameObj.setVisible(true);
  } else {
    let wentiafuzeren_nameObj = viewModel.get("wentiafuzeren_name");
    wentiafuzeren_nameObj.setVisible(false);
  }
  if (wentidalei.includes("2")) {
    let staffNew_nameObj = viewModel.get("staffNew_name");
    staffNew_nameObj.setVisible(true);
  } else {
    let staffNew_nameObj = viewModel.get("staffNew_name");
    staffNew_nameObj.setVisible(false);
  }
  if (wentidalei.includes("3")) {
    let wenticfuzeren_nameObj = viewModel.get("wenticfuzeren_name");
    wenticfuzeren_nameObj.setVisible(true);
  } else {
    let wenticfuzeren_nameObj = viewModel.get("wenticfuzeren_name");
    wenticfuzeren_nameObj.setVisible(false);
  }
}
viewModel.on("afterBuildCode", function (args) {
  debugger;
  console.log("77777");
  let gridModel = viewModel.get("csList");
  calSumCBAmount(gridModel);
});
function calSumCBAmount(gridModel) {
  //合计
  let rowDatas = gridModel.getRows();
  let sumAmount = 0;
  for (var idx in rowDatas) {
    //费用类不用加入
    sumAmount = sumAmount + rowDatas[idx].huixie;
    console.log(sumAmount, 555555555555555555555);
  }
  viewModel.get("chae").setValue(sumAmount);
}
//枚举 不展示   5-蒸馏设备
viewModel.on("afterLoadData", function () {
  debugger;
  var meiju = viewModel.get("shebeidl");
  let data = meiju.__data.dataSource;
  let newData = [];
  data.forEach((item, index) => {
    if (item.value != "5" && item.value != "4") {
      newData.push(item);
    }
  });
  meiju.setDataSource(newData);
});