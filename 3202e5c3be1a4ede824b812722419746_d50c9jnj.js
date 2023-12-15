viewModel.on("customInit", function (data) {
  // 销售结算--页面初始化
});
viewModel.get("button23kk") &&
  viewModel.get("button23kk").on("click", function (data) {
    debugger;
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucherList",
        billno: "yba9dd4838",
        params: {
          opDate: viewModel.getCache("FilterViewModel").get("opDate").getFromModel().getValue()
        }
      },
      viewModel
    );
  });
//查询条件设置默认值
viewModel.on("afterMount", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  //查询区afterInit事件，必须放在页面模型的afterMount事件中才生效
  filterViewModelInfo.on("afterInit", function (data) {
    debugger;
    // 删除之前不断跳转的节点
    let bodyParent = document.getElementsByClassName("wui-tabs-tabpane wui-tabs-tabpane-inactive mdf-bill-tabpane");
    if (bodyParent.length > 0) {
      let body = bodyParent[0].parentElement;
      let indexs = [];
      for (var i = 0; i < body.childNodes.length; i++) {
        if (body.childNodes[i].attributes["aria-hidden"].value == "true") {
          indexs.push(body.childNodes[i]);
        }
      }
      for (var j = 0; j < indexs.length; j++) {
        body.removeChild(indexs[j]);
      }
    }
    let datePick = document.getElementsByClassName("Test-time-two")[0];
    datePick.children[1].hidden = true; // 隐藏-字符
    datePick.children[2].hidden = true; // 隐藏第二个选择框
    datePick.children[0].style.width = "100%"; // 设置第一个选择框的长度
    let filterModelInfo = filterViewModelInfo.get("opDate");
    let realModelInfo = filterModelInfo.getFromModel();
    if (viewModel.getParams().monthNum) {
      realModelInfo.setValue(viewModel.getParams().opDate); //默认值赋值
    } else if (!realModelInfo.getValue()) {
      const res = cb.utils.getNowFormatDate();
      realModelInfo.setValue(res.substring(0, 7)); //默认值赋值
    }
  });
});
viewModel.on("beforeBatchdelete", function (args) {
  debugger;
  let selectRows = viewModel.getGridModel().getSelectedRows();
  if (!selectRows || selectRows.length == 0) {
    // 行上删除
    if (viewModel.getGridModel().getCellValue(args.params.params.index, "billStatus") == "2") {
      cb.utils.alert("第【" + (args.params.params.index + 1) + "】行已结算，不能删除！");
      return false;
    }
  }
  for (let i = 0; i < selectRows.length; i++) {
    if (selectRows[i].billStatus == "2") {
      // 已结算不可以删除
      cb.utils.alert("第【" + (i + 1) + "】行已结算，不能删除！");
      return false;
    }
  }
  return true;
});
viewModel.on("beforeSearch", function (args) {
  debugger;
  let value2 = new Date(args.params.condition.commonVOs[2].value1.substring(0, 10));
  let value1 = new Date(value2 - 86400000).format("yyyy-MM-dd");
  args.params.condition.commonVOs[2].value1 = value1;
  args.params.condition.commonVOs[2].value2 = value2.format("yyyy-MM-dd");
  args.data.condition.commonVOs[2].value1 = value1;
  args.data.condition.commonVOs[2].value2 = value2.format("yyyy-MM-dd");
});