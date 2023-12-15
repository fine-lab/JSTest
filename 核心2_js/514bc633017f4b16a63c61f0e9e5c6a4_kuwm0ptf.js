viewModel.on("beforeSave", function (args) {
  debugger;
  var jsonString = args.data.data;
  // 解析 JSON 字符串为对象
  var obj = JSON.parse(jsonString);
  // 向对象添加键值对
  obj.submit_date = formatDate(new Date());
  var updatedJsonString = JSON.stringify(obj);
  args.data.data = updatedJsonString;
  function formatDate(date) {
    var month = date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }
});