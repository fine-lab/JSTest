viewModel.on("customInit", function (data) {
  // 通用报销单--页面初始化
  var girdModel = viewModel.getGridModel("expapportions");
  girdModel
    .getEditRowModel()
    .get("expapportionuserdefs!define4_name")
    .on("beforeBrowse", function (data) {
      let vdef19 = girdModel.getEditRowModel().get("caccountorg").getValue();
      let orgid = viewModel.get("caccountorg").getValue();
      let treeCondition = {
        isExtend: true,
        simpleVOs: []
      };
      let treeConditionObj = {
        logicOp: "or",
        conditions: [
          {
            field: "parentorgid",
            op: "eq",
            value1: orgid
          },
          {
            field: "code",
            op: "in",
            value1: ["05", "06", "07", "11", "12"]
          }
        ]
      };
      if (orgid == "1573823489411383310") {
        treeConditionObj = {
          field: "code",
          op: "nin",
          value1: ["GL02", "GL03", "GL04", "GL05", "GL06", "GL07", "GL08", "GL09", "GL10", "GL11", "GL12", "GL13", "GL14", "GL15", "GL16"]
        };
      }
      treeCondition.simpleVOs.push(treeConditionObj);
      this.setTreeFilter(treeCondition);
    });
  girdModel
    .getEditRowModel()
    .get("expapportionuserdefs!define2_name")
    .on("beforeBrowse", function (data) {
      let vdef19 = girdModel.getEditRowModel().get("caccountorg").getValue();
      let orgid = viewModel.get("caccountorg").getValue();
      let treeCondition = {
        isExtend: true,
        simpleVOs: []
      };
      let op = "eq";
      treeCondition.simpleVOs.push({
        field: "mainJobList.org_id",
        op: op,
        value1: orgid
      });
      this.setFilter(treeCondition);
    });
  return;
  girdModel
    .getEditRowModel()
    .get("expapportionuserdefs!define1_name")
    .on("beforeBrowse", function (data) {
      let vdef19 = girdModel.getEditRowModel().get("caccountorg").getValue();
      let orgid = viewModel.get("caccountorg").getValue();
      if (vdef19 == "1573823489411383310") {
        //国立控股  不控制
        this.setFilter({
          isExtend: true,
          simpleVOs: []
        });
        return;
      }
      let treeCondition = {
        isExtend: true,
        simpleVOs: []
      };
      treeCondition.simpleVOs.push({
        field: "orgid",
        op: "eq",
        value1: orgid
      });
      this.setFilter(treeCondition);
    });
});
viewModel.get("pk_handlepsn_name") &&
  viewModel.get("pk_handlepsn_name").on("beforeBrowse", function (data) {
    //报销人--参照弹窗打开前
    let op = "eq";
    let mainOrgId = "yourIdHere"; //河南国立控股有限公司
    let condition = {
      isExtend: true,
      simpleVOs: [
        {
          field: "mainJobList.org_id",
          op: op,
          value1: mainOrgId
        }
      ]
    };
    viewModel.get("pk_handlepsn_name").setFilter(condition);
    setTimeout(function () {
      console.log("test");
    }, 1000);
  });
viewModel.get("pk_handlepsn_name") &&
  viewModel.get("pk_handlepsn_name").on("afterMount", function (data) {
    //报销人--参照加载完成后
    console.log("afterBrowse");
  });