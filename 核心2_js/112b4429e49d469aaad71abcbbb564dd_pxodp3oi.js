viewModel.get("extendsjdpdytj") &&
  viewModel.get("extendsjdpdytj").on("afterValueChange", function (data) {
    // 商机的判定条件--值改变后
    var selectCount = 0;
    if (data == undefined) {
      selectCount = 0;
    } else {
      if (data.value) {
        selectCount = data.value.length;
      } else {
        selectCount = data.length;
      }
    }
    viewModel.get("extendsjpd").setValue(selectCount > 2 ? "重点商机" : "一般商机");
  });
viewModel.get("extendxqcpnew") &&
  viewModel.get("extendxqcpnew").on("afterValueChange", function (data) {
    // 客户需求产品--值改变后
    updateTitle();
  });
viewModel.get("headDef!define2") &&
  viewModel.get("headDef!define2").on("afterValueChange", function (data) {
    updateTitle();
  });
function updateTitle() {
  var shijian = viewModel.get("headDef!define2").getValue();
  if (shijian == undefined || shijian == null || shijian == "") {
    shijian = "";
  } else {
    shijian = shijian.substring(0, 10);
    shijian = shijian.replaceAll("-", "");
  }
  var xpry = viewModel.get("headDef!define1_name").getValue();
  if (xpry == undefined || xpry == null) {
    xpry = "";
  }
  var xqcp = getTextFromEnumObj(viewModel.get("extendxqcpnew"));
  viewModel.get("name").setValue(shijian + xpry + xqcp);
}
function getTextFromEnumObj(enumObj, val) {
  if (val == undefined || val == null) {
    val = enumObj.getValue();
  }
  let dataArray = enumObj.__data.keyMap;
  for (var idx in dataArray) {
    let itemData = dataArray[idx];
    if (itemData.value == val) {
      return itemData.text;
    }
  }
  return "";
}