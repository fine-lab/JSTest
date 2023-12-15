// 批量通过
viewModel.get("button0if").on("click", (params) => {
  batchUpdate("1");
});
// 批量不通过
viewModel.get("button2sk").on("click", (params) => {
  batchUpdate("2");
});
// 查看评审结果
viewModel.get("button5rb").on("click", (params) => {
  // 弹窗查看各评委打分结果
  const grid = viewModel.getGridModel();
  const rows = grid.getSelectedRows();
  if (rows.length <= 0 || rows.length > 1) {
    cb.utils.alert("请先选择1数据");
    return false;
  }
  let data = {
    billtype: "VoucherList", // 单据类型
    billno: "psmxpwlistList", // 单据号
    params: {
      readOnly: true, // 预览时，一定为true，否则不加载详情数据o
      mode: "browse", // 须传mode + 单据id + readOnly:false
      id: rows[0].id
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
});
// 发布公示
viewModel.get("button9wi").on("click", (params) => {
  // 同步数据到【持证信息管理】
  const grid = viewModel.getGridModel();
  const rows = grid.getSelectedRows();
  if (rows.length <= 0) {
    cb.utils.alert("请先选择数据");
    return false;
  }
  let _rows = [];
  const hasInvilidateRow = rows.find((item) => {
    _rows.push({
      uname: item.uname,
      uname_name: item.uname_name,
      uidno: item.uidno,
      unit: item.unit,
      unit_name: item.unit_name,
      udept: item.udept,
      udept_name: item.udept_name,
      shbaozc: item.shbaozc,
      shbaozc_name: item.shbaozc_name,
      shbaoxulie: item.shbaoxulie,
      shbaolevel: item.shbaolevel,
      getzcdate: new Date().format("yyyy-MM-dd"),
      getzcorg: item.unit,
      getzcorg_name: item.unit_name,
      zsno: `CZXX-${new Date().format("yyyy")}-${Date.now().toString().slice(2, -1)}`,
      fzdate: new Date().format("yyyy-MM-dd")
    });
    return !item.shengconfstatus;
  });
  if (hasInvilidateRow) {
    cb.utils.alert("选中数据含有未审批数据", "info");
    return false;
  }
  cb.rest.invokeFunction(
    "AT15C31CE017B00008.backend.appendRow",
    {
      url: "AT15C31CE017B00008.AT15C31CE017B00008.zhengjinfomg",
      object: _rows,
      billNo: "zhengjinfomgList"
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
        return false;
      }
      if (res && res.data) {
        cb.utils.alert("操作成功", "success");
        batchUpdateHd(rows);
        viewModel.execute("refresh");
      }
    }
  );
});
function batchUpdate(val) {
  const grid = viewModel.getGridModel();
  const rows = grid.getSelectedRows();
  if (rows.length <= 0) {
    cb.utils.alert("请先选择数据");
    return false;
  }
  const _rows = rows.map((item) => {
    return {
      id: item.id,
      shengconfstatus: val
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
// 更新评审活动状态
function batchUpdateHd(rows) {
  const _rows = rows.map((item) => {
    return {
      id: item.pshuodongid,
      hdstatus: "3"
    };
  });
  cb.rest.invokeFunction(
    "AT15C31CE017B00008.backend.batchUpdateData",
    {
      url: "AT15C31CE017B00008.AT15C31CE017B00008.pshd",
      object: _rows,
      billNo: "pshdList" //viewModel.getParams().billNo
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
        return false;
      }
      if (res && res.data) {
        console.log("更新评审活动状态成功");
      }
    }
  );
}