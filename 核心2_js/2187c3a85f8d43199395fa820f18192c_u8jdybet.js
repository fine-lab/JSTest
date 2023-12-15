var detailPage;
viewModel.on("afterLoadData", function (arg) {
  console.log("送达afterLoadData---------------");
  if (!window.KPextend.workFlow.currentStepName && viewModel.getParams().mode != "browse")
    //非审批且非browse需要设置字段隐藏
    window.KPextend.setVisible(viewModel, window.KPextend.workFlow.songdaFields); //设置字段隐藏，【针对申请人】
  //先区分edit，browse，add态，edit态区分审批和非审批，edit非审批区分编辑新增送达和编辑已存在送达.
  if (viewModel.getParams().mode == "edit") {
    let data = this.getParams().data;
    if (!window.KPextend.workFlow.currentStepName) {
      if (window.KPextend.detailPage.get("lck").getValue() == 1) {
        //新规
        //新规时隐藏开始执行日期
      } //变更
      else {
        //隐藏模块
        var allmds = viewModel.getViewMeta("fa937b2b78534882962cbd645a91d244").containers;
        var billType = viewModel.__data.cache.parentViewModel.get("item2398pf").getValue();
        window.KPextend.showGroups(viewModel, billType ? window.KPextend.moduelAuth[billType] : null, allmds);
      }
      if (!data.lck || data.lck == 2) {
        //已存在地址lck为空或为2
        let addrs = JSON.parse(window.KPextend.jsonOldData)[window.KPextend.addressName];
        if (data && addrs) {
          for (var addr in addrs) {
            if (addrs[addr].songdaCode == data.songdaCode) {
              this.jsonOldData = addrs[addr];
              break;
            }
          }
        }
        data.lck = 2; //编辑已存在的地址lck为2，如果是编辑新增的不变
      }
    } //审批状态显示可编辑字段，并显示更改对比信息
    else {
      this.setReadOnly(true);
      window.KPextend.iSetReadOnly(this, window.KPextend.workFlow.songdaFields[window.KPextend.workFlow.currentStepName]);
      document.querySelector('button[fieldid="youridHere"]').style.display = "none"; //隐藏X按钮，不然点击后会刷新页面
      var log = data.log; //审批状态要显示对比
      if (log) {
        window.KPextend.compare(JSON.parse(log)[0], viewModel.__data, 1);
      }
      setTimeout(function () {
        document.querySelector(".container-edit-mode").classList.remove("container-edit-mode"); //修复div浮动错位
      }, 100);
    }
    if (data) {
      this.setData(data);
      //计算
    }
  } else if (viewModel.getParams().mode == "add") {
    this.get("lck").setValue(1);
    this.get("type").setValue(1);
  } //browse态要显示更改对比信息
  else {
    var log = this.get("log").getValue();
    if (log) {
      window.KPextend.compare(JSON.parse(log)[0], viewModel.__data, 1);
    }
  }
  window.KPextend.blindCtr(viewModel);
});
viewModel.on("afterMount", function () {
  console.log("送达afterMount---------------");
  let objs = this.__data;
  let billNo = this.getParams().billNo;
  for (var ctrName in objs) {
    let obj = objs[ctrName];
    if (obj?.__data?.cStyle) {
      var style = obj?.__data?.cStyle;
      var jstyle = JSON.parse(style);
      if (jstyle.wrap) document.getElementById(billNo + "|" + ctrName).style.clear = "both";
    }
  }
});
viewModel.get("btnAbandon") &&
  viewModel.get("btnAbandon").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
    viewModel.jsonOldData = undefined;
  });
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (d) {
    // 确定--单击
    var validate = viewModel.validate();
    if (validate) {
      alert("请填写：" + JSON.stringify(validate));
      return;
    }
    if (window.KPextend.detailPage.get("item2398pf").getValue() == 8) {
      //变更业务员
      if (!viewModel.get("effectiveDate").getValue()) {
        alert("请填写【开始执行日期】");
        return;
      }
    }
    var parentgm = window.KPextend.detailPage.get(window.KPextend.addressName);
    var data = viewModel.getAllData();
    if (viewModel.getParams().mode == "edit") {
      if (!window.KPextend.workFlow.currentStepName) {
        //不是审批状态
        if (data.lck == 2) {
          //已存在地址lck为空或为2
          var oldData = viewModel.jsonOldData;
          var log = window.KPextend.getLog(oldData, viewModel.getData());
          if (oldData) {
            data._status = "Insert"; //改为insert
            if (log) {
              data.item1443sj = "修改";
              data.log = log; //添加log信息
            } else {
              data.lck = "";
              data.item1443sj = "";
              data.log = "";
            }
          }
        }
      } //审批状态
      else {
        //审批状态时的log值在追加审批数据时更新，此处不更新
      }
      parentgm.updateRow(parentgm.getFocusedRowIndex(), data);
    } else if (viewModel.getParams().mode == "add") {
      parentgm.appendRow(data);
      window.KPextend.hideGridButtons(window.KPextend.detailPage.getGridModel(), ["button48wh"]); //添加行后重新隐藏查看详情按钮
    }
    viewModel.jsonOldData = undefined;
    viewModel.communication({ type: "modal", payload: { data: false } });
  });