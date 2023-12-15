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
const storeprofilelist = viewModel.getGridModel("wine_labels_bList");
viewModel.get("wine_type") &&
  viewModel.get("wine_type").on("afterValueChange", function (data) {
    if (data) {
      let text = viewModel.get("wine_type").getValue();
      if (text) {
        if (text != "not_universal") {
          //酒标类型--值改变后
          cb.rest.invokeFunction("GT80750AT4.wineLabels.getSubPlatform", {}, function (err, res) {
            let result = res.data;
            debugger;
            if (result !== undefined) {
              storeprofilelist.deleteAllRows();
              for (var i = 0; i < result.length; i++) {
                storeprofilelist.appendRow({
                  platform_id_name: result[i].name,
                  platform_code: result[i].code,
                  used_count: 0,
                  platform_id: result[i].id
                });
              }
            }
          });
        } else {
          storeprofilelist.deleteAllRows();
        }
      }
    }
  });