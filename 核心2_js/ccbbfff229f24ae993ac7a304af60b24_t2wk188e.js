function org_id_name_onAfterValueChange(event) {
  var viewModel = this;
  var nowDateStr = formatDate(new Date());
  viewModel.get("billdate").setValue(nowDateStr);
  //设置时间
  function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    return y + "-" + m + "-" + d;
  }
}