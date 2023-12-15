function loadJsXlsx(viewModel) {
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/opencomponentsystem/public/${viewModel.getParams().subId}/xlsx.core.min.js?domainKey=${viewModel.getDomainKey()}`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
var entityinfo;
viewModel.get("button41wi") &&
  viewModel.get("button41wi").on("click", function (data) {
    // 导入文件--单击
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getUdiEntityInfo", {}, function (err, res) {
      console.log("hh----" + res.res.length);
      entityinfo = res.res;
    });
    btndr(data, entityinfo);
  });
function btndr(event, entityinfo) {
  var viewModel = this;
  let fileInput = document.createElement("input");
  fileInput.id = "youridHere";
  fileInput.type = "file";
  fileInput.style = "display:none";
  document.body.insertBefore(fileInput, document.body.lastChild);
  document.getElementById("file_input_info").addEventListener("change", function (e) {
    let files = e.target.files;
    if (files.length == 0) return;
    let filesData = files[0];
    readWorkbookFromLocalFile(filesData);
  });
  document.getElementById("file_input_info").click();
}
function readWorkbookFromLocalFile(file) {
  let reader = new FileReader();
  reader.onload = function (e) {
    let localData = e.target.result;
    let xmlDoc = new DOMParser().parseFromString(localData, "text/xml");
    xmlDoc.async = false;
    console.log("----entityinfo-length--" + entityinfo.length);
    for (i = 0; i < entityinfo.length; i++) {
      console.log("----entityinfo[0].fieldName--" + entityinfo[i].interfaceFieldName);
      let entityname = entityinfo[i].interfaceFieldImport + "";
      try {
        let dataNodes = xmlDoc.getElementsByTagName(entityname + "");
        if (dataNodes.length > 0) {
          console.log("----entityname--" + entityname + "--" + dataNodes[0].childNodes[0].nodeValue + "--dataNodes.length--" + dataNodes.length);
          viewModel.get(entityname + "").setValue(dataNodes[0].childNodes[0].nodeValue);
        }
      } catch (err) {
        console.error("----fieldName error--" + entityinfo[i].interfaceFieldName + "--" + entityname);
        console.error("----fieldName error info--" + err);
      }
    }
    // 有4个子表信息 手动录取
    // 获取配件详情下表
    let gridmodel1 = viewModel.get("sy01_udi_product_list_bzbsxxList");
    // 清空下表数据
    gridmodel1.clear();
    let dtrow = { bzcpbs: "112", cpbzjb: "我22", bznhxyjcpbssl: "111" };
    // 下表添加行数据
    gridmodel1.appendRow(dtrow);
  };
  reader.readAsText(file, "UTF-8");
}
console.log("b2-------------------");