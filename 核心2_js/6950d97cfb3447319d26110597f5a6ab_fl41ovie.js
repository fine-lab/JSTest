var treetable0808 = viewModel.get("treetable_1516212292728389639");
treetable0808.setState("maxLevel", 3);
treetable0808.on("afterSetDataSource", function (data) {
  // 树参照--值改变后
  cb.utils.alert(JSON.stringify(data));
  debugger;
  this.setShowExpand(true);
});