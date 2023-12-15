viewModel.on("afterRule", function (event) {
  debugger;
  let org_id_name = viewModel.get("org_id_name").getValue();
  if (org_id_name == undefined || org_id_name == "") {
    return;
  }
  let shiyebu = viewModel.get("shiyebu").getValue();
  if (shiyebu != undefined && shiyebu != "") {
    return;
  }
  let org_id = viewModel.get("org_id").getValue();
  let val = 1;
  if (org_id == "1573825602524807244" || org_id == "1573825602524807247" || org_id == "1573825602524807249") {
    //环保
    val = 2;
  } else if (org_id == "1573825602524807175" || org_id == "1573825602524807176" || org_id == "1573825602524807180") {
    //建机
    val = 1;
  } else if (org_id == "1573825602524807245") {
    //游乐
    val = 3;
  }
  viewModel.get("shiyebu").setValue(val);
});