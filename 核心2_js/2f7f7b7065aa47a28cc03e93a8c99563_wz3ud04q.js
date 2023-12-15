let djInfoTable = viewModel.getGridModel(); //单据列表
viewModel.get("button10uk") &&
  viewModel.get("button10uk").on("click", function (data) {
    // 导入预制数据--单击
    let inputdatainfo = [
      {
        udi_identification: "GS1",
        udi_meaning: "全球贸易项目代码",
        udi_ai: "(01)",
        udi_format: "n2+n18",
        udi_data_name: "GTIN"
      },
      {
        udi_identification: "GS1",
        udi_meaning: "批号",
        udi_ai: "(10)",
        udi_format: "n2+an...20",
        udi_data_name: "BATCH/LOT"
      },
      {
        udi_identification: "GS1",
        udi_meaning: "生产日期(YYMMDD)",
        udi_ai: "(11)",
        udi_format: "n2+n6",
        udi_data_name: "PROD DATE"
      },
      {
        udi_identification: "GS1",
        udi_meaning: "有效期(YYMMDD)",
        udi_ai: "(17)",
        udi_format: "n2+n6",
        udi_data_name: "USE BY或EXPIRY"
      },
      {
        udi_identification: "GS1",
        udi_meaning: "序列号",
        udi_ai: "(21)",
        udi_format: "n2+an...20",
        udi_data_name: "SERIAL"
      }
    ];
    let resDataFileSql = "select * from I0P_UDI.I0P_UDI.sy01_udi_coding_systemv3";
    cb.rest.invokeFunction(
      "I0P_UDI.publicFunction.shareApi",
      {
        sqlType: "check",
        sqlTableInfo: resDataFileSql,
        sqlCg: "isv-ud1"
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("导入数据异常!");
          return false;
        }
        let rsdata = res.resDataRs;
        addData(rsdata, inputdatainfo);
      }
    );
  });
function addData(rsdata, inputdatainfo) {
  //过滤存在的
  let addInputData = [];
  if (rsdata.length !== 0) {
    for (let bmi = 0; bmi < inputdatainfo.length; bmi++) {
      let temp = 1;
      for (let bmj = 0; bmj < rsdata.length; bmj++) {
        let udiIdentification = rsdata[bmj].udiIdentification; //获取对应列的值
        let udiMeaning = rsdata[bmj].udiMeaning; //获取对应列的值
        let udiAi = rsdata[bmj].udiAi; //获取对应列的值
        if (inputdatainfo[bmi].udi_identification === udiIdentification && inputdatainfo[bmi].udi_meaning === udiMeaning && inputdatainfo[bmi].udi_ai === udiAi) {
          temp = 2;
        }
      }
      if (temp === 1) {
        addInputData.push({
          udiIdentification: inputdatainfo[bmi].udi_identification,
          udiMeaning: inputdatainfo[bmi].udi_meaning,
          udiAi: inputdatainfo[bmi].udi_ai,
          udiFormat: inputdatainfo[bmi].udi_format,
          udiDataName: inputdatainfo[bmi].udi_data_name
        });
      }
    }
  } else {
    for (let bmi = 0; bmi < inputdatainfo.length; bmi++) {
      addInputData.push({
        udiIdentification: inputdatainfo[bmi].udi_identification,
        udiMeaning: inputdatainfo[bmi].udi_meaning,
        udiAi: inputdatainfo[bmi].udi_ai,
        udiFormat: inputdatainfo[bmi].udi_format,
        udiDataName: inputdatainfo[bmi].udi_data_name
      });
    }
  }
  if (addInputData.length === 0) {
    cb.utils.alert("没有可导入的数据!");
    return;
  }
  //将当前列表传入,添加时,每条判断是否需要添加,添加过的不能在添加
  cb.rest.invokeFunction(
    "I0P_UDI.publicFunction.inputData",
    {
      inputType: "bmtx",
      bmtxDataObject: addInputData
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("导入数据异常!");
        return false;
      }
      cb.utils.alert("导入数据成功!导入数量:" + res.rs.length);
      viewModel.execute("refresh");
    }
  );
}