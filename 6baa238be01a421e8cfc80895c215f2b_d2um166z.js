function distributeModeAfterChange(event) {
  var viewModel = this;
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
}