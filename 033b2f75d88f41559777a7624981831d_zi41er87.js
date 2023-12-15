viewModel.get("wenben") &&
  viewModel.get("wenben").on("afterValueChange", function (data) {
    // 文本--值改变后
    viewModel
      .get("zidingyi")
      .setValue({
        yptcsb_wl_WB: "特征文本",
        yptcsb_wl_ZX: 99,
        yptcsb_wl_SZ: 8.88,
        yptcsb_wl_BE: true,
        yptcsb_wl_RQ: "2023-03-01",
        yptcsb_wl_RQSJ: "2022-07-25 00:00:02",
        yptcsb_wl_SJ: "14:40:55",
        yptcsb_wl_JBDA_name: "EMS",
        yptcsb_wl_JBDA: "1590923867579220727",
        yptcsb_wl_ZDYDA: "1671906369275428867",
        yptcsb_wl_ZDYDA_name: "YPTSCB"
      });
  });
viewModel.get("product_name") &&
  viewModel.get("product_name").on("beforeValueChange", function (data) {
    // 物料(系统)--值改变前
    viewModel.get("productFreeCT") &&
      viewModel.get("productFreeCT").on("afterCharacterModels", function () {
        viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_WB").setValue("特征组文本");
        viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_SZ").setValue(99.9);
        viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_ZX").setValue(100);
        viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_BE").setValue(true);
        viewModel
          .get("productFreeCT")
          .getCharacterModel("yptcsb_wl_JBDA")
          .setValue([{ id: "youridHere", name: "EMS" }]);
        viewModel
          .get("productFreeCT")
          .getCharacterModel("yptcsb_wl_ZDYDA")
          .setValue([{ id: "youridHere", name: "YPTSCB" }]);
        viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_RQ").setValue("2023-03-01");
        viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_SJ").setValue("19:08:45");
        viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_RQSJ").setValue("2022-07-25 00:00:02");
        viewModel.get("productFreeCT").get("yptcsb_wl_WB") &&
          viewModel
            .get("productFreeCT")
            .get("yptcsb_wl_WB")
            .on("blur", function (data) {
              const a1 = viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_ZX").getValue();
              const a2 = viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_BE").getValue();
              const a3 = viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_RQSJ").getValue();
              const a4 = viewModel.get("productFreeCT").getCharacterModel("yptcsb_wl_ZDYDA").__data.select.name;
              let aa = a1 + "+" + a2 + "+" + a3 + "+" + a4;
              cb.utils.confirm(aa);
            });
      });
  });
viewModel.get("zidingyi") &&
  viewModel.get("zidingyi").get("yptcsb_wl_JBDA") &&
  viewModel
    .get("zidingyi")
    .get("yptcsb_wl_JBDA")
    .on("afterReferOkClick", function (data) {
      const a1 = viewModel.get("zidingyi").getCharacterModel("yptcsb_wl_WB").getValue();
      const a2 = viewModel.get("zidingyi").getCharacterModel("yptcsb_wl_SZ").getValue();
      const a3 = viewModel.get("zidingyi").getCharacterModel("yptcsb_wl_RQ").getValue();
      const a4 = viewModel.get("zidingyi").getCharacterModel("yptcsb_wl_JBDA").__data.select.name;
      let aa = a1 + "+" + a2 + "+" + a3 + "+" + a4;
      viewModel.get("beizhu").setValue(aa);
    });
viewModel.get("beizhu") &&
  viewModel.get("beizhu").on("blur", function (data) {
    // 备注--失去焦点的回调
    viewModel.get("zitezhengList") &&
      viewModel
        .get("zitezhengList")
        .getEditRowModel()
        .get("zidingyi")
        ._set_data("cDefaultValue", {
          yptcsb_wl_WB: "子表特征文本",
          yptcsb_wl_ZX: 99,
          yptcsb_wl_SZ: 8.88,
          yptcsb_wl_BE: true,
          yptcsb_wl_RQ: "2023-03-01",
          yptcsb_wl_RQSJ: "2022-07-25 00:00:02",
          yptcsb_wl_SJ: "14:40:55",
          yptcsb_wl_JBDA_name: "EMS",
          yptcsb_wl_JBDA: "1590923867579220727",
          yptcsb_wl_ZDYDA: "1671906369275428867",
          yptcsb_wl_ZDYDA_name: "YPTSCB"
        });
  });
viewModel.get("zitezhengList") &&
  viewModel.get("zitezhengList").getEditRowModel() &&
  viewModel.get("zitezhengList").getEditRowModel().get("wenben") &&
  viewModel
    .get("zitezhengList")
    .getEditRowModel()
    .get("wenben")
    .on("blur", function (data) {
      // 文本--失去焦点的回调
      viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_WB").setValue("子表特征组文本");
      viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_SZ").setValue(77.7);
      viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_ZX").setValue(101);
      viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_BE").setValue(true);
      viewModel
        .get("zitezhengList")
        .getRowModel(0)
        .get("productFreeCT")
        .getCharacterModel("yptcsb_wl_JBDA")
        .setValue([{ id: "youridHere", name: "EMS" }]);
      viewModel
        .get("zitezhengList")
        .getRowModel(0)
        .get("productFreeCT")
        .getCharacterModel("yptcsb_wl_ZDYDA")
        .setValue([{ id: "youridHere", name: "YPTSCB" }]);
      viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_RQ").setValue("2023-03-03");
      viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_SJ").setValue("21:08:45");
      viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_RQSJ").setValue("2023-02-25 00:00:02");
      let zi01 = viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_WB").getValue();
      let zi02 = viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_ZX").getValue();
      let zi03 = viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_JBDA").__data.select.name;
      let zi04 = viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_RQ").getValue();
      let tzznr = zi01 + "+" + zi02 + "+" + zi03 + "+" + zi04;
      let zi05 = viewModel.get("zitezhengList").getEditRowModel(0).get("zidingyi").get("yptcsb_wl_BE").getValue();
      let zi06 = viewModel.get("zitezhengList").getEditRowModel(0).get("zidingyi").get("yptcsb_wl_SZ").getValue();
      let zi07 = viewModel.get("zitezhengList").getEditRowModel(0).get("zidingyi").get("yptcsb_wl_ZDYDA").__data.text;
      let zi08 = viewModel.get("zitezhengList").getEditRowModel(0).get("zidingyi").get("yptcsb_wl_RQSJ").getValue();
      let tznr = zi05 + "+" + zi06 + "+" + zi07 + "+" + zi08;
      cb.utils.confirm("子表特征组内容为:" + tzznr + "特征内容为:" + tznr);
    });
viewModel.get("zitezhengList") &&
  viewModel.get("zitezhengList").getEditRowModel() &&
  viewModel.get("zitezhengList").getEditRowModel().get("ctrttype") &&
  viewModel
    .get("zitezhengList")
    .getEditRowModel()
    .get("ctrttype")
    .on("blur", function (data) {
      // 合同期限类型--失去焦点的回调
      let zi01 = viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_WB").getValue();
      let zi02 = viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_ZX").getValue();
      let zi03 = viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_JBDA").__data.select.name;
      let zi04 = viewModel.get("zitezhengList").getRowModel(0).get("productFreeCT").getCharacterModel("yptcsb_wl_RQ").getValue();
      let tzznr = zi01 + "+" + zi02 + "+" + zi03 + "+" + zi04;
      let zi05 = viewModel.get("zitezhengList").getRowModel(0).get("zidingyi").yptcsb_wl_BE;
      let zi06 = viewModel.get("zitezhengList").getRowModel(0).get("zidingyi").yptcsb_wl_SZ;
      let zi07 = viewModel.get("zitezhengList").getRowModel(0).get("zidingyi").yptcsb_wl_ZDYDA_name;
      let zi08 = viewModel.get("zitezhengList").getRowModel(0).get("zidingyi").yptcsb_wl_RQSJ;
      let tznr = zi05 + "+" + zi06 + "+" + zi07 + "+" + zi08;
      cb.utils.confirm("子表特征组内容为:" + tzznr + "特征内容为:" + tznr);
    });