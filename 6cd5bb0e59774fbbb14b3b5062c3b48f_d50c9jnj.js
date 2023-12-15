viewModel.on("customInit", function (data) {
  // 物流状态信息--页面初始化
});
viewModel.get("button18jc").on("click", function () {
  debugger;
});
viewModel.get("button18jc") &&
  viewModel.get("button18jc").on("click", function (data) {
    let param = {
      rec_no: "1212",
      log_no: "1212",
      sign_status: true,
      mail_status: true,
      wlztxxmxList: [
        {
          status_code: "1212",
          status_name: "1212",
          act_time: "2023-03-18 13:59:24"
        }
      ]
    };
    cb.rest.invokeFunction(
      "AT1707A99A16B00005.wxzt.wlxxzwyadd",
      { param },
      function (err, res) {
        alter("11111");
      }
    );
  });
viewModel.get("button22dc") &&
  viewModel.get("button22dc").on("click", function (data) {
    // 按钮test2--单击
    let param = [{ rec_no: "000001", log_no: "000001", locateInfoList: [{ locate: "北京市东城区东华门街道意大利使馆旧址中国人民对外友好协会", update_time: "2023-04-01 00:00:00" }] }];
    cb.rest.invokeFunction("AT1707A99A16B00005.backOpenApiFunction.addLocate", { param }, function (err, res) {});
  });
viewModel.get("button26ai") &&
  viewModel.get("button26ai").on("click", function (data) {
    let param = [
      {
        org: "A23001",
        vouchdate: "2021-04-17 00:00:00",
        businesstype: "A11001",
        outWarehouse: "02",
        inWarehouse: "01",
        _status: "Insert",
        details: [{ product: "1920126858647891", qty: "20", unit: "yourIdHere", invExchRate: "1", subQty: "12", stockUnitId: "yourIdHere", _status: "Insert" }]
      }
    ];
    param1 = [
      {
        org: "ZR001",
        vouchdate: "2023-02-16 00:00:00",
        businesstype: "A11001",
        outWarehouse: "000001",
        inWarehouse: "000012",
        _status: "Insert",
        details: [
          {
            isBatchManage: "true",
            batchno: "0216",
            isSerialNoManage: "true",
            product: "1667000001",
            productsku: "1667000001",
            qty: "3",
            unit: "03",
            invExchRate: "1",
            subQty: "3",
            _status: "Insert",
            stockUnitId: "03",
            storeTransDetailSNs: [
              {
                sn: "001",
                _status: "Insert"
              },
              {
                sn: "002",
                _status: "Insert"
              },
              {
                sn: "003",
                _status: "Insert"
              }
            ]
          }
        ]
      }
    ];
    cb.rest.invokeFunction("AT1707A99A16B00005.backOpenApiFunction.transferSaveAud", { param1 }, function (err, res) {});
  });
viewModel.getGridModel().on("afterSetDataSource", function (data) {
  let logicRes = viewModel.getParams().result.logicRes;
  if (logicRes.length > 0) {
    logicRes.forEach((item) => {
      window.YYCooperationBridge.ready(() => {
        //获取fileId
        window.YYCooperationBridge.YYGetFilesIncludeDelete({
          businessType: "iuap-yonbuilder-runtime+mdf",
          businessId: "mdf_" + item.sign_bill
        }).then((fileRes) => {
          console.log(fileRes);
          if (fileRes.data.length > 0) {
            fileRes.data.forEach((item2) => {
              const fileId = item2.id; //这里获取到了fileId 多个文件自行处理
              const qzId = 0; //固定值
              const open = false; //固定值
              //获取预览地址
              let res = window.YYCooperationBridge.YYGetDownloadUrl(fileId);
              let el = document.createElement("a");
              el.target = "_blank";
              el.href = res;
              el.download = "";
              el.click();
            });
          }
        });
      });
    });
  }
  if (logicRes) {
    delete viewModel.getParams().result.logicRes;
  }
});