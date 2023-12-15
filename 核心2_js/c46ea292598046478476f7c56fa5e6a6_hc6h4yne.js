const gridModel = viewModel.getGridModel("staffchangeNewInfo");
setTimeout(() => {
  gridModel?.setCellState(0, "newjobgradeid_name", "disabled", false);
  gridModel?.setCellState(0, "newjobgradeid_name", "readOnly", false);
}, 1001);
gridModel?.setCellState(0, "newjobgradeid_name", "disabled", false);
gridModel?.setCellState(0, "newjobgradeid_name", "readOnly", false);
gridModel
  ?.getEditRowModel()
  ?.get("newpostid_name")
  ?.on("afterValueChange", (data) => {
    console.log(data, "data1111");
    viewModel.setCache("min_grade", data.value.oid_userDefine_1873564377899597827);
    viewModel.setCache("max_grade", data.value.oid_userDefine_1873564377899597826);
  });
gridModel
  ?.getEditRowModel()
  ?.get("newjobgradeid_name")
  ?.on("beforeBrowse", function (data) {
    let max_grade = viewModel.getCache("max_grade");
    let min_grade = viewModel.getCache("min_grade");
    if (max_grade && min_grade) {
      let condition = {
        isExtend: true,
        simpleVOs: [
          {
            field: "orderNo",
            op: "elt",
            value1: min_grade
          },
          {
            field: "orderNo",
            op: "egt",
            value1: max_grade
          }
        ]
      };
      gridModel?.getEditRowModel()?.get("newjobgradeid_name").setFilter(condition);
    } else {
      gridModel?.getEditRowModel()?.get("newjobgradeid_name")._del_data("filter");
    }
  });
gridModel
  ?.getEditRowModel()
  ?.get("newjobgradeid_name")
  .on("afterValueChange", function (data) {
    viewModel._set_data("maxrank_id", data.value.maxrank_id);
    viewModel._set_data("maxrank_id_name", data.value.maxrank_id_name);
    viewModel._set_data("minrank_id", data.value.minrank_id);
    viewModel._set_data("minrank_id_name", data.value.minrank_id_name);
  });
gridModel
  ?.getEditRowModel()
  ?.get("newjobrankid_name")
  .on("beforeBrowse", function () {
    let filter = {
      isExtend: true,
      simpleVOs: []
    };
    let maxrank_id = viewModel._get_data("maxrank_id"); //职务
    let minrank_id = viewModel._get_data("minrank_id");
    let job_maxrank_id = viewModel._get_data("job_maxrank_id"); //岗职位
    let job_minrank_id = viewModel._get_data("job_minrank_id");
    if (maxrank_id) {
      filter.simpleVOs.push({ field: "id", op: "elt", value1: maxrank_id });
    }
    if (minrank_id) {
      filter.simpleVOs.push({ field: "id", op: "egt", value1: minrank_id });
    }
    if (job_maxrank_id) {
      filter.simpleVOs.push({ field: "id", op: "elt", value1: job_maxrank_id });
    }
    if (job_minrank_id) {
      filter.simpleVOs.push({ field: "id", op: "egt", value1: job_minrank_id });
    }
    gridModel?.getEditRowModel()?.get("newjobrankid_name").setFilter(filter);
  });