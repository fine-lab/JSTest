function init(event) {
  let viewModel = this;
  let gridModel = viewModel.getGridModel();
  viewModel.get("button5yf").on("click", function (event) {
    //获取新增子类时的行数据
    let FilterViewModel = viewModel.getCache("FilterViewModel");
    let parentViewModel = FilterViewModel.getCache("parentViewModel");
    let parentRows = parentViewModel.getGridModel().getRows();
    //新建子类所在的父类名字
    let parentRow = parentRows[event.index];
    let data = {
      billtype: "Voucher", // 单据类型
      billno: "d6ecb514", // 单据号
      params: {
        mode: "add", // (edit编辑态、新增态、browse浏览态)
        selectRows: parentRow //将行数据带到子类中
      }
    };
    //末级分类为是和启用状态为否时,禁止新增子类
    if (parentRow.isEnd) {
      cb.utils.alert("'末级分类'为是时,禁止新增子类");
      return false;
    }
    if (!parentRow.enable) {
      cb.utils.alert("'启用状态'为停用时,禁止新增子类");
      return false;
    }
    //设置上级分类不可选择资质类型中引用过的资质分类
    let resp = cb.rest.invokeFunction("d11fb38b57b7459ca8375f161e7fd0c4", { qualificationClassification: parentRow.id }, null, viewModel, { async: false });
    if (resp.result.result) {
      cb.utils.alert(parentRow.name + "分类已被其他单据引用过,不可作为上级分类");
      return false;
    } else {
      cb.loader.runCommandLine("bill", data, viewModel); //固定写法
    }
  });
  //停用点击事件
  viewModel.get("btnStop").on("click", function (event) {
    enableStatus(event);
  });
  //启用点击事件
  viewModel.get("btnUnstop").on("click", function (event) {
    enableStatus(event);
  });
  //设置数据源后事件
  gridModel.on("afterSetDataSource", function (event) {
    //查询所有资质类型,被自制类型引用过则隐藏删除按钮
    var rows = gridModel.getRows();
    let resp = cb.rest.invokeFunction("f99dbb1885f44b4c9664c1b28bc476fe", {}, null, viewModel, { async: false });
    var types = resp.result.result;
    let ids = [];
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
    const model = this;
    classificationButtonControl(model, ids);
  });
  //根据name设置行内按钮不可用(所属afterSetDataSource事件)
  function classificationButtonControl(gridModel, ids) {
    var rows = gridModel.getRows();
    var actions = gridModel.getCache("actions");
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
    gridModel.setActionsState(actionsStates);
  }
  //启用停用相关方法
  function enableStatus(event) {
    var rows = gridModel.getRows();
    let newValue = 1;
    if (rows[event.index].enable === 1) {
      newValue = 0;
    } else {
      return true;
    }
    var names = [];
    var index = event.index;
    for (var j in rows) {
      if (rows[j].parent_name === rows[index].name) {
        names.push(rows[j].name); //子名字
        var superName = recursion(gridModel, rows[j].name); //孙及以下名字
        let sName = "";
        do {
          if (typeof superName == "undefined" || superName === null) {
            break;
          }
          names.push(superName);
          sName = recursion(gridModel, names[names.length - 1]);
          if (typeof sName === "undefined") {
            break;
          }
        } while (typeof sName != "undefined" || sName !== null || sName !== "");
      }
    }
    if (names.length === 0) {
      return true;
    } else {
      let selectResult = cb.rest.invokeFunction("600d9102ddd34085a3c9b2af995273a5", { names: names }, null, viewModel, { async: false });
      var ids = [];
      for (var i = 0; i < selectResult.result.result.length; i++) {
        ids.push(selectResult.result.result[i][0].id);
      }
      for (var m in ids) {
        var data = { id: ids[m], enable: newValue };
        let respResult = cb.rest.invokeFunction("ae2e0c2175a24fbbb14a7bc0cffb8604", { data: data }, null, viewModel, { async: false });
        var s = 1;
      }
      cb.utils.alert("已将此分类的启用状态同步设置到所有该分类的下级分类中");
    }
    viewModel.execute("refresh");
  }
  //递归方法(source:enableStatus function)
  function recursion(gridModel, name) {
    var rows = gridModel.getRows();
    for (var i in rows) {
      if (rows[i].parent_name === name) {
        return rows[i].name; //子名字
      }
    }
  }
}