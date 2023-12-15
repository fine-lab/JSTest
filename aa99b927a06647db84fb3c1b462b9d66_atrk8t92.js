//查询过滤，过滤掉已经复核的
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "hdstatus",
    op: "eq",
    value1: 2
  });
});
// 批量审核通过
viewModel.get("button9dd").on("click", (params) => {
  updateData("1");
});
// 批量审核不通过
viewModel.get("button15zh").on("click", (params) => {
  updateData("2");
});
// 分发评审
viewModel.get("button22qb").on("click", (params) => {
  const grid = viewModel.getGridModel();
  const rows = grid.getSelectedRows();
  const hasInvalidate = rows.find((item) => {
    return item.shenhestatus != "1";
  });
  if (hasInvalidate) {
    cb.utils.alert("所选数据包含非法数据", "error");
    return false;
  }
  let data = {
    billtype: "VoucherList", // 单据类型
    billno: "juryInformation01List", // 单据号
    params: {
      readOnly: true, // 预览时，一定为true，否则不加载详情数据
      mode: "browse" // 须传mode + 单据id + readOnly:false
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
});
// 分发评审确认
viewModel.on("afterPwRefClick", (args) => {
  if (args && args.length > 0) {
    const grid = viewModel.getGridModel();
    const rows = grid.getSelectedRows();
    let _rows = rows.map((rowItem) => {
      let arr = [],
        zhushen = {};
      args.forEach((item) => {
        if (item.shifupingweihuizhuren == "yes") {
          zhushen = item;
        }
        arr.push({
          pwname_name: item.renyuanxingming_zjname_name,
          pwname: item.renyuanxingming_zjname,
          pwgzdanwei_name: item.bumen_name,
          pwgzdanwei: item.bumen,
          zhichenglevel: item.zhichendengji,
          pwdianhua: item.dianhua,
          psmx_id: rowItem.id,
          _status: "Insert"
        });
      });
      return {
        id: rowItem.id,
        pwpingshenList: arr,
        zhushen_renyuanxingming_zjname_name: zhushen.renyuanxingming_zjname_name,
        zhushen: zhushen.id
      };
    });
    cb.rest.invokeFunction(
      "AT15C31CE017B00008.backend.batchUpdateData",
      {
        url: "AT15C31CE017B00008.AT15C31CE017B00008.psmx",
        object: _rows,
        billNo: viewModel.getParams().billNo
      },
      function (err, res) {
        if (err) {
          cb.utils.alert(err, "error");
          return false;
        }
        if (res && res.data) {
          cb.utils.alert("操作成功", "success");
          viewModel.execute("refresh");
        }
      }
    );
  }
});
function updateData(val) {
  const grid = viewModel.getGridModel();
  const rows = grid.getSelectedRows();
  const hasInvalidate = rows.find((item) => {
    return item.shenhestatus;
  });
  if (hasInvalidate) {
    cb.utils.alert("所选数据包含非法数据", "error");
    return false;
  }
  let _rows = rows.map((item) => {
    return { id: item.id, shenhestatus: val };
  });
  cb.rest.invokeFunction(
    "AT15C31CE017B00008.backend.batchUpdateData",
    {
      url: "AT15C31CE017B00008.AT15C31CE017B00008.psmx",
      object: _rows,
      billNo: viewModel.getParams().billNo
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
        return false;
      }
      if (res && res.data) {
        cb.utils.alert("操作成功", "success");
        viewModel.execute("refresh");
      }
    }
  );
}