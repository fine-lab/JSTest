var entityInfo;
console.log("----17----");
viewModel.get("button41qh") &&
  viewModel.get("button41qh").on("click", function (data) {
    // 导入文件--单击
    // 将自建对应字段 获取 然后对应回填
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getUdiEntityInfo", {}, function (err, res) {
      entityInfo = res.res;
      //判断是否有字段 如果没有 提示新增对应字段
      btnXml();
    });
  });
function btnXml() {
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
    let errorName;
    try {
      for (let i = 0; i < entityInfo.length; i++) {
        let feildname = entityInfo[i].interfaceFieldImport;
        errorName = feildname;
        try {
          viewModel.get(feildname).setValue(xmlDoc.getElementsByTagName(feildname)[0].childNodes[0].nodeValue);
          console.log(i + "----log info---" + feildname + "-Name-" + xmlDoc.getElementsByTagName(feildname)[0].childNodes[0].nodeValue);
        } catch (e) {
          console.error("----error---" + entityInfo[i].interfaceFieldName + "--" + e);
        }
      }
      //四个list字段
      // 获取配件详情下表
      var qylxxxList = viewModel.get("sy01_udi_product_list_qylxxxList"); //表格-UDI企业联系信息
      var lcsyxxList = viewModel.get("sy01_udi_product_list_lcsyxxList"); //UDI临床使用尺寸信息
      var ccczxxList = viewModel.get("sy01_udi_product_list_ccczxxList"); //UDI储存或操作信息
      var bzbsxxList = viewModel.get("sy01_udi_product_list_bzbsxxList"); //表格-UDI包装标识信息
      // 清空下表数据
      qylxxxList.clear();
      lcsyxxList.clear();
      ccczxxList.clear();
      bzbsxxList.clear();
      //如果都为空 直接赋值第一个为空 //表格-UDI企业联系信息
      if (xmlDoc.getElementsByTagName("contactList").length > 0) {
        for (i = 0; i < xmlDoc.getElementsByTagName("contactList").length; i++) {
          try {
            let qylxrcz = "";
            try {
              qylxrcz = xmlDoc.getElementsByTagName("qylxrcz")[i].childNodes[0].nodeValue;
            } catch (qy_e) {
              console.error("表格-UDI企业联系信息qylxrcz-error-" + qy_e);
            }
            let qylxryx = "";
            try {
              qylxryx = xmlDoc.getElementsByTagName("qylxryx")[i].childNodes[0].nodeValue;
            } catch (qy_e) {
              console.error("表格-UDI企业联系信息qylxryx-error-" + qy_e);
            }
            let qylxrdh = "";
            try {
              qylxrdh = xmlDoc.getElementsByTagName("qylxrdh")[i].childNodes[0].nodeValue;
            } catch (qy_e) {
              console.error("表格-UDI企业联系信息qylxrdh-error-" + qy_e);
            }
            let rs = {
              qylxrcz: qylxrcz === "" ? "无" : qylxrcz,
              qylxryx: qylxryx === "" ? "无" : qylxryx,
              qylxrdh: qylxrdh === "" ? "无" : qylxrdh
            };
            qylxxxList.appendRow(rs);
          } catch (qy_e) {
            console.error("表格-UDI企业联系信息-error-" + qy_e);
          }
        }
      } else {
        // 下表添加行数据
        let rs = { qylxrcz: "无" };
        qylxxxList.appendRow(rs);
      }
      //如果都为空 直接赋值第一个为空 //表格-UDI包装标识信息
      if (xmlDoc.getElementsByTagName("devicePackage").length > 0) {
        for (i = 0; i < xmlDoc.getElementsByTagName("devicePackage").length; i++) {
          try {
            let bznhxyjbzcpbs = "";
            try {
              bznhxyjbzcpbs = xmlDoc.getElementsByTagName("bznhxyjbzcpbs")[i].childNodes[0].nodeValue;
            } catch (qy_e) {
              console.error("表格-UDI包装标识信息bznhxyjbzcpbs -error-" + qy_e);
            }
            let bzcpbs = "";
            try {
              bzcpbs = xmlDoc.getElementsByTagName("bzcpbs")[i].childNodes[0].nodeValue;
            } catch (qy_e) {
              console.error("表格-UDI包装标识信息bzcpbs-error-" + qy_e);
            }
            let cpbzjb = "";
            try {
              cpbzjb = xmlDoc.getElementsByTagName("cpbzjb")[i].childNodes[0].nodeValue;
            } catch (qy_e) {
              console.error("表格-UDI包装标识信息cpbzjb-error-" + qy_e);
            }
            let bznhxyjcpbssl = "";
            try {
              bznhxyjcpbssl = xmlDoc.getElementsByTagName("bznhxyjcpbssl")[i].childNodes[0].nodeValue;
            } catch (qy_e) {
              console.error("表格-UDI包装标识信息bznhxyjcpbssl-error-" + qy_e);
            }
            let rs = {
              bznhxyjbzcpbs: bznhxyjbzcpbs === "" ? "无" : bznhxyjbzcpbs,
              bzcpbs: bzcpbs === "" ? "无" : bzcpbs,
              cpbzjb: cpbzjb === "" ? "无" : cpbzjb,
              bznhxyjcpbssl: bznhxyjcpbssl === "" ? "无" : bznhxyjcpbssl
            };
            bzbsxxList.appendRow(rs);
          } catch (qy_e) {
            console.error("表格-UDI包装标识信息-error-" + qy_e);
          }
        }
      } else {
        // 下表添加行数据
        let rs = { bznhxyjbzcpbs: "无" };
        bzbsxxList.appendRow(rs);
      }
      //如果都为空 直接赋值第一个为空 //UDI储存或操作信息
      if (xmlDoc.getElementsByTagName("deviceStorage").length > 0) {
        for (i = 0; i < xmlDoc.getElementsByTagName("deviceStorage").length; i++) {
          let zgz = "";
          try {
            zgz = xmlDoc.getElementsByTagName("zgz")[i].childNodes[0].nodeValue;
          } catch (qy_e) {
            console.error("表格-UDI储存或操作信息 zgz -error-" + qy_e);
          }
          let zdz = "";
          try {
            zdz = xmlDoc.getElementsByTagName("zdz")[i].childNodes[0].nodeValue;
          } catch (qy_e) {
            console.error("表格-UDI储存或操作信息 zdz -error-" + qy_e);
          }
          let cchcztj = "";
          try {
            cchcztj = xmlDoc.getElementsByTagName("cchcztj")[i].childNodes[0].nodeValue;
          } catch (qy_e) {
            console.error("表格-UDI储存或操作信息 cchcztj -error-" + qy_e);
          }
          let jldw = "";
          try {
            jldw = xmlDoc.getElementsByTagName("jldw")[i].childNodes[0].nodeValue;
          } catch (qy_e) {
            console.error("表格-UDI储存或操作信息 jldw -error-" + qy_e);
          }
          let rs = {
            zgz: zgz === "" ? "无" : zgz,
            zdz: zdz === "" ? "无" : zdz,
            cchcztj: cchcztj === "" ? "无" : cchcztj,
            jldw: jldw === "" ? "无" : jldw
          };
          ccczxxList.appendRow(rs);
        }
      } else {
        // 下表添加行数据
        let rs = { zgz: "无" };
        ccczxxList.appendRow(rs);
      }
      //如果都为空 直接赋值第一个为空 //UDI临床使用尺寸信息
      if (xmlDoc.getElementsByTagName("deviceClinical").length > 0) {
        for (i = 0; i < xmlDoc.getElementsByTagName("deviceClinical").length; i++) {
          let lcsycclx = "";
          try {
            lcsycclx = xmlDoc.getElementsByTagName("lcsycclx")[i].childNodes[0].nodeValue;
          } catch (e) {
            console.error("表格-UDI临床使用尺寸信息lcsycclx-error-" + e);
          }
          let ccdw = "";
          try {
            ccdw = xmlDoc.getElementsByTagName("ccdw")[i].childNodes[0].nodeValue;
          } catch (e) {
            console.error("表格-UDI临床使用尺寸信息 ccdw-error-" + e);
          }
          let ccz = "";
          try {
            ccz = xmlDoc.getElementsByTagName("ccz")[i].childNodes[0].nodeValue;
          } catch (e) {
            console.error("表格-UDI临床使用尺寸信息 ccz -error-" + e);
          }
          let rs = {
            lcsycclx: lcsycclx === "" ? "无" : lcsycclx,
            ccdw: ccdw === "" ? "无" : ccdw,
            ccz: ccz === "" ? "无" : ccz
          };
          lcsyxxList.appendRow(rs);
        }
      } else {
        // 下表添加行数据
        let rs = { lcsycclx: "无" };
        lcsyxxList.appendRow(rs);
      }
    } catch (e) {
      console.error("----error---" + errorName + "--" + e);
    }
  };
  reader.readAsText(file, "utf-8");
}