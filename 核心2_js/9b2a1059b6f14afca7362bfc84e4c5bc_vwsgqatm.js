viewModel.on("customInit", function (data) {
  //寄存供应商现存量页面--页面初始化
  viewModel.get("cvmivenderid") && viewModel.get("cvmivenderid").setVisible(false);
  const matcodeModel = viewModel.get("matcode");
  matcodeModel && matcodeModel.setVisible(false);
  // 寄存供应商现存量报表--页面初始化
  const gridModel = viewModel.getGridModel("suppxcl_1763839199117574146");
  gridModel && gridModel.setState("dataSourceMode", "local"); // 确保是local模式
  gridModel && gridModel.setShowCheckbox(false);
  //隐藏表头筛选
  gridModel &&
    gridModel.on("pageInfoChange", function () {
      debugger;
      //获取当前页码
      const pageIndex = gridModel.getPageIndex();
      //获取当前页条数
      const pageSize = gridModel.getPageSize();
      const list = gridModel.getCache("_c_list");
      gridModel.setDataSource(list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize));
      //调取API函数查询数据
      gridModel.setPageInfo({
        pageSize,
        pageIndex,
        recordCount: list.length
      });
    });
});
viewModel.on("afterMount", function () {
  const cvmivenderidName = viewModel.get("cvmivenderid_name");
  const cvmivenderid = viewModel.get("cvmivenderid");
  cb.rest.invokeFunction("AT187A679808E80006.suppxclbackapi.suppquery", {}, function (err, res) {
    if (err) {
      viewModel.get("button9ej").setVisible(false);
      viewModel.get("cvmivenderid_name").setReadOnly(true);
      viewModel.get("matcode_name").setReadOnly(true);
      cb.utils.alert("查询供应商信息错误:" + (err.message || "系统繁忙"), "error");
    } else if (res.type === "supp") {
      const { code, name } = res;
      cvmivenderid.setValue(code);
      cvmivenderidName.setReadOnly(true);
      viewModel.get("matcode_name").setVisible(false);
      cvmivenderidName.setValue(name);
    } else if (res.type !== "SL") {
      viewModel.get("button9ej").setVisible(false);
      viewModel.get("cvmivenderid_name").setReadOnly(true);
      viewModel.get("matcode_name").setReadOnly(true);
      cb.utils.alert("未知的供应商类型", "error");
    }
  });
});
viewModel.get("button9ej") &&
  viewModel.get("button9ej").on("click", function (data) {
    //查询--单击
    // 查询--单击
    // 获取弹出的列表页的表格模型
    const gridModel = viewModel.getGridModel("suppxcl_1763839199117574146");
    gridModel.setCache("_c_list", []);
    //获取表格当前页面所有的行数据
    debugger;
    const pageSize = gridModel.getPageSize() || 10;
    gridModel.setState("dataSourceMode", "local"); // 确保是local模式
    gridModel.setDataSource([]);
    console.log(viewModel.get("matcode").getValue());
    console.log(viewModel.get("cvmivenderid").getValue());
    cb.rest.invokeFunction(
      "AT187A679808E80006.suppxclbackapi.xclquery",
      {
        matcode: viewModel.get("matcode").getValue() || "",
        supcode: viewModel.get("cvmivenderid").getValue() || ""
      },
      function (err, res) {
        if (err || !res) {
          cb.utils.alert("调用nc接口错误:" + (err.message || "系统繁忙"), "error");
        } else {
          const { data } = res || {};
          if (!data) {
            return;
          }
          const jsonData = JSON.parse(data);
          if (!jsonData.list || jsonData.list.length === 0) {
            cb.utils.alert("未查询到符合条件的数据", "warning");
            return;
          }
          const list = jsonData.list || [];
          const len = list.length;
          list.forEach((v) => {
            v["matcode_name"] = v.matcode;
            v["cvmivenderid_name"] = v.cvmivenderid;
          });
          gridModel.setCache("_c_list", list);
          gridModel.setState("dataSourceMode", "local"); // 确保是local模式
          gridModel.setDataSource(list.slice(0, pageSize));
          gridModel.setPageInfo({
            pageSize: pageSize,
            pageIndex: 1,
            recordCount: len
          });
        }
      }
    );
  });
viewModel.get("suppxcl_1763839199117574146") &&
  viewModel.get("suppxcl_1763839199117574146").on("beforeDblClick", function (data) {
    //表格--行双击前执行
    return false;
  });