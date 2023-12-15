viewModel.on("beforeSave", function (event) {
  //获取表单数据
  let json = event.data.data;
  let data = JSON.parse(json);
  //获取子表列表 查看data结构 showChildList 不同单据属性名不同
  let childList = data.showChildList;
  if (childList && childList.length > 0) {
    let has = {};
    for (var i = 0; i <= childList.length - 1; i++) {
      //获取子表中字段
      let target = childList[i]["renyuanbianma_renyuanbianma"];
      if (has[target]) {
        cb.utils.alert("目标字段重复");
        return false;
      }
      has[target] = true;
    }
  }
  //从新赋值给event
});