viewModel.get("button48sd") &&
  viewModel.get("button48sd").on("click", function (data) {
    // 批量同步--单击
    //勾选的物料
    let selectProList = viewModel.getGridModel().getSelectedRows();
    if (selectProList.length == 0) {
      cb.utils.alert("未勾选数据!", "error");
      return false;
    }
    console.log(JSON.stringify(selectProList));
    // 调用获取token的API函数
    var res = cb.rest.invokeFunction("GZTBDM.getsYnchronous.getAccessToken", {}, function (err, res) {}, viewModel, { async: false });
    let resultRet = JSON.parse(res.result.strResponse);
    if (!resultRet.success) {
      cb.utils.alert("获取富通天下token失败，同步该物料失败,请删除重试!", "error");
      return false;
    }
    //富通天下token
    let token = resultRet.data;
    let body = {
      accessToken: token,
      type: 0
    };
    let productList = [];
    for (let i = 0; i < selectProList.length; i++) {
      let param = selectProList[i];
      let code = param.code; //物料编码
      let name = param.name;
      let CNName = null; //中文名称
      let USName = null; //英文名称
      if (name != null) {
        CNName = name.zh_CN;
        USName = name.en_US;
      }
      let modelDescription = param.modelDescription;
      let CNModelDescription = null; //中文规格说明
      let USModelDescription = null; //英文规格说明
      if (modelDescription != null) {
        CNModelDescription = modelDescription.zh_CN;
        USModelDescription = modelDescription.en_US;
      }
      let receiptModel = param.model;
      let CNReceiptModel = null; //中文型号
      let ENReceiptModel = null; //英文型号
      if (receiptModel != null) {
        CNReceiptModel = receiptModel.zh_CN;
        ENReceiptModel = receiptModel.en_US;
      }
      let productClass_Name = param.manageClass_Name; //物料分类名称
      let unit_Name = param.unit_Name; //主计量单位名称
      let fMarkPrice = param["detail!fMarkPrice"]; //建议零售价
      let weight = param.weight; //毛重
      let netWeight = param.netWeight; //净重
      let length = param.length; //长
      let width = param.width; //宽
      let height = param.height; //高
      let volume = param.volume; //体积
      let outTaxrate_Name = param["detail!outTaxrate_Name"]; //销售税率
      let productItem = {
        productNo: code,
        proSpecList: [
          {
            defaultFlag: "是", //是否是默认规格
            salesCurrency: "CNY", //销售币种
            saleFlag: "是", //销售状态 否:停售; 是:销售
            moq: 1 // 起订量
          }
        ]
      };
      if (CNName != null) {
        productItem.cname = CNName; //中文名称
      }
      if (USName != null) {
        productItem.ename = USName; //英文名称
      }
      if (outTaxrate_Name != null) {
        productItem.vat = outTaxrate_Name + ""; //增值税率
        productItem.proSpecList[0].vat = outTaxrate_Name + ""; //增值税率
      } else {
        productItem.vat = "0";
        productItem.proSpecList[0].vat = "0"; //增值税率
      }
      if (CNModelDescription != null) {
        productItem.proSpecList[0].cmemo = CNModelDescription; //中文描述
      }
      if (USModelDescription != null) {
        productItem.proSpecList[0].ememo = USModelDescription; //英文描述
      }
      if (CNReceiptModel != null) {
        productItem.proSpecList[0].productSpec = CNReceiptModel; //产品规格
        productItem.proSpecList[0].specModel = CNReceiptModel; //规格型号
      }
      if (weight != null) {
        productItem.proSpecList[0].grossWeight = weight; //毛重
      }
      if (netWeight != null) {
        productItem.proSpecList[0].netWeight = netWeight; //净重
      }
      if (volume != null) {
        productItem.proSpecList[0].volume = volume; //体积
      }
      if (fMarkPrice != null) {
        productItem.proSpecList[0].salesUnitPrice = fMarkPrice; //销售价
      }
      if (unit_Name != null) {
        productItem.customsDeclarationUnit = unit_Name; //报关单位
        productItem.proSpecList[0].salesUnit = unit_Name; //单位
        productItem.proSpecList[0].purchasingUnit = unit_Name; //采购单位（统计单位）
        productItem.proSpecList[0].standardUnit = unit_Name; //标准单位
        productItem.proSpecList[0].customsDeclarationUnit = unit_Name; //规格处报关单位
      }
      //因为批量同步的物料都是属于同一个分类，所以只查询一次分类id
      if (i == 0) {
        let proClassParam = {
          accessToken: token,
          type: 0,
          name: productClass_Name
        };
        //通过分类名称获取分类id
        var proClassRes = cb.rest.invokeFunction("GZTBDM.getsYnchronous.getProClassId", { proClassParam }, function (err, proClassRes) {}, viewModel, { async: false });
        let proClassResult = JSON.parse(proClassRes.result.strResponse);
        if (!proClassResult.success) {
          cb.utils.alert("同步物料失败,原因:" + insertResult.errMsg, "error");
          return false;
        }
        let currentProClass = null;
        let proClassArr = proClassResult.data; //物料分类目录列表
        for (let i = 0; i < proClassArr.length; i++) {
          if (productClass_Name == proClassArr[i].chineseName) {
            currentProClass = proClassArr[i];
            break;
          }
        }
        let proClassId = currentProClass.id; //分类id
        body.parentId = proClassId; //父目录id
      }
      productList.push(productItem);
    }
    body.productList = productList;
    //调用新增接口
    console.log(JSON.stringify(body));
    var insertProRes = cb.rest.invokeFunction("GZTBDM.getsYnchronous.InsertPro", { body }, function (err, insertProRes) {}, viewModel, { async: false });
    let insertResult = JSON.parse(insertProRes.result.strResponse);
    if (!insertResult.success) {
      cb.utils.alert("同步物料失败,原因:" + insertResult.errMsg, "error");
      return false;
    }
    cb.utils.alert("新增同步物料成功!", "success");
  });