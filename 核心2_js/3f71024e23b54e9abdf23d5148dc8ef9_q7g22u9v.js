function init(event) {
  let viewModel = this;
  let treeModel = viewModel.getTreeModel();
  viewModel.get("button4092150dj").on("click", function (event) {
    //获取新增子类时的行数据
    let FilterViewModel = viewModel.getCache("FilterViewModel");
    let parentViewModel = FilterViewModel.getCache("parentViewModel");
    let parentRow = parentViewModel.getTreeModel().getSelectedNodes();
    let data = {
      billtype: "Voucher", // 单据类型
      billno: "75948c92SingleCard", // 单据号
      params: {
        mode: "add", // (edit编辑态、新增态、browse浏览态)
        selectRows: parentRow //将行数据带到子类中
      }
    };
    //末级分类为是和启用状态为否时,禁止新增子类
    if (parentRow[0].isEnd) {
      cb.utils.alert("'末级分类'为是时,禁止新增子类");
      return false;
    }
    if (parentRow[0].enable === 0) {
      cb.utils.alert("'启用状态'为停用时,禁止新增子类");
      return false;
    }
    //设置上级分类不可选择资质类型中引用过的资质分类
    let resp = cb.rest.invokeFunction("d11fb38b57b7459ca8375f161e7fd0c4", { qualificationClassification: parentRow[0].id }, null, viewModel, { async: false });
    if (resp.result.result) {
      cb.utils.alert(parentRow[0].name + "分类已被其他单据引用过,不可作为上级分类");
      return false;
    } else {
      cb.loader.runCommandLine("bill", data, viewModel); //固定写法
    }
  });
  let ids = [];
  //设置数据源后事件
  treeModel.on("afterSetDataSource", function (event) {
    //查询所有资质类型,被自制类型引用过则隐藏删除按钮
    var rows = treeModel.getCheckedNodes();
    let resp = cb.rest.invokeFunction("f99dbb1885f44b4c9664c1b28bc476fe", {}, null, viewModel, { async: false });
    var types = resp.result.result;
    for (var k in types) {
      for (var l in rows) {
        if (types[k].qualificationClassification === rows[l].id) {
          ids.push(rows[l].id);
        }
      }
    }
    //父类隐藏删除按钮
    for (var i in rows) {
      for (var j in rows) {
        if (rows[i].parent_name === rows[j].name) {
          ids.push(rows[j].id);
        }
      }
    }
    var model = this;
    classificationButtonControl(model, ids);
  });
  viewModel.get("btnDelete").on("beforeclick", function (event) {
    var row = treeModel.getSelectedNodes();
    for (var i = 0; i < ids.length; i++) {
      for (var j = 0; j < row.length; j++) {
        if (row[j].id === ids[i]) {
          cb.utils.alert("拥有下级分类或被其他单据引用过的分类禁止删除!");
          return false;
        }
      }
    }
  });
  //根据name设置行内按钮不可用(所属afterSetDataSource事件)
  function classificationButtonControl(model, ids) {
    var rows = model.getCheckedNodes();
    var actions = treeModel.getCache("actions");
    if (!actions) return;
    var actionsStates = [];
    rows.forEach(function (row) {
      const actionState = {};
      actions.forEach(function (action) {
        actionState[action.cItemName] = { visible: true };
        //停用启用按钮根据状态隐藏
        if (row.enable === 1 && action.cItemName === "btnUnstop") {
          actionState[action.cItemName] = { visible: false };
        } else if (row.enable === 0 && action.cItemName === "btnStop") {
          actionState[action.cItemName] = { visible: false };
        }
        for (var i = 0; i < ids.length; i++) {
          if (row.id === ids[i]) {
            //设置删除按钮可用不可用
            if (action.cItemName === "btnDelete") {
              actionState[action.cItemName] = { visible: false };
            }
          }
        }
      });
      actionsStates.push(actionState);
    });
    model.setActionsState(actionsStates);
  }
  viewModel.get("btnBatchStop").on("afterclick", function () {
    viewModel.execute("refresh");
  });
}