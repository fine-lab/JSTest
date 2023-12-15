viewModel.on("beforeSearch", function (args) {
  debugger;
  var gridModel = viewModel.getGridModel("XunjiadanList");
  //表格动态设置行颜色、列颜色  column:列名 index:行号
  //设置表格列CSS样式
  const prefix = "public_fixedDataTableRow";
  const style = `
      .${prefix}_bg-blue { background-color: blue; }
      .${prefix}_bg-yellow [role="gridcell"] { background-color: yellow; }
      .${prefix}_bg-white { background-color: #fff; }
      `;
  const ele = document.createElement("style");
  ele.innerHTML = style;
  document.getElementsByTagName("head")[0].appendChild(ele);
  var user = this.getAppContext().user;
  var userId = user.userId;
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
  commonVOs.push({
    itemName: "caigouid",
    op: "eq",
    value1: userId
  });
  //设置未查看颜色
  gridModel.on("afterSetDataSource", function (data) {
    debugger;
    var dd = data;
    for (var i = 0; i < data.length; i++) {
      var dd = data[i].kucun;
      if (dd == "2") {
        gridModel.setRowState(i, "className", "bg-yellow");
      }
    }
    var selected = document.querySelectorAll("div[title='无货']");
    if (null != selected) {
      selected.forEach((data) => {
        data.style = data.style.cssText + "; color:red";
      });
    }
  });
});