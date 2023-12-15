let djInfoTable = viewModel.getGridModel(); //单据列表
viewModel.get("button8lh") &&
  viewModel.get("button8lh").on("click", function (data) {
    // 导入预制数据--单击
    let inputdatainfo = [
      {
        interface_field_upload: "zxxsdycpbs",
        field_name: "最小销售单元产品标识",
        interface_field_name: "最小销售单元产品标识",
        interface_field_download: "zxxsdycpbs",
        entity_name: "产品标识库",
        field_identification: "zxxsdycpbs",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "zxxsdycpbs",
        is_enable: "1",
        field_explain: "最小销售单元产品标识"
      },
      {
        interface_field_upload: "cpbsbmtxmc",
        field_name: "产品标识编码体系名称",
        interface_field_name: "产品标识编码体系名称",
        interface_field_download: "cpbsbmtxmc",
        entity_name: "产品标识库",
        field_identification: "cpbsbmtxmc",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "cpbsbmtxmc",
        is_enable: "1",
        field_explain: "产品标识编码体系名称"
      },
      {
        interface_field_upload: "cpbsfbrq",
        field_name: "产品标识发布日期",
        interface_field_name: "产品标识发布日期",
        interface_field_download: "cpbsfbrq",
        entity_name: "产品标识库",
        field_identification: "cpbsfbrq",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "cpbsfbrq",
        is_enable: "1",
        field_explain: "产品标识发布日期"
      },
      {
        interface_field_upload: "zxxsdyzsydydsl",
        field_name: "最小销售单元中使用单元的数量",
        interface_field_name: "最小销售单元中使用单元的数量",
        interface_field_download: "zxxsdyzsydydsl",
        entity_name: "产品标识库",
        field_identification: "zxxsdyzsydydsl",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "zxxsdyzsydydsl",
        is_enable: "1",
        field_explain: "最小销售单元中使用单元的数量"
      },
      {
        interface_field_upload: "sydycpbs",
        field_name: "使用单元产品标识",
        interface_field_name: "使用单元产品标识",
        interface_field_download: "sydycpbs",
        entity_name: "产品标识库",
        field_identification: "sydycpbs",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "sydycpbs",
        is_enable: "1",
        field_explain: "使用单元产品标识"
      },
      {
        interface_field_upload: "sfybtzjbs",
        field_name: "是否有本体标识",
        interface_field_name: "是否有本体标识",
        interface_field_download: "sfybtzjbs",
        entity_name: "产品标识库",
        field_identification: "sfybtzjbs",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "sfybtzjbs",
        is_enable: "1",
        field_explain: "是否有本体标识"
      },
      {
        interface_field_upload: "btcpbsyzxxsdycpbssfyz",
        field_name: "本体产品标识与最小销售单元产品标识是否一致",
        interface_field_name: "本体产品标识与最小销售单元产品标识是否一致",
        interface_field_download: "btcpbsyzxxsdycpbssfyz",
        entity_name: "产品标识库",
        field_identification: "btcpbsyzxxsdycpbssfyz",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "btcpbsyzxxsdycpbssfyz",
        is_enable: "1",
        field_explain: "本体产品标识与最小销售单元产品标识是否一致"
      },
      {
        interface_field_upload: "btcpbs",
        field_name: "本体产品标识",
        interface_field_name: "本体产品标识",
        interface_field_download: "btcpbs",
        entity_name: "产品标识库",
        field_identification: "btcpbs",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "btcpbs",
        is_enable: "1",
        field_explain: "本体产品标识"
      },
      {
        interface_field_upload: "cpmctymc",
        field_name: "产品名称/通用名称",
        interface_field_name: "产品名称/通用名称",
        interface_field_download: "cpmctymc",
        entity_name: "产品标识库",
        field_identification: "cpmctymc",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "cpmctymc",
        is_enable: "1",
        field_explain: "产品名称/通用名称"
      },
      {
        interface_field_upload: "spmc",
        field_name: "商品名称",
        interface_field_name: "商品名称",
        interface_field_download: "spmc",
        entity_name: "产品标识库",
        field_identification: "spmc",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "spmc",
        is_enable: "1",
        field_explain: "商品名称"
      },
      {
        interface_field_upload: "ggxh",
        field_name: "规格型号",
        interface_field_name: "规格型号",
        interface_field_download: "ggxh",
        entity_name: "产品标识库",
        field_identification: "ggxh",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "ggxh",
        is_enable: "1",
        field_explain: "规格型号"
      },
      {
        interface_field_upload: "sfwblztlcp",
        field_name: "是否为包类/组套类产品",
        interface_field_name: "是否为包类/组套类产品",
        interface_field_download: "sfwblztlcp",
        entity_name: "产品标识库",
        field_identification: "sfwblztlcp",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "sfwblztlcp",
        is_enable: "1",
        field_explain: "是否为包类/组套类产品"
      },
      {
        interface_field_upload: "cpms",
        field_name: "产品描述",
        interface_field_name: "产品描述",
        interface_field_download: "cpms",
        entity_name: "产品标识库",
        field_identification: "cpms",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "cpms",
        is_enable: "1",
        field_explain: "产品描述"
      },
      {
        interface_field_upload: "cphhhbh",
        field_name: "产品货号或编号",
        interface_field_name: "产品货号或编号",
        interface_field_download: "cphhhbh",
        entity_name: "产品标识库",
        field_identification: "cphhhbh",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "cphhhbh",
        is_enable: "1",
        field_explain: "产品货号或编号"
      },
      {
        interface_field_upload: "yflbm",
        field_name: "原分类编码",
        interface_field_name: "原分类编码",
        interface_field_download: "yflbm",
        entity_name: "产品标识库",
        field_identification: "yflbm",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "yflbm",
        is_enable: "1",
        field_explain: "原分类编码"
      },
      {
        interface_field_upload: "qxlb",
        field_name: "器械类别",
        interface_field_name: "器械类别",
        interface_field_download: "qxlb",
        entity_name: "产品标识库",
        field_identification: "qxlb",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "qxlb",
        is_enable: "1",
        field_explain: "器械类别"
      },
      {
        interface_field_upload: "flbm",
        field_name: "分类编码",
        interface_field_name: "分类编码",
        interface_field_download: "flbm",
        entity_name: "产品标识库",
        field_identification: "flbm",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "flbm",
        is_enable: "1",
        field_explain: "分类编码"
      },
      {
        interface_field_upload: "ylqxzcrbarmc",
        field_name: "医疗器械注册人/备案人名称",
        interface_field_name: "医疗器械注册人/备案人名称",
        interface_field_download: "ylqxzcrbarmc",
        entity_name: "产品标识库",
        field_identification: "ylqxzcrbarmc",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "ylqxzcrbarmc",
        is_enable: "1",
        field_explain: "医疗器械注册人/备案人名称"
      },
      {
        interface_field_upload: "tyshxydm",
        field_name: "统一社会信息代码",
        interface_field_name: "统一社会信息代码",
        interface_field_download: "tyshxydm",
        entity_name: "产品标识库",
        field_identification: "tyshxydm",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "tyshxydm",
        is_enable: "1",
        field_explain: "统一社会信息代码"
      },
      {
        interface_field_upload: "zczbhhzbapzbh",
        field_name: "注册证编号或者备案凭证编号",
        interface_field_name: "注册证编号或者备案凭证编号",
        interface_field_download: "zczbhhzbapzbh",
        entity_name: "产品标识库",
        field_identification: "zczbhhzbapzbh",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "zczbhhzbapzbh",
        is_enable: "1",
        field_explain: "注册证编号或者备案凭证编号"
      },
      {
        interface_field_upload: "ylqxzcrbarywmc",
        field_name: "医疗器械注册人/备案人英文名称",
        interface_field_name: "医疗器械注册人/备案人英文名称",
        interface_field_download: "ylqxzcrbarywmc",
        entity_name: "产品标识库",
        field_identification: "ylqxzcrbarywmc",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "ylqxzcrbarywmc",
        is_enable: "1",
        field_explain: "医疗器械注册人/备案人英文名称"
      },
      {
        interface_field_upload: "ybbm",
        field_name: "医保耗材分类编码",
        interface_field_name: "医保耗材分类编码",
        interface_field_download: "ybbm",
        entity_name: "产品标识库",
        field_identification: "ybbm",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "ybbm",
        is_enable: "1",
        field_explain: "医保耗材分类编码"
      },
      {
        interface_field_upload: "cplb",
        field_name: "产品类别",
        interface_field_name: "产品类别",
        interface_field_download: "cplb",
        entity_name: "产品标识库",
        field_identification: "cplb",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "cplb",
        is_enable: "1",
        field_explain: "产品类别"
      },
      {
        interface_field_upload: "cgzmraqxgxx",
        field_name: "磁共振（MR）安全相关信息",
        interface_field_name: "磁共振（MR）安全相关信息",
        interface_field_download: "cgzmraqxgxx",
        entity_name: "产品标识库",
        field_identification: "cgzmraqxgxx",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "cgzmraqxgxx",
        is_enable: "1",
        field_explain: "磁共振（MR）安全相关信息"
      },
      {
        interface_field_upload: "sfbjwycxsy",
        field_name: "是否标记为一次性使用",
        interface_field_name: "是否标记为一次性使用",
        interface_field_download: "sfbjwycxsy",
        entity_name: "产品标识库",
        field_identification: "sfbjwycxsy",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "sfbjwycxsy",
        is_enable: "1",
        field_explain: "是否标记为一次性使用"
      },
      {
        interface_field_upload: "zdcfsycs",
        field_name: "最大重复使用次数",
        interface_field_name: "最大重复使用次数",
        interface_field_download: "zdcfsycs",
        entity_name: "产品标识库",
        field_identification: "zdcfsycs",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "zdcfsycs",
        is_enable: "1",
        field_explain: "最大重复使用次数"
      },
      {
        interface_field_upload: "sfwwjbz",
        field_name: "是否为无菌包装",
        interface_field_name: "是否为无菌包装",
        interface_field_download: "sfwwjbz",
        entity_name: "产品标识库",
        field_identification: "sfwwjbz",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "sfwwjbz",
        is_enable: "1",
        field_explain: "是否为无菌包装"
      },
      {
        interface_field_upload: "syqsfxyjxmj",
        field_name: "使用前是否需要进行灭菌",
        interface_field_name: "使用前是否需要进行灭菌",
        interface_field_download: "syqsfxyjxmj",
        entity_name: "产品标识库",
        field_identification: "syqsfxyjxmj",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "syqsfxyjxmj",
        is_enable: "1",
        field_explain: "使用前是否需要进行灭菌"
      },
      {
        interface_field_upload: "mjfs",
        field_name: "灭菌方式",
        interface_field_name: "灭菌方式",
        interface_field_download: "mjfs",
        entity_name: "产品标识库",
        field_identification: "mjfs",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "mjfs",
        is_enable: "1",
        field_explain: "灭菌方式"
      },
      {
        interface_field_upload: "qtxxdwzlj",
        field_name: "其他信息的网址链接",
        interface_field_name: "其他信息的网址链接",
        interface_field_download: "qtxxdwzlj",
        entity_name: "产品标识库",
        field_identification: "qtxxdwzlj",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "qtxxdwzlj",
        is_enable: "1",
        field_explain: "其他信息的网址链接"
      },
      {
        interface_field_upload: "scbssfbhph",
        field_name: "生产标识是否包含批号",
        interface_field_name: "生产标识是否包含批号",
        interface_field_download: "scbssfbhph",
        entity_name: "产品标识库",
        field_identification: "scbssfbhph",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "scbssfbhph",
        is_enable: "1",
        field_explain: "生产标识是否包含批号"
      },
      {
        interface_field_upload: "scbssfbhxlh",
        field_name: "生产标识是否包含序列号",
        interface_field_name: "生产标识是否包含序列号",
        interface_field_download: "scbssfbhxlh",
        entity_name: "产品标识库",
        field_identification: "scbssfbhxlh",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "scbssfbhxlh",
        is_enable: "1",
        field_explain: "生产标识是否包含序列号"
      },
      {
        interface_field_upload: "scbssfbhscrq",
        field_name: "生产标识是否包含生产日期",
        interface_field_name: "生产标识是否包含生产日期",
        interface_field_download: "scbssfbhscrq",
        entity_name: "产品标识库",
        field_identification: "scbssfbhscrq",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "scbssfbhscrq",
        is_enable: "1",
        field_explain: "生产标识是否包含生产日期"
      },
      {
        interface_field_upload: "scbssfbhsxrq",
        field_name: "生产标识是否包含失效日期",
        interface_field_name: "生产标识是否包含失效日期",
        interface_field_download: "scbssfbhsxrq",
        entity_name: "产品标识库",
        field_identification: "scbssfbhsxrq",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "scbssfbhsxrq",
        is_enable: "1",
        field_explain: "生产标识是否包含失效日期"
      },
      {
        interface_field_upload: "deviceRecordKey",
        field_name: "主键编号",
        interface_field_name: "主键编号",
        interface_field_download: "deviceRecordKey",
        entity_name: "产品标识库",
        field_identification: "deviceRecordKey",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "deviceRecordKey",
        is_enable: "1",
        field_explain: "主键编号"
      },
      {
        interface_field_upload: "versionNumber",
        field_name: "公开的版本号",
        interface_field_name: "公开的版本号",
        interface_field_download: "versionNumber",
        entity_name: "产品标识库",
        field_identification: "versionNumber",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "versionNumber",
        is_enable: "1",
        field_explain: "公开的版本号"
      },
      {
        interface_field_upload: "versionTime",
        field_name: "版本的发布日期",
        interface_field_name: "版本的发布日期",
        interface_field_download: "versionTime",
        entity_name: "产品标识库",
        field_identification: "versionTime",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "versionTime",
        is_enable: "1",
        field_explain: "版本的发布日期"
      },
      {
        interface_field_upload: "versionStauts",
        field_name: "版本的状态",
        interface_field_name: "版本的状态",
        interface_field_download: "versionStauts",
        entity_name: "产品标识库",
        field_identification: "versionStauts",
        is_upload_input: "1",
        entity_field: "sy01_udi_product_list",
        is_field_upload: "1",
        interface_field_import: "versionStauts",
        is_enable: "1",
        field_explain: "版本的状态"
      }
    ];
    let resDataFileSql = "select * from I0P_UDI.I0P_UDI.sy01_country_interface_datav3";
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
        let interfaceFieldDownload = rsdata[bmj].interfaceFieldDownload; //获取对应列的值
        let interfaceFieldName = rsdata[bmj].interfaceFieldName; //获取对应列的值
        let fieldName = rsdata[bmj].fieldName; //获取对应列的值
        if (inputdatainfo[bmi].interface_field_upload === interfaceFieldDownload && inputdatainfo[bmi].interface_field_name === interfaceFieldName && inputdatainfo[bmi].field_name === fieldName) {
          temp = 2;
        }
      }
      if (temp === 1) {
        addInputData.push({
          interfaceFieldDownload: inputdatainfo[bmi].interface_field_download,
          interfaceFieldUpload: inputdatainfo[bmi].interface_field_upload,
          interfaceFieldImport: inputdatainfo[bmi].interface_field_import,
          interfaceFieldName: inputdatainfo[bmi].interface_field_name,
          isFieldUpload: inputdatainfo[bmi].is_field_upload,
          isUploadInput: inputdatainfo[bmi].is_upload_input,
          entityField: inputdatainfo[bmi].entity_field,
          entityName: inputdatainfo[bmi].entity_name,
          fieldIdentification: inputdatainfo[bmi].field_identification,
          fieldName: inputdatainfo[bmi].field_name,
          fieldExplain: inputdatainfo[bmi].field_explain,
          isEnable: inputdatainfo[bmi].is_enable
        });
      }
    }
  } else {
    for (let bmi = 0; bmi < inputdatainfo.length; bmi++) {
      addInputData.push({
        interfaceFieldDownload: inputdatainfo[bmi].interface_field_download,
        interfaceFieldUpload: inputdatainfo[bmi].interface_field_upload,
        interfaceFieldImport: inputdatainfo[bmi].interface_field_import,
        interfaceFieldName: inputdatainfo[bmi].interface_field_name,
        isFieldUpload: inputdatainfo[bmi].is_field_upload,
        isUploadInput: inputdatainfo[bmi].is_upload_input,
        entityField: inputdatainfo[bmi].entity_field,
        entityName: inputdatainfo[bmi].entity_name,
        fieldIdentification: inputdatainfo[bmi].field_identification,
        fieldName: inputdatainfo[bmi].field_name,
        fieldExplain: inputdatainfo[bmi].field_explain,
        isEnable: inputdatainfo[bmi].is_enable
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
      inputType: "gjjksjmx",
      dataObject: addInputData
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