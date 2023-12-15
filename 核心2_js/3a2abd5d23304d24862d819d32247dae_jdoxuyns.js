//设置删除前校验
viewModel.get("button14bg") &&
  viewModel.get("button14bg").on("click", function (args) {
    //获取选中行
    const model = viewModel.getTreeModel();
    //获取节点数据
    var Nodes = model.getSelectedNodes();
    //获取选中节点ID
    var treeId = model.getCheckedKeys()[0];
    console.log(JSON.stringify(treeId));
    var options = {
      domainKey: "yourKeyHere"
    };
    //请求接口
    var url = "/spc/api/v1/monitor/deleteCheck?treeId=" + treeId;
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: url,
        method: "POST",
        options: options
      }
    });
    proxy.settle({}, function (err, result) {
      if (err) {
        cb.utils.alert(err.message, "error");
        return;
      } else {
        console.log(JSON.stringify(result));
        if (result == 1) {
          cb.utils.alert("当前分类节点有质量特性数据关联，不允许删除！", "error");
          return;
        }
        if (result == 2) {
          cb.utils.alert("请先处理并删除下级节点！", "error");
          return;
        }
        viewModel.execute("refresh");
      }
    });
  });