// 构建出来的左树右卡的新增按钮应该就是新增下级按钮，如果要新增平级的按钮，自己加一个按钮，
// 绑定脚本：viewModel.get('button12gh').on('click',args=>{ viewModel.setCache('buttonFlag',1); viewModel.biz.do('add',viewModel); }) 。
// 通过cache中buttonFlag的值区分是点的新增下级还是新增平级。buttonFlag如果是1，就是新增平级，在保存前修改单据中parent的值就行。
// 获取左侧树模型使用，viewModel.getTreeModel()。获取左侧树的选中行的数据使用viewModel.getTreeModel().getSelectedNodes()
viewModel.on("afterMount", function (args) {});
viewModel.get("button21si") &&
  viewModel.get("button21si").on("click", function (data) {
    //导入--单击
  });
viewModel.get("button29ha") &&
  viewModel.get("button29ha").on("click", function (data) {
    //导出--单击
  });
viewModel.get("btnAddbrother").on("click", (args) => {
  viewModel.setCache("buttonFlag", 1);
  viewModel.biz.do("add", viewModel);
});
viewModel.get("btnAddchild").on("click", (args) => {
  viewModel.setCache("buttonFlag", 0);
  viewModel.biz.do("add", viewModel);
});
viewModel.on("beforeSave", function (args) {
  let selectNode = viewModel.getTreeModel().getSelectedNodes();
  let parent = "";
  if (selectNode[0].parent == "" || selectNode[0].parent == undefined || selectNode[0].parent == null) {
    parent = "";
  } else {
    parent = selectNode[0].parent;
  }
  let buttonFlag = viewModel.getCache("buttonFlag");
  if (buttonFlag == 1) {
    var data = JSON.parse(args.data.data);
    if (parent == "") {
      data.parent = "";
      data.parent_name = "";
      data.level = 1;
      args.data.data = JSON.stringify(data);
    } else {
      data.parent = parent;
      args.data.data = JSON.stringify(data);
    }
  }
});
viewModel.on("afterSave", function (args) {
  viewModel.execute("refresh");
});