viewModel.on("customInit", function (data) {
  //车辆详情
  viewModel.get("vehicle_name_vmainlicense").on("beforeBrowse", function (data) {
    let carrier_supplier = viewModel.get("carrier_supplier").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "ccarrierid",
      op: "eq",
      value1: carrier_supplier
    });
    this.setFilter(condition);
  });
  //驾驶员
  viewModel.get("driver_name").on("beforeBrowse", function (data) {
    let carrier_supplier = viewModel.get("carrier_supplier").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "pk_carrier",
      op: "eq",
      value1: carrier_supplier
    });
    this.setFilter(condition);
  });
  //发货员
  viewModel.get("consignor_name").on("beforeBrowse", function (data) {
    let org_id = viewModel.get("org_id").getValue(); //1536777171557679110
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: org_id
    });
    this.setFilter(condition);
  });
});