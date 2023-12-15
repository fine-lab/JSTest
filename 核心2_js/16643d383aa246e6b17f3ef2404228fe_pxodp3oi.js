//客户来源 隐藏值
viewModel.on("afterLoadData", function () {
  debugger;
  var EnquiriesAreSource = viewModel.get("EnquiriesAreSource");
  let data = EnquiriesAreSource.__data.dataSource;
  let newData = [];
  data.forEach((item, index) => {
    if (item.value != "17" && item.value != "1" && item.value != "7" && item.value != "8" && item.value != "13" && item.value != "14" && item.value != "15" && item.value != "16") {
      newData.push(item);
    }
  });
  EnquiriesAreSource.setDataSource(newData);
});