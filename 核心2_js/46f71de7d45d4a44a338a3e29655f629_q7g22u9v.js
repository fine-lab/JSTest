function initType(event) {
  var viewModel = this;
  //设置默认状态为0,status为1时不触发btnSave的click事件
  let status = 0;
  //设置value的默认值为0,当event.obj.value的值未定义时,value为1,也就是上级分类为空的时候value的值为1,否则value=event.obj.value
  let value = 0;
  //元数据加载后事件
  let selectRow = "undefined";
  let parenViewModel = null;
  viewModel.on("afterLoadData", function (event) {
    let resp = cb.rest.invokeFunction("a0fcb8fb230946a286809bc4b93f7103", {}, null, viewModel, { async: false });
    var types = resp.result.result;
    var thisId = viewModel.get("id").getValue();
    if (typeof thisId == "undefined" || thisId === null) {
    } else {
      for (var i = 0; i < types.length; i++) {
        if (types[i].parent === thisId) {
          cb.utils.alert("所有父类禁止编辑是否末级字段");
          viewModel.get("isEnd").setReadOnly(true);
        }
      }
    }
    //设置此页面的上级分类name和id为所选中数据的name和id
    parenViewModel = viewModel.getCache("parentViewModel");
    //在当前页面中的selectRows选中的Row的数据
    selectRow = viewModel.get("params").selectRows;
    if (typeof selectRow == "undefined") {
      return;
    } else {
      //获取当前页面的上级分类并设置value和data
      let parentName = viewModel.get("parent_name");
      parentName.setValue(selectRow.name);
      parentName.setData(selectRow.name);
      //获取当前页面的参照父类id字段并设置value和data
      let parentId = viewModel.get("parent");
      parentId.setValue(selectRow.id);
      parentId.setData(selectRow.id);
      parentName.setReadOnly(true);
      parentId.setReadOnly(true);
    }
  });
  //测试api
  //上级分类值改变前事件
  viewModel.get("parent_name").on("beforeValueChange", function (event) {
    //设置上级分类不可选择资质类型中引用过的资质分类
    var qualificationClassification = event.obj.select.id;
    let resp = cb.rest.invokeFunction("d11fb38b57b7459ca8375f161e7fd0c4", { qualificationClassification: qualificationClassification }, null, viewModel, { async: false });
    if (resp.result.result) {
      cb.utils.alert(event.obj.select.name + "分类已被其他单据引用过,不可作为上级分类");
      return false;
    }
    //如果返回的rows为空,说明此页面打开为新增子类,并非单独新增页
    if (typeof selectRow !== "undefined" || selectRow !== null) {
      try {
        //验证此时上级分类框中是否有值,如果有就将值赋给value,否则value=1;
        if (typeof event.obj.value === "undefined") {
          value = 1;
        } else {
          value = event.obj.value;
        }
      } catch (e) {
      } finally {
        //如果value=1说明上级分类此时的值为空,弹窗返回false;
        if (value === 1) {
          cb.utils.alert("上级分类不能为空");
          status = 1;
          return false;
        } else {
          //否则设置status=0;
          status = 0;
        }
      }
    }
  });
  //保存前校验
  viewModel.on("beforeSave", function (event) {
    //如果返回的rows为空,说明此页面打开为新增子类,并非单独新增页
    if (typeof selectRow !== "undefined" || selectRow !== null) {
      //如果此时value=1,说明保存时页面的上级分类字段为空,弹窗提示并返回false
      if (value === 1) {
        cb.utils.alert("上级分类不能为空");
        status = 1;
        return false;
      } else {
        //否则设置status=0;
        status = 0;
      }
    }
  });
  // 弹窗下部按钮触发弹窗关闭
  viewModel.get("btnSave").on("click", function (event) {
    //刷新父页面
    parenViewModel.execute("refresh");
  });
  viewModel.get("btnAbandon").on("click", function (event) {
    // 弹窗关闭
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
    //刷新父页面
    parenViewModel.execute("refresh");
  });
}