viewModel.get("button48ih") &&
  viewModel.get("button48ih").on("click", function (data) {
    // 上传药监局--单击
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
    //判断数量是否正确
    let error = "";
    let tracCodes = [];
    let diffRow = [];
    let billCode = viewModel.get("code").getValue();
    let superviseRows = viewModel.get("SY01_isupervisecodeList").getRows();
    let scanRows = viewModel.get("SY01_scan_entryList").getRows();
    let billType = scanRows[0].source_order_type;
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
      tracCodes.push(superviseRows[i]["traccode"]);
      for (let j = 0; j < diffRow.length; j++) {
        if (diffRow[j]["product_code"] == superviseRows[i]["product_code"] && diffRow[j]["batchNo"] == superviseRows[i]["batchNo"]) {
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
    queryCodeActive(tracCode.toString())
      .then(() => {
        uploadinoutbill(data);
      })
      .then(() => {
        searchstatus(billCode);
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
            tracCodes: tracCodes
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
                  cb.utils.alert("监管码" + invalidTracCodes + "未激活或者不存在", "error");
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
                let response = JSON.parse(res.strResponse).alibaba_alihealth_drug_kyt_uploadcircubill_response;
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
              billCode: billCode
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
  });
viewModel.on("customInit", function (data) {
  // 电子监管入库详情--页面初始化
});