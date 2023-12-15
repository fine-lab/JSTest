var entityInfo;
let dataInfoNum = 0; //新增查询的数量 如果存在 则提示不能在导入 只能更新
viewModel.get("button43lh").setVisible(false);
if (viewModel.getParams().mode === "add" || viewModel.getParams().mode === "edit") {
  viewModel.get("button43lh").setVisible(true);
}
//监听页面状态变化系统预制钩子函数modeChange
//例子：新增页面，按钮的显示/隐藏
viewModel.on("modeChange", function (data) {
  if (data === "add") {
    viewModel.get("button43lh").setVisible(true);
  } else if (data === "edit") {
    viewModel.get("button43lh").setVisible(true);
  } else {
    viewModel.get("button43lh").setVisible(false);
  }
});
viewModel.get("button43lh") &&
  viewModel.get("button43lh").on("click", function (data) {
    // 导入文件--单击
    // 将自建对应字段 获取 然后对应回填
    dataInfoNum = 0;
    cb.rest.invokeFunction(
      "ISVUDI.publicFunction.shareApi",
      {
        //传入参数 sqlType：类型
        sqlType: "check",
        sqlTableInfo: "select * from ISVUDI.ISVUDI.sy01_country_interface_datav2 where dr = 0",
        sqlCg: "sy01"
      },
      function (err, res) {
        entityInfo = res.resDataRs;
        //判断是否有字段 如果没有 提示新增对应字段
        btnXml();
      }
    );
  });
function btnXml() {
  let fileInput = document.createElement("input");
  fileInput.id = "youridHere";
  fileInput.type = "file";
  fileInput.style = "display:none";
  document.body.insertBefore(fileInput, document.body.lastChild);
  document.getElementById("file_input_info").addEventListener("change", function (e) {
    let files = e.target.files;
    if (files.length === 0) return;
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
      let zxid = xmlDoc.getElementsByTagName("zxxsdycpbs")[0].childNodes[0].nodeValue;
      let rsNum = getBsInfo(zxid);
      if (rsNum > 0) {
        cb.utils.confirm(
          "该产品标识已经存在,请到对应标识下进行更新!" + zxid,
          () => {
          },
          () => {
          }
        );
        return;
      }
      for (let i = 0; i < entityInfo.length; i++) {
        let feildname = entityInfo[i].interfaceFieldImport;
        errorName = feildname;
        try {
          if (
            xmlDoc.getElementsByTagName(feildname)[0].childNodes[0] === "" ||
            xmlDoc.getElementsByTagName(feildname)[0].childNodes[0] === "" ||
            typeof xmlDoc.getElementsByTagName(feildname)[0].childNodes[0] == "undefined"
          ) {
            continue;
          }
          viewModel.get(feildname).setValue(xmlDoc.getElementsByTagName(feildname)[0].childNodes[0].nodeValue);
          console.log(i + "----log info---" + feildname + "-Name-" + xmlDoc.getElementsByTagName(feildname)[0].childNodes[0].nodeValue);
        } catch (e) {
          console.error("----error---" + entityInfo[i].interfaceFieldName + "--" + e);
        }
      }
      //四个list字段
      // 获取配件详情下表
      var qylxxxList = viewModel.get("sy01_udi_product_list_qylxxxv2List"); //表格-UDI企业联系信息
      var lcsyxxList = viewModel.get("sy01_udi_product_list_lcsyxxv2List"); //UDI临床使用尺寸信息
      var ccczxxList = viewModel.get("sy01_udi_product_list_ccczxxv2List"); //UDI储存或操作信息
      var bzbsxxList = viewModel.get("sy01_udi_product_list_bzbsxxv2List"); //表格-UDI包装标识信息
      // 清空下表数据
      qylxxxList.clear();
      lcsyxxList.clear();
      ccczxxList.clear();
      bzbsxxList.clear();
      //如果都为空 直接赋值第一个为空 //表格-UDI企业联系信息 companyContactList
      let companyNum = 0;
      if (xmlDoc.getElementsByTagName("contactList") != null && typeof xmlDoc.getElementsByTagName("contactList") != "undefined") {
        companyNum = xmlDoc.getElementsByTagName("contactList").length;
      }
      if (companyNum === 0 && xmlDoc.getElementsByTagName("companyContactList") != null && typeof xmlDoc.getElementsByTagName("companyContactList") != "undefined") {
        companyNum = xmlDoc.getElementsByTagName("companyContactList").length;
      }
      if (companyNum > 0) {
        for (let i = 0; i < companyNum; i++) {
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
              qylxrcz: qylxrcz === "" ? "" : qylxrcz,
              qylxryx: qylxryx === "" ? "" : qylxryx,
              qylxrdh: qylxrdh === "" ? "" : qylxrdh
            };
            qylxxxList.appendRow(rs);
          } catch (qy_e) {
            console.error("表格-UDI企业联系信息-error-" + qy_e);
          }
        }
      } else {
        // 下表添加行数据
        let rs = { qylxrcz: "" };
        qylxxxList.appendRow(rs);
      }
      //如果都为空 直接赋值第一个为空 //表格-UDI包装标识信息
      //默认要加载导入最小包装标识
      let packageNum = 0;
      if (xmlDoc.getElementsByTagName("devicePackage") != null && typeof xmlDoc.getElementsByTagName("devicePackage") != "undefined") {
        packageNum = xmlDoc.getElementsByTagName("devicePackage").length;
      }
      if (packageNum === 0 && xmlDoc.getElementsByTagName("packingInfoList") != null && typeof xmlDoc.getElementsByTagName("packingInfoList") != "undefined") {
        packageNum = xmlDoc.getElementsByTagName("packingInfoList").length;
      }
      if (packageNum > 0) {
        //如果都为空，则启动默认最小，如果长度大于1，则默认添加一个最小包装标识
        for (let i = 0; i < packageNum; i++) {
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
            //如果都为空，则启动默认最小，如果长度大于1，则默认添加一个最小包装标识
            let rs = {
              bznhxyjbzcpbs: bznhxyjbzcpbs === "" ? "" : bznhxyjbzcpbs,
              bzcpbs: bzcpbs === "" ? "" : bzcpbs,
              cpbzjb: cpbzjb === "" ? "" : cpbzjb,
              bznhxyjcpbssl: bznhxyjcpbssl === "" ? "" : bznhxyjcpbssl
            };
            bzbsxxList.appendRow(rs);
          } catch (qy_e) {
            console.error("表格-UDI包装标识信息-error-" + qy_e);
          }
        }
      }
      //导入完标识 加载默认最小标识
      let zxbsrs2 = {
        bzcpbs: xmlDoc.getElementsByTagName("zxxsdycpbs")[0].childNodes[0].nodeValue,
        bznhxyjbzcpbs: xmlDoc.getElementsByTagName("zxxsdycpbs")[0].childNodes[0].nodeValue,
        cpbzjb: "最小销售单元产品标识",
        bznhxyjcpbssl: xmlDoc.getElementsByTagName("zxxsdyzsydydsl")[0].childNodes[0].nodeValue //
      };
      bzbsxxList.appendRow(zxbsrs2);
      //如果都为空 直接赋值第一个为空 //UDI储存或操作信息 storageInfoList
      let storageNum = 0;
      if (xmlDoc.getElementsByTagName("deviceStorage") != null && typeof xmlDoc.getElementsByTagName("deviceStorage") != "undefined") {
        storageNum = xmlDoc.getElementsByTagName("deviceStorage").length;
      }
      if (storageNum === 0 && xmlDoc.getElementsByTagName("storageInfoList") != null && typeof xmlDoc.getElementsByTagName("storageInfoList") != "undefined") {
        storageNum = xmlDoc.getElementsByTagName("storageInfoList").length;
      }
      if (storageNum > 0) {
        for (let i = 0; i < storageNum; i++) {
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
            zgz: zgz === "" ? "" : zgz,
            zdz: zdz === "" ? "" : zdz,
            cchcztj: cchcztj === "" ? "" : cchcztj,
            jldw: jldw === "" ? "" : jldw
          };
          ccczxxList.appendRow(rs);
        }
      } else {
        // 下表添加行数据
        let rs = { zgz: "" };
        ccczxxList.appendRow(rs);
      }
      //如果都为空 直接赋值第一个为空 //UDI临床使用尺寸信息 clinicalInfoList
      let clinicalNum = 0;
      if (xmlDoc.getElementsByTagName("deviceClinical") != null && typeof xmlDoc.getElementsByTagName("deviceClinical") != "undefined") {
        clinicalNum = xmlDoc.getElementsByTagName("deviceClinical").length;
      }
      if (clinicalNum === 0 && xmlDoc.getElementsByTagName("clinicalInfoList") != null && typeof xmlDoc.getElementsByTagName("clinicalInfoList") != "undefined") {
        clinicalNum = xmlDoc.getElementsByTagName("clinicalInfoList").length;
      }
      if (clinicalNum > 0) {
        for (let i = 0; i < clinicalNum; i++) {
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
            lcsycclx: lcsycclx === "" ? "" : lcsycclx,
            ccdw: ccdw === "" ? "" : ccdw,
            ccz: ccz === "" ? "" : ccz
          };
          lcsyxxList.appendRow(rs);
        }
      } else {
        // 下表添加行数据
        let rs = { lcsycclx: "" };
        lcsyxxList.appendRow(rs);
      }
    } catch (e) {
      console.error("----error---" + errorName + "--" + e);
    }
  };
  reader.readAsText(file, "utf-8");
}
function invokeFunction(id, data, callback, viewModel, options) {
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  if (options.async === false) {
    return proxy.doProxy(data, callback);
  } else {
    proxy.doProxy(data, callback);
  }
}
viewModel.on("beforeSave", function (data) {
  //如果是添加 查重 提示去修改中更新
  if (viewModel.getParams().mode !== "add") {
    return;
  }
  let zxbs = viewModel.get("zxxsdycpbs").getValue();
  if (dataInfoNum > 0) {
    cb.utils.confirm(
      "该产品标识已经存在,请到对应标识下进行更新!" + zxbs,
      () => {
      },
      () => {
      }
    );
    return false;
  }
});
function getBsInfo(cpbsId) {
  let sqlInfo = "select * from ISVUDI.ISVUDI.sy01_udi_product_listv2 where zxxsdycpbs='" + cpbsId + "'";
  invokeFunction(
    "ISVUDI.publicFunction.shareApi",
    {
      sqlType: "check",
      sqlTableInfo: sqlInfo,
      sqlCg: "sy01"
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常");
        return false;
      }
      let rsDataInfo = res.resDataRs;
      if (rsDataInfo.length > 0) {
        dataInfoNum = rsDataInfo.length;
      }
      return rsDataInfo.length;
    },
    undefined,
    { domainKey: "sy01" }
  );
}