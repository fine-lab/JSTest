viewModel.get("button10nb") &&
  viewModel.get("button10nb").on("click", function (data) {
    //新增平级--单击
  });
// 构建实体引用树形结构，构建左树右卡页面，见附件截图。构建出来的左树右卡的新增按钮应该就是新增下级按钮，
// 如果要新增平级的按钮，自己加一个按钮，绑定脚本：viewModel.get('button12gh').on('click',args=>{ viewModel.setCache('buttonFlag',1); viewModel.biz.do('add',viewModel); }) 。
// 通过cache中buttonFlag的值区分是点的新增下级还是新增平级。buttonFlag如果是1，就是新增平级，在保存前修改单据中parent的值就行。
// 获取左侧树模型使用，viewModel.getTreeModel()。获取左侧树的选中行的数据使用viewModel.getTreeModel().getSelectedNodes()
// 新增平级
viewModel.get("button10nb").on("click", (args) => {
  viewModel.setCache("buttonFlag", 1);
  viewModel.biz.do("add", viewModel);
});