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
  if (org_id == "1568715003641462912" || org_id == "1568715003641462914" || org_id == "1568715003641462918") {
    //环保
    val = 2;
  } else if (org_id == "1568715003641462819" || org_id == "1568715003641462820" || org_id == "1568715003641462822") {
    //建机
    val = 1;
  } else if (org_id == "1568715003641462917") {
    //游乐
    val = 3;
  }
  viewModel.get("shiyebu").setValue(val);
});