let invokeFunction1 = function (id, data, callback, options) {
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  proxy.doProxy(data, callback);
};
viewModel.on("customInit", function (data) {
  // 电子监管入库详情--页面初始化
  let fileInput = document.createElement("input");
  fileInput.id = "youridHere";
  fileInput.type = "file";
  fileInput.style = "display:none";
  document.body.insertBefore(fileInput, document.body.lastChild);
  let scanGridModel = viewModel.get("SY01_scan_entryList");
  let superviseGridModel = viewModel.get("SY01_isupervisecodeList");
  scanGridModel.setState("fixedHeight", 350);
  superviseGridModel.setState("fixedHeight", 350);
});
viewModel.get("button48ih") &&
  viewModel.get("button48ih").on("click", function (data) {
    // 上传药监局--单击
    let error = "";
    let tracCodes = [];
    let diffRow = [];
    let fromOrg = {};
    let toOrg = {};
    let supplierName = viewModel.get("supplier_name").getValue();
    let instockOrgName = viewModel.get("instockOrg_name").getValue();
    let superviseRows = viewModel.get("SY01_isupervisecodeList").getRows();
    let scanRows = viewModel.get("SY01_scan_entryList").getRows();
    let sourceBillType = scanRows[0].source_order_type;
    let sourceBillCode = scanRows[0].source_order_code;
    for (let i = 0; i < scanRows.length; i++) {
      let row = {};
      row.product_name = scanRows[i]["product_name"];
      row.product_code = scanRows[i]["product_code"];
      row.batchNo = scanRows[i]["batchNo"];
      row.qty = scanRows[i]["product_amount"];
      row.barcodeQty = 0;
      diffRow.push(row);
    }
    for (let i = 0; i < superviseRows.length; i++) {
      tracCodes.push(superviseRows[i]["supervise_code"]);
      for (let j = 0; j < diffRow.length; j++) {
        if (diffRow[j]["product_name"] == superviseRows[i]["productName"] && diffRow[j]["batchNo"] == superviseRows[i]["batchNo"]) {
          diffRow[j][barcodeQty]++;
        }
      }
    }
    diffRow.forEach((item, index) => {
      if (item.qty != item.barcodeQty) {
        error += "第" + (index + 1) + "行物料:" + item.product_name + " 批号:" + item.batchNo + "的监管码条数与出入库数量不相同无法上传\n";
      }
    });
    if (error) {
      cb.utils.alert(error, "error");
      return false;
    }
    getEntInfo(instockOrgName, fromOrg)
      .then(() => {
        return getEntInfo(supplierName, toOrg);
      })
      .then(() => {
        return queryCodeActive(tracCodes.toString());
      })
      .then(() => {
        let sourceBillCode = viewModel.get("SY01_scan_entryList").getCellValue(0, "source_order_code");
        let actTime = viewModel.get("SY01_isupervisecodeList").getCellValue(0, "actDate");
        let sourceBillType = viewModel.get("SY01_scan_entryList").getCellValue(0, "source_order_type");
        let operName = viewModel.get("scanner_name").getValue();
        let data = {
          bill_code: sourceBillCode,
          bill_time: actTime,
          bill_type: "102",
          ref_user_id: fromOrg.ref_ent_id,
          from_user_id: fromOrg.ent_id,
          to_user_id: toOrg.ent_id,
          oper_ic_name: operName,
          trace_codes: tracCodes.toString()
        };
        return uploadinoutbill(data);
      })
      .then(() => {
        return searchstatus(billCode);
      })
      .then(
        () => {
          cb.utils.alert("上传成功");
        },
        (error) => {
          cb.utils.alert("上传失败:" + error, "error");
        }
      );
    //校验追溯码
    function queryCodeActive(tracCodes) {
      return new Promise(function (resolve, reject) {
        invokeFunction1(
          "GT22176AT10.publicFunction.querycodeactive",
          {
            tracCodes: tracCodes,
            ref_ent_id: fromOrg.ref_ent_id
          },
          function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              reject(err.message);
            } else {
              if (res.strResponse.indexOf("error") > -1 || res.strResponse.indexOf("false") > -1) {
                cb.utils.alert(res.strResponse, "error");
                reject();
              } else {
                let invalidTracCodes = JSON.parse(res.strResponse).alibaba_alihealth_drug_kyt_querycodeactive_response.models.string;
                if (invalidTracCodes.length > 0) {
                  cb.utils.alert("监管码" + invalidTracCodes + "未激活或者不存在,上传失败", "error");
                  reject();
                } else {
                  resolve();
                }
              }
            }
          },
          {
            domainKey: "sy01"
          }
        );
      });
    }
    //上传对应单据
    function uploadinoutbill(data) {
      return new Promise(function (resolve, reject) {
        invokeFunction1(
          "GT22176AT10.publicFunction.uploadcircubill",
          {
            data: data
          },
          function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              reject(err.message);
            } else {
              if (res.strResponse.indexOf("error") > -1 || res.strResponse.indexOf("false") > -1) {
                cb.utils.alert(res.strResponse, "error");
                reject();
              } else {
                let response = JSON.parse(res.strResponse).alibaba_alihealth_drug_kyt_uploadinoutbill_response;
                if (response.response_success) {
                  resolve();
                } else {
                  reject();
                }
              }
            }
          },
          {
            domainKey: "sy01"
          }
        );
      });
    }
    //上传单据的处理结果
    function searchstatus(billCode) {
      return new Promise(function (resolve, reject) {
        setTimeout(
          invokeFunction1(
            "GT22176AT10.publicFunction.searchstatus",
            {
              billCode: billCode,
              ref_ent_id: fromOrg.ref_ent_id
            },
            function (err, res) {
              if (err) {
                cb.utils.alert(err.message, "error");
                reject(err.message);
              } else {
                if (res.strResponse.indexOf("error") > -1 || res.strResponse.indexOf("false") > -1) {
                  cb.utils.alert(res.strResponse, "error");
                  reject();
                } else {
                  let response = JSON.parse(res.strResponse);
                  if (response.alibaba_alihealth_drug_kyt_searchstatus_response.response_success) {
                    resolve();
                  } else {
                    reject();
                  }
                }
              }
            },
            {
              domainKey: "sy01"
            }
          ),
          7000
        );
      });
    }
    //通过公司名获取ent_id、ref_ent_id
    function getEntInfo(orgName, orgObject) {
      return new Promise(function (resolve, reject) {
        invokeFunction1(
          "GT22176AT10.publicFunction.getentinfo",
          {
            ent_name: orgName
          },
          function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              reject(err.message);
            } else {
              if (res.strResponse.indexOf("error") > -1 || res.strResponse.indexOf("false") > -1) {
                cb.utils.alert(res.strResponse, "error");
                reject();
              } else {
                let response = JSON.parse(res.strResponse).alibaba_alihealth_drug_kyt_getentinfo_response.result;
                if (response.response_success) {
                  orgObject.ref_ent_id = response.model.ref_ent_id;
                  orgObject.ent_id = response.model.ent_id;
                  resolve();
                } else {
                  reject();
                }
              }
            }
          },
          {
            domainKey: "sy01"
          }
        );
      });
    }
  });
viewModel.get("button33uj") &&
  viewModel.get("button33uj").on("click", function (data) {
    // 导入--单击
    document.getElementById("file_input_info").addEventListener("change", bindChange);
    document.getElementById("file_input_info").click();
  });
function bindChange(e) {
  let files = e.target.files;
  if (files.length == 0) return;
  let gridmodel = viewModel.get("SY01_scan_entryList");
  let sourceBillCode = gridmodel.getCellValue(0, "source_order_code");
  let rows = gridmodel.getRows();
  if (rows.length < 1 || gridmodel.getCellValue(0, "source_order_code") == undefined) {
    cb.utils.alert("请先拉取源单", "error");
    document.getElementById("file_input_info").removeEventListener("change", bindChange);
    document.getElementById("file_input_info").value = "";
    return;
  }
  let filesData = files[0];
  readWorkbookFromLocalFile(filesData, insertBarCode, sourceBillCode);
}
function readWorkbookFromLocalFile(file, callback, sourceBillCode) {
  let reader = new FileReader();
  reader.onload = function (e) {
    let nodeList = [];
    let localData = e.target.result;
    let xmlDoc = new DOMParser().parseFromString(localData, "text/xml");
    let dataNodes = xmlDoc.getElementsByTagName("Data");
    for (let i = 0; i < dataNodes.length; i++) {
      if (dataNodes[i].CorpOrderID != sourceBillCode) {
        continue;
      }
      let dataNode = {};
      for (let j = 0; j < dataNodes[i].attributes.length; j++) {
        dataNode[dataNodes[i].attributes[j].name] = dataNodes[i].attributes[j].value;
      }
      nodeList.push(dataNode);
    }
    if (callback) callback(nodeList);
  };
  reader.readAsBinaryString(file);
}
function insertBarCode(nodeList) {
  let code_list = [];
  for (let i = 0; i < nodeList.length; i++) {
    code_list.push(nodeList[i].Code);
  }
  invokeFunction1(
    "GT22176AT10.publicFunction.getbarcode",
    {
      code_list: code_list.toString()
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
        reject(err.message);
      } else {
        //码上放心接口返回结果处理
        if (res.strResponse.indexOf("error") > -1 || res.strResponse.indexOf("false") > -1) {
          cb.utils.alert(res.strResponse, "error");
        } else {
          let infoList = JSON.parse(res.strResponse).alibaba_alihealth_drug_kyt_querydruginfo_response.result.model.info_list.code_full_info_dto;
          let rows = [];
          for (let i = 0; i < infoList.length; i++) {
            let row = {};
            row.supervise_code = infoList[i].code;
            row.product_code = infoList[i].drug_ent_base_d_t_o.physic_code;
            row.productName = infoList[i].drug_ent_base_d_t_o.physic_name;
            row.batchNo = infoList[i].code_produce_info_d_t_o.produce_info_list.produce_info_dto[0].batch_no;
            row.actDate = nodeList[i].ActDate;
            rows.push(row);
          }
          if (rows.length > 0) {
            let gridmodel = viewModel.get("SY01_isupervisecodeList");
            gridmodel.insertRows(gridmodel.getRows().length, rows);
          }
        }
      }
    },
    {
      domainKey: "sy01"
    }
  );
  document.getElementById("file_input_info").removeEventListener("change", bindChange);
  document.getElementById("file_input_info").value = "";
}