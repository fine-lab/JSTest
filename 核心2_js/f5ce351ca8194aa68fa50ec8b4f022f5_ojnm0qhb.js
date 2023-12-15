//加载自定义CSS start
var headobj = document.getElementsByTagName("head")[0];
var style = document.createElement("style");
style.type = "text/css";
headobj.appendChild(style);
style.sheet.insertRule(".fixwidth {width: 600px}", 0);
//加载自定义CSS end
viewModel.on("modeChange", function (data) {
  let materialClassName = viewModel.get("pk_marbasclass_name").getValue();
  if (materialClassName == undefined || materialClassName == "" || materialClassName == null) {
    viewModel.get("item48ib").setValue("02");
    viewModel.get("pk_material_name").setVisible(true);
    viewModel.get("item100ye").setVisible(true);
    viewModel.get("pk_marbasclass_name").setVisible(false);
    viewModel.get("item77ve").setVisible(false);
  } else {
    viewModel.get("item48ib").setValue("01");
    viewModel.get("pk_marbasclass_name").setVisible(true);
    viewModel.get("item77ve").setVisible(true);
    viewModel.get("pk_material_name").setVisible(false);
    viewModel.get("item100ye").setVisible(false);
  }
});
viewModel.get("item48ib") &&
  viewModel.get("item48ib").on("afterValueChange", function (data) {
    //分配方式--值改变后
    var fpfs = viewModel.get("item48ib").getValue();
    if (fpfs == "01") {
      //物料分类
      viewModel.get("pk_marbasclass_name").setVisible(true);
      viewModel.get("item77ve").setVisible(true);
      viewModel.get("pk_material_name").setVisible(false);
      viewModel.get("item100ye").setVisible(false);
      viewModel.get("pk_material").setValue(null);
      viewModel.get("pk_material_name").setValue(null);
      viewModel.get("item100ye").setValue(null);
    } else {
      viewModel.get("pk_marbasclass_name").setVisible(false);
      viewModel.get("item77ve").setVisible(false);
      viewModel.get("pk_material_name").setVisible(true);
      viewModel.get("item100ye").setVisible(true);
      viewModel.get("pk_marbasclass").setValue(null);
      viewModel.get("pk_marbasclass_name").setValue(null);
      viewModel.get("item77ve").setValue(null);
    }
  });
viewModel.get("pk_material_name").on("beforeBrowse", function () {
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "productOrgs.orgId",
    op: "eq",
    value1: viewModel.get("org_id").getValue()
  });
  this.setFilter(condition);
});
viewModel.on("beforeSave", function (args) {
  var tmgz = viewModel.get("pk_config_name").getValue();
  if (tmgz == null) {
    cb.utils.alert("请选择条码规则");
    return false;
  }
  var fpfs = viewModel.get("item48ib").getValue();
  if (fpfs == "01") {
    var wlfl = viewModel.get("item77ve").getValue();
    if (wlfl == undefined || wlfl == null || wlfl == "") {
      cb.utils.alert("请选择物料分类");
      return false;
    }
  } else if (fpfs == "02") {
    var wl = viewModel.get("item100ye").getValue();
    if (wl == undefined || wl == null || wl == "") {
      cb.utils.alert("请选择物料");
      return false;
    }
  }
  //校验规则是否分配重复
  const isdefault = viewModel.get("isdefault").getValue();
  if (isdefault) {
    const proxy = viewModel.setProxy({
      queryData: {
        url: "scmbc/bardistribute/check",
        method: "get"
      }
    });
    const pk_marbasclass = viewModel.get("pk_marbasclass").getValue() || "";
    const pk_material = viewModel.get("pk_material").getValue() || "";
    const orgid = viewModel.get("org_id").getValue();
    const pk_distribute = viewModel.get("id").getValue();
    const pk_config = viewModel.get("pk_config").getValue();
    const vmemo = viewModel.get("vmemo").getValue();
    //传参
    const param = { pk_marbasclass, pk_material, orgid, pk_distribute, pk_config, vmemo };
    const result = proxy.queryDataSync(param);
    if (!result.error.success) {
      cb.utils.alert(result.error.msg, "error");
      return false;
    }
  }
});
//没必要校验是否生成条码打印数据 2023-5-23 xhs comment out