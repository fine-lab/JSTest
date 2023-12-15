viewModel.get("wine_body_id_new_name") &&
  viewModel.get("wine_body_id_new_name").on("beforeBrowse", function (data) {
    //酒体参照新--参照弹窗打开前
    let simpleConditions = [];
    simpleConditions.push({
      field: "code",
      op: "leftlike",
      value1: "000002"
    });
    simpleConditions.push({
      field: "code",
      op: "leftlike",
      value1: "00001"
    });
    let condition = { isExtend: true, simpleVOs: [] };
    condition.simpleVOs.push({
      logicOp: "or",
      conditions: simpleConditions
    });
    this.setTreeFilter(condition);
  });