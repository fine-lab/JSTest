viewModel.on("customInit", function (data) {
  viewModel.get("button74ob").setVisible(false);
  viewModel.get("button71uk").setVisible(false);
  viewModel.get("button18vh").setVisible(false);
  let gridModel = viewModel.getGridModel("vouchersync_1665933632900956165");
  gridModel.on("cellJointQuery", function (args) {
    let cellName = args.cellName;
    if ("displayName" != cellName) {
      return;
    }
    let voucherId = args.row.voucherId;
    let billno = "glVoucherBillDetail";
    let dataBody = {
      billtype: "Voucher",
      billno: billno,
      domainKey: "yourKeyHere",
      params: {
        id: voucherId,
        mode: "edit",
        readOnly: true,
        carryParams: { domainKey: "yourKeyHere", busiObj: "glVoucherBill" }
      }
    };
    cb.loader.runCommandLine("bill", dataBody, viewModel);
    return false;
  });
});
viewModel.get("vouchersync_1665933632900956165") &&
  viewModel.get("vouchersync_1665933632900956165").on("afterSelect", function (data) {
    // 表格--选择后
    changeBtnState();
  });
const changeBtnState = () => {
  let rows = viewModel.get("vouchersync_1665933632900956165").getSelectedRows();
  cb.utils.alert("当前已选择 " + rows.length + " 行记录" + (rows.length > 10 ? "由于处理较慢，平台有时间限制，建议不要超过10条，多了易超时异常!" : ""), "info");
  let trueBtn = false;
  let falseBtn = false;
  for (var i in rows) {
    let row = rows[i];
    if (!row.voucherVisible) {
      trueBtn = true;
    } else {
      falseBtn = true;
    }
  }
  viewModel.get("button74ob").setVisible(trueBtn);
  viewModel.get("button71uk").setVisible(falseBtn);
  for (var i in rows) {
    let row = rows[i];
    if (!row.syncRst && !row.locked && row.isPubliced) {
      //没加锁、没同步、对公凭证
      viewModel.get("button18vh").setVisible(true);
      return;
    }
  }
  viewModel.get("button18vh").setVisible(false);
};
viewModel.get("vouchersync_1665933632900956165") &&
  viewModel.get("vouchersync_1665933632900956165").on("afterUnselect", function (data) {
    // 表格--取消选中后
    changeBtnState();
  });
viewModel.get("vouchersync_1665933632900956165") &&
  viewModel.get("vouchersync_1665933632900956165").on("afterSelectAll", function (data) {
    // 表格--全选后
    changeBtnState();
  });
viewModel.get("vouchersync_1665933632900956165") &&
  viewModel.get("vouchersync_1665933632900956165").on("afterUnselectAll", function (data) {
    // 表格--取消全选后
    changeBtnState();
  });
function Loading() {
  var hook = React.useState(true);
  stop = hook[1];
  return React.createElement(TinperNext.Spin, { spinning: hook[0] });
}
viewModel.get("button18vh") &&
  viewModel.get("button18vh").on("click", function (data) {
    // 同步U8--单击
    let maxCount = 20;
    let rows = viewModel.get("vouchersync_1665933632900956165").getSelectedRows();
    let voucherIds = [];
    for (var i in rows) {
      let row = rows[i];
      if (!row.syncRst && !row.locked && row.isPubliced) {
        //尚未同步且未锁定且未隐藏 没加锁、没同步、对公凭证
        let reqParams = row.voucherId + "**" + row.id + "**" + row.voucherCode + "**" + row.item84oa + "**" + row.periodUnion_name + "**" + row.voucherStatus;
        if (row.tradeid) {
          reqParams = reqParams + "**" + row.tradeid;
        }
        voucherIds.push(reqParams);
      }
    }
    if (voucherIds.length == 0) {
      cb.utils.alert("温馨提示,请选择尚未同步和锁定的对公凭证!", "info");
      return;
    }
    if (voucherIds.length > maxCount) {
      cb.utils.alert("温馨提示,凭证传输较慢,一次最多传输" + maxCount + "条,请重选!", "info");
      return;
    }
    cb.utils.confirm(
      "确定要执行凭证传递到U8的操作吗?您一共选了未同步、未锁定的对公凭证[" + voucherIds.length + "]条",
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.synToU8Api",
          { resend: 0, voucherIds: voucherIds.join() },
          function (err, res) {
            stop();
            if (err != null) {
              cb.utils.alert("温馨提示,出错了！" + err.message, "error");
              viewModel.execute("refresh");
              return;
            }
            if (res.rst) {
              cb.utils.alert("温馨提示,凭证传输执行完成!成功执行" + res.successCount + "条，失败" + res.failCount + "条", "info");
              viewModel.execute("refresh");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });
viewModel.get("button60hi") &&
  viewModel.get("button60hi").on("click", function (data) {
    // 锁定(加锁可弃审凭证)--单击
    let idx = data.index;
    let dataRows = viewModel.getGridModel("vouchersync_1665933632900956165").getRows();
    let dataObj = dataRows[idx];
    let id = dataObj.id;
    let code = dataObj.code;
    let locked = dataObj.locked;
    if (locked != undefined && locked == 1) {
      cb.utils.alert("温馨提示，该凭证已经锁定！[" + dataObj.displayName + "]", "info");
      return;
    }
    cb.utils.confirm(
      "确定要执行锁定操作吗？",
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.lockForUpdateApi",
          { id: id },
          function (err, res) {
            stop();
            if (res.rst) {
              cb.utils.alert("温馨提示," + res.msg, "info");
              viewModel.execute("refresh");
            } else {
              cb.utils.alert("温馨提示," + res.msg, "error");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });
viewModel.get("button61sf") &&
  viewModel.get("button61sf").on("click", function (data) {
    // 锁定重整--单击
    let rows = viewModel.get("vouchersync_1665933632900956165").getSelectedRows();
    let voucherIds = [];
    for (var i in rows) {
      let dataObj = rows[i];
      let locked = dataObj.locked;
      if (locked != undefined && locked == 1) {
        voucherIds.push(dataObj.id);
      }
    }
    let paramsObj = {};
    if (voucherIds.length > 0) {
      paramsObj.voucherIds = voucherIds.join();
    }
    cb.utils.confirm(
      "确定要执行锁定重整吗？您已选择" + voucherIds.length + "条被锁定的记录，该操作将把已删除的凭证彻底删除，将已锁定且未弃审的凭证解锁...",
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.unLockApi",
          paramsObj,
          function (err, res) {
            stop();
            if (res.rst) {
              cb.utils.alert("温馨提示," + res.msg, "info");
              viewModel.execute("refresh");
            } else {
              cb.utils.alert("温馨提示," + res.msg, "error");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });
viewModel.get("button71uk") &&
  viewModel.get("button71uk").on("click", function (data) {
    // 凭证隐藏--单击
    voucherSetVisible(false);
  });
function voucherSetVisible(visibled) {
  let rows = viewModel.get("vouchersync_1665933632900956165").getSelectedRows();
  let voucherIds = [];
  let voucherCode = [];
  for (var i in rows) {
    let row = rows[i];
    if (visibled && !row.voucherVisible) {
      voucherIds.push(row.id);
      voucherCode.push(row.voucherCode);
    } else if (!visibled && row.voucherVisible) {
      voucherIds.push(row.id);
      voucherCode.push(row.voucherCode);
    }
  }
  if (voucherIds.length == 0) {
    cb.utils.alert("温馨提示,请选择" + (visibled ? "隐藏" : "显示") + "的凭证!", "info");
    return;
  }
  cb.utils.confirm(
    "确定要执行凭证显隐操作吗?",
    function () {
      ReactDOM.render(React.createElement(Loading), document.createElement("div"));
      let rest = cb.rest.invokeFunction(
        "AT1703B12408A00002.selfApi.setVoucherVisApi",
        { voucherIds: voucherIds.join(), visibled: visibled },
        function (err, res) {
          stop();
          if (res.rst) {
            cb.utils.alert("温馨提示,操作执行成功!", "info");
            viewModel.execute("refresh");
          }
        },
        viewModel,
        { async: true }
      );
    },
    function (args) {}
  );
}
viewModel.get("button74ob") &&
  viewModel.get("button74ob").on("click", function (data) {
    // 凭证显示--单击
    voucherSetVisible(true);
  });
viewModel.get("button77ic") &&
  viewModel.get("button77ic").on("click", function (data) {
    // 凭证重传--单击
    let idx = data.index;
    let dataRows = viewModel.getGridModel("vouchersync_1665933632900956165").getRows();
    let dataObj = dataRows[idx];
    let id = dataObj.id;
    let code = dataObj.code;
    let locked = dataObj.locked;
    if (locked != undefined && locked == 1) {
      cb.utils.alert("温馨提示，该凭证已经锁定！[" + dataObj.displayName + "]不能重传", "info");
      return;
    }
    if (!dataObj.voucherVisible) {
      cb.utils.alert("温馨提示,隐藏凭证不能重传!", "info");
      return;
    }
    if (!dataObj.isPubliced) {
      cb.utils.alert("温馨提示,非对公凭证不能重传!", "info");
      return;
    }
    if (!dataObj.syncRst) {
      if (dataObj.syncFailure && dataObj.syncFailure.includes("平台错误")) {
        //平台错误==bizid已经使用，但是未查到
      } else {
        cb.utils.alert("温馨提示,只有已经传递成功的凭证才能重传!请点击[同步U8]进行操作", "info");
        return;
      }
    }
    let voucherIds = dataObj.voucherId + "**" + dataObj.id + "**" + dataObj.voucherCode + "**" + dataObj.item84oa + "**" + dataObj.periodUnion_name + "**" + dataObj.voucherStatus;
    if (dataObj.tradeid) {
      voucherIds = voucherIds + "**" + dataObj.tradeid;
    }
    cb.utils.confirm(
      "确定要执行凭证重传到U8的操作吗?",
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.synToU8Api",
          { resend: 1, voucherIds: voucherIds },
          function (err, res) {
            stop();
            if (res.rst) {
              cb.utils.alert("温馨提示,凭证传输执行完成!成功执行" + res.successCount + "条，失败" + res.failCount + "条", "info");
              viewModel.execute("refresh");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });
viewModel.get("button82hf") &&
  viewModel.get("button82hf").on("click", function (data) {
    // 详情--单击
    let idx = data.index;
    let dataRows = viewModel.getGridModel("vouchersync_1665933632900956165").getRows();
    let dataObj = dataRows[idx];
    let voucherId = dataObj.voucherId;
    cb.utils.alert("温馨提示,您要打开凭证：" + voucherId, "info");
    window.jDiwork.openService("newvoucher", { id: voucherId });
  });
viewModel.get("button86oi") &&
  viewModel.get("button86oi").on("click", function (data) {
    // 批量锁定--单击
    let rows = viewModel.get("vouchersync_1665933632900956165").getSelectedRows();
    let voucherIds = [];
    let voucherCode = [];
    for (var i in rows) {
      let row = rows[i];
      voucherIds.push(row.id);
    }
    if (voucherIds.length == 0) {
      cb.utils.alert("温馨提示,请选择要加锁的凭证!", "info");
      return;
    }
    cb.utils.confirm(
      "确定要对所选" + voucherIds.length + "条凭证执行锁定操作吗？",
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.lockForUpdateApi",
          { voucherIds: voucherIds.join() },
          function (err, res) {
            stop();
            if (res.rst) {
              cb.utils.alert("温馨提示," + res.msg, "info");
              viewModel.execute("refresh");
            } else {
              cb.utils.alert("温馨提示," + res.msg, "error");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });
viewModel.get("button91rj") &&
  viewModel.get("button91rj").on("click", function (data) {
    //从凭证列表更新--单击
    let idx = data.index;
    let dataRows = viewModel.getGridModel("vouchersync_1665933632900956165").getRows();
    let dataObj = dataRows[idx];
    let id = dataObj.id;
    let code = dataObj.code;
    let voucherIds = dataObj.voucherId + "**" + dataObj.id + "**" + dataObj.voucherCode + "**" + dataObj.item84oa + "**" + dataObj.periodUnion_name;
    cb.utils.confirm(
      "确定后将从凭证列表更新最新的凭证内容,如果觉得内容有偏差就请执行!确定要执行该操作吗?",
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.updVoucherApi",
          { voucherIds: voucherIds },
          function (err, res) {
            stop();
            if (res.rst) {
              cb.utils.alert("温馨提示,凭证更新完成!成功执行" + res.successCount + "条，失败" + res.failCount + "条", "info");
              viewModel.execute("refresh");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });
viewModel.get("button93wh") &&
  viewModel.get("button93wh").on("click", function (data) {
    //更新U8中Code--单击
    let idx = data.index;
    let dataRows = viewModel.getGridModel("vouchersync_1665933632900956165").getRows();
    let dataObj = dataRows[idx];
    let id = dataObj.id;
    let code = dataObj.code;
    let syncRst = dataObj.syncRst;
    if (!syncRst) {
      cb.utils.alert("温馨提示,没有同步就不用更新了吧!", "info");
      return;
    }
    let voucherIds = [];
    voucherIds.push(id);
    cb.utils.confirm(
      "您确定要从U8中更新凭证同步信息?",
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.updFromU8Api",
          { voucherIds: voucherIds.join() },
          function (err, res) {
            stop();
            if (res.rst) {
              cb.utils.alert("温馨提示,凭证更新完成!成功执行" + res.successCount + "条，失败" + res.failCount + "条", "info");
              viewModel.execute("refresh");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });
viewModel.get("button96mc") &&
  viewModel.get("button96mc").on("click", function (data) {
    //从总账更新(批)--单击
    let maxCount = 50;
    let rows = viewModel.get("vouchersync_1665933632900956165").getSelectedRows();
    let voucherIds = [];
    for (var i in rows) {
      let row = rows[i];
      let reqParams = row.voucherId + "**" + row.id + "**" + row.voucherCode + "**" + row.item84oa + "**" + row.periodUnion_name;
      voucherIds.push(reqParams);
    }
    if (voucherIds.length == 0) {
      cb.utils.alert("温馨提示,请选择凭证!", "info");
      return;
    }
    if (voucherIds.length > maxCount) {
      cb.utils.alert("温馨提示,凭证传输较慢,一次最多操作" + maxCount + "条,请重选!", "info");
      return;
    }
    cb.utils.confirm(
      "确定后将从凭证列表更新最新的凭证内容,如果觉得内容有偏差就请执行!确定要执行该操作吗?",
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.updVoucherApi",
          { voucherIds: voucherIds.join() },
          function (err, res) {
            stop();
            if (res.rst) {
              cb.utils.alert("温馨提示,凭证更新完成!成功执行" + res.successCount + "条，失败" + res.failCount + "条", "info");
              viewModel.execute("refresh");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });
viewModel.get("button104th") &&
  viewModel.get("button104th").on("click", function (data) {
    //作废U8凭证--单击
    let idx = data.index;
    let dataRows = viewModel.getGridModel("vouchersync_1665933632900956165").getRows();
    let dataObj = dataRows[idx];
    let id = dataObj.id;
    let code = dataObj.code;
    let reserve2 = dataObj.reserve2;
    let syncRst = dataObj.syncRst;
    if (!syncRst) {
      cb.utils.alert("温馨提示,没有同步就不用作废了吧!", "info");
      return;
    }
    if (reserve2 == undefined || reserve2 == null || reserve2 == "") {
      cb.utils.alert("温馨提示,没有作废索引，如果需要作废请到U8中操作!", "info");
      return;
    }
    cb.utils.confirm(
      "您确定要作废U8中的凭证?YS中的凭证号是：" + dataObj.displayName,
      function () {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        let rest = cb.rest.invokeFunction(
          "AT1703B12408A00002.selfApi.delU8VApi",
          { reserve2: reserve2 },
          function (err, res) {
            stop();
            if (res.rst) {
              cb.utils.alert("温馨提示,操作成功!", "info");
              viewModel.execute("refresh");
            }
          },
          viewModel,
          { async: true }
        );
      },
      function (args) {}
    );
  });