viewModel.on("customInit", function (data) {
  // 智能货位--页面初始化
  var userInfo = viewModel.getAppContext().user;
  console.log(viewModel.getAppContext());
  var sysId = userInfo.sysId;
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  var searchFlag = false;
  let referModel = null;
  viewModel.selectedHuowei = [];
  viewModel.getParams().autoAddRow = false;
  console.log("========[智能货位列表]");
  let flagDebug = false;
  viewModel.flagBack = false;
  var orgid = null;
  //获取查询区模型
  var gridModel = viewModel.get("dxq_location_1552215775092670468");
  gridModel._set_data("forbiddenDblClick", true);
  gridModel.setState("showRowNo", true);
  gridModel.setState("showCheckBox", false);
  //页面DOM加载完成
  viewModel.on("afterMount", function () {
    viewModel.getCache("FilterViewModel").getParams().filterRows = 3;
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filtervm.on("afterInit", function () {
      const orgIdForm = filtervm.get("org_id").getFromModel();
      //监听选中“仓库” afterValueChange afterSelect
      orgIdForm.on("afterInitVm", function (argument) {
        if (flagDebug) console.log("[afterInitVm]");
        if (flagDebug) console.log(argument);
        var orgIdModel = orgIdForm.getCache("vm").get("tree");
        console.log(orgIdModel);
        orgIdModel.on("afterValueChange", function (data) {
          if (flagDebug) console.log("[afterValueChange]");
          if (flagDebug) console.log(data);
          if (flagDebug) console.log(viewModel.flagBack);
          if (!viewModel.flagBack) {
            filtervm.get("parent").getFromModel().getCache("vm").get("tree").select("");
            if (data.value.length > 0) {
              orgid = data.value[0].orgid;
            }
            if (flagDebug) console.log(orgid);
            if (flagDebug) console.log("[afterValueChange]end");
            var treeData1 = [];
            const res = getTreeData(orgid);
            if (res.error) {
              cb.utils.alert(res.error.message);
              return false;
            }
            if (res.status === 1) {
              treeData1 = res.dataList;
            } else {
              cb.utils.alert("数据加载异常,请刷新后重试!");
              return false;
            }
            filtervm.get("parent").getFromModel().getCache("vm").get("tree").setDataSource(treeData1);
            viewModel.selectedHuowei = [];
            searchFlag = true;
          } else viewModel.flagBack = false;
        });
      });
      console.log(filtervm);
      referModel = filtervm.get("parent").getFromModel();
      referModel.on("afterInitVm", function (args) {
        if (flagDebug) console.log("[referModel-Init]");
        //请求脚手架接口给参照树赋值
        var treereferModel = referModel.getCache("vm").get("tree");
        if (flagDebug) console.log("[referModel]");
        var treeData = [];
        if (flagDebug) console.log(viewModel.get("org_id"));
        const result = getTreeData(null);
        if (result.error) {
          cb.utils.alert(result.error.message);
          return false;
        }
        if (result.status === 1) {
          treeData = result.dataList;
        } else {
          cb.utils.alert("数据加载异常,请刷新后重试!");
          return false;
        }
        // 货位树 数据渲染
        var flag = true;
        treereferModel.on("beforeSetDataSource", function (arg) {
          if (flagDebug) console.log("[referModel]" + flag);
          if (flag) {
            arg.length = 0;
            for (var i = 0; i < treeData.length; i++) {
              arg.push(treeData[i]);
            }
          }
        });
        treereferModel.on("afterSetDataSource", function (arg) {
          flag = false;
        });
        let referViewModelInfo = args.vm;
        referViewModelInfo.on("afterOkClick", function (okData) {
          if (flagDebug) console.log("[afterOkClick]");
          if (flagDebug) console.log(okData);
          if (flagDebug) console.log("[afterOkClick]end");
          viewModel.selectedHuowei = okData;
          console.log(okData);
        });
      });
    });
  });
  viewModel.on("beforeSearch", function (args) {
    if (searchFlag) {
      args.isExtend = true;
      var commonVOs = args.params.condition.commonVOs;
      console.log(args);
      console.log(commonVOs);
      for (var i = 0; i < commonVOs.length; i++) {
        if (commonVOs[i].itemName === "parent") {
          commonVOs.splice(i, 1);
        }
      }
      console.log(commonVOs);
      searchFlag = false;
    }
  });
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const level = data.level;
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        if (level === 0) {
          actionState[action.cItemName] = { visible: false };
        } else if (action.cItemName == "btnDelete") {
          actionState[action.cItemName] = { visible: true };
        } else if (action.cItemName == "btnEdit") {
          actionState[action.cItemName] = { visible: true };
        } else {
          actionState[action.cItemName] = { visible: true };
        }
        actionState["btnCopy"] = { visible: false };
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
  function getTreeData(orgid) {
    //创建同步接口请求对象
    const reqParams = {
      orgid: orgid,
      userId: userInfo.userId,
      tenant_id: tenantID
    };
    var treeResult = cb.rest.invokeFunction("Idx3.Location.GetLoactionTree", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
    var data = JSON.parse(treeResult.result.strResponse);
    return data;
  }
  viewModel.on("beforeBatchdelete", function (params) {
    var domainKey = params.params.domainKey;
    var deldata = JSON.parse(params.data.data);
    console.log(deldata);
    var locationId = deldata[0].id;
    //传参
    const reqParams = {
      locationId: locationId,
      tenant_id: tenantID
    };
    var checkResult = cb.rest.invokeFunction("52d9725180264778bad797f9ced6998d", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
    const result = JSON.parse(checkResult.result.strResponse);
    console.log(result);
    debugger;
    if (flagDebug) console.log(result);
    if (result.status === "1" || result.status === 1) {
      if (result.data === false) {
        cb.utils.alert("该位置存在数据关联,不能删除！");
        return false;
      } else {
        console.log("success");
      }
    } else {
      cb.utils.alert("数据加载异常,请刷新后重试!");
      return false;
    }
  });
  viewModel.on("afterBatchdelete", function (params) {
    if (flagDebug) console.log("afterBatchdelete");
    if (flagDebug) console.log(params);
    var data = params.res.infos;
    var id = data[0].id;
    viewModel.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").deleteNode(id);
  });
  //搜索表格数据之前，可以修改params参数
  gridModel.on("beforeLoad", function (params) {
    //一般主要修改默认查询的过滤条件
  });
});
// 重写编辑按钮带过去的内容
viewModel.get("btnEdit") &&
  viewModel.get("btnEdit").on("click", function (data) {
    // 按钮--单击
    var GridModel1 = viewModel.get(data.name);
    var currentRow = GridModel1.getRow(data.index);
    viewModel.selectedHuowei = currentRow;
  });