viewModel.on("afterSave", function (args) {
  if (args.err == null) {
    //获取动态域名
    var responsYM = cb.rest.invokeFunction("GZTBDM.getsYnchronous.getPath", {}, function (err, resProDetail) {}, viewModel, { async: false });
    if (!responsYM.result) {
      cb.utils.alert("获取动态域名失败，原因:" + responsYM, "error");
      return false;
    }
    let resultYM = JSON.parse(responsYM.result.apiResponse);
    if (resultYM.code != "00000") {
      cb.utils.alert("获取动态域名失败，原因:" + responsYM, "error");
      return false;
    }
    let gatewayUrl = resultYM.data.gatewayUrl;
    let girdModel = viewModel.getGridModel();
    let param = args.res;
    // 调用获取token的API函数
    var res = cb.rest.invokeFunction("GZTBDM.getsYnchronous.getAccessToken", {}, function (err, res) {}, viewModel, { async: false });
    let resultRet = JSON.parse(res.result.strResponse);
    if (!resultRet.success) {
      cb.utils.alert("获取富通天下token失败，同步物料失败,请重试!", "error");
      return false;
    }
    //富通天下token
    let token = resultRet.data;
    let code = param.code; //物料编码
    let name = param.name;
    let CNName = null; //中文名称
    let USName = null; //英文名称
    if (name != null) {
      CNName = name.zh_CN; //中文名称
      USName = name.en_US; //英文名称
    }
    let modelDescription = param.modelDescription;
    let CNModelDescription = null; //中文规格说明
    let USModelDescription = null; //英文规格说明
    if (modelDescription != null) {
      CNModelDescription = modelDescription.zh_CN;
      USModelDescription = modelDescription.en_US;
    }
    let receiptModel = param["detail!receiptModel"];
    let CNReceiptModel = null; //中文型号
    let ENReceiptModel = null; //英文型号
    if (receiptModel != null) {
      CNReceiptModel = receiptModel.zh_CN;
      ENReceiptModel = receiptModel.en_US;
    }
    let productClass_Code = param.manageClass_Code; //物料分类编码
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
    var _status = param.eventNotify_status; //修改还是新增状态
    let unit_NameDetail = null; //主计量单位名称==>详情
    let purchasingUnitDetail = null; //采购单位
    let fMarkPriceDetail = null; //建议零售价=>详情
    let weightDetail = null; //毛重=>详情
    let netWeightDetail = null; //净重=>详情
    let lengthDetail = null; //长=》详情
    let widthDetail = null; //宽=》详情
    let heightDetail = null; //高=》详情
    let volumeDetail = null; //体积=》详情
    let outTaxrate_NameDetail = null; //销售税率=》详情
    let modelDetail = null; //型号
    if (_status != "Insert") {
      //如果是修改，调用获取物料档案详情API 使用详情中的数据
      let orgId = param.orgId; //组织id
      let proId = param.id; //物料id
      let proDetailParam = {
        orgId: orgId,
        proId: proId
      };
      var proDetailRes = cb.rest.invokeFunction("GZTBDM.getsYnchronous.getProDetailYS", { proDetailParam, gatewayUrl }, function (err, proDetailRes) {}, viewModel, { async: false });
      let proDetailResult = proDetailRes.result.strResponse;
      let currentProDetail = proDetailResult.data;
      unit_NameDetail = currentProDetail.unit_Name;
      purchasingUnitDetail = currentProDetail.detail.purchaseUnit_Name;
      fMarkPriceDetail = currentProDetail.detail.fMarkPrice;
      weightDetail = currentProDetail.weight;
      netWeightDetail = currentProDetail.netWeight;
      lengthDetail = currentProDetail.length;
      widthDetail = currentProDetail.width;
      heightDetail = currentProDetail.height;
      volumeDetail = currentProDetail.volume;
      outTaxrate_NameDetail = currentProDetail.detail.outTaxrate_Name;
      modelDetail = currentProDetail.model;
    }
    let body = {
      accessToken: token,
      type: 0,
      productList: [
        {
          productNo: code,
          proSpecList: [
            {
              defaultFlag: "是", //是否是默认规格
              salesCurrency: "CNY", //销售币种
              saleFlag: "是", //销售状态 否:停售; 是:销售
              moq: 1 // 起订量
            }
          ]
        }
      ]
    };
    if (CNName != null) {
      body.productList[0].cname = CNName; //中文名称
    }
    if (USName != null) {
      body.productList[0].ename = USName; //英文名称
    }
    if (outTaxrate_Name != null) {
      body.productList[0].vat = outTaxrate_Name; //增值税率
      body.productList[0].proSpecList[0].vat = outTaxrate_Name; //增值税率
    } else {
      if (outTaxrate_NameDetail != null) {
        body.productList[0].vat = outTaxrate_NameDetail + ""; //增值税率
        body.productList[0].proSpecList[0].vat = outTaxrate_NameDetail + ""; //增值税率
      } else {
        body.productList[0].vat = "0";
        body.productList[0].proSpecList[0].vat = "0"; //增值税率
      }
    }
    if (CNModelDescription != null) {
      body.productList[0].proSpecList[0].cmemo = CNModelDescription; //中文描述
    }
    if (USModelDescription != null) {
      body.productList[0].proSpecList[0].ememo = USModelDescription; //英文描述
    }
    if (CNReceiptModel != null) {
      body.productList[0].proSpecList[0].productSpec = CNReceiptModel; //产品规格
      body.productList[0].proSpecList[0].specModel = CNReceiptModel; //规格型号
    } else {
      if (modelDetail != null) {
        body.productList[0].proSpecList[0].productSpec = modelDetail; //产品规格
        body.productList[0].proSpecList[0].specModel = modelDetail; //规格型号
      }
    }
    if (weight != null) {
      body.productList[0].proSpecList[0].grossWeight = weight; //毛重
    } else {
      if (weightDetail != null) {
        body.productList[0].proSpecList[0].grossWeight = weightDetail; //毛重
      }
    }
    if (netWeight != null) {
      body.productList[0].proSpecList[0].netWeight = netWeight; //净重
    } else {
      if (netWeightDetail != null) {
        body.productList[0].proSpecList[0].netWeight = netWeightDetail; //净重
      }
    }
    if (volume != null) {
      body.productList[0].proSpecList[0].volume = volume; //体积
    } else {
      if (volumeDetail != null) {
        body.productList[0].proSpecList[0].volume = volumeDetail; //体积
      }
    }
    if (fMarkPrice != null) {
      body.productList[0].proSpecList[0].salesUnitPrice = fMarkPrice; //销售价
    } else {
      if (fMarkPriceDetail != null) {
        body.productList[0].proSpecList[0].salesUnitPrice = fMarkPriceDetail; //销售价
      }
    }
    if (unit_Name != null) {
      body.productList[0].customsDeclarationUnit = unit_Name; //报关单位
      body.productList[0].proSpecList[0].salesUnit = unit_Name; //单位
      body.productList[0].proSpecList[0].purchasingUnit = unit_Name; //采购单位（统计单位）
      body.productList[0].proSpecList[0].standardUnit = unit_Name; //标准单位
      body.productList[0].proSpecList[0].customsDeclarationUnit = unit_Name; //规格处报关单位
    } else {
      if (unit_NameDetail != null) {
        body.productList[0].customsDeclarationUnit = unit_NameDetail; //报关单位
        body.productList[0].proSpecList[0].salesUnit = unit_NameDetail; //单位
        body.productList[0].proSpecList[0].purchasingUnit = unit_NameDetail; //采购单位（统计单位）
        body.productList[0].proSpecList[0].standardUnit = unit_NameDetail; //标准单位
        body.productList[0].proSpecList[0].customsDeclarationUnit = unit_NameDetail; //规格处报关单位
      }
    }
    if (productClass_Name != null) {
      //如果分类名称不是null，则通过分类名称获取分类id
      let proClassParam = {
        accessToken: token,
        type: 0,
        name: productClass_Name,
        nameCode: productClass_Code
      };
      //通过分类名称获取分类id
      var proClassRes = cb.rest.invokeFunction("GZTBDM.getsYnchronous.getProClassId", { proClassParam }, function (err, proClassRes) {}, viewModel, { async: false });
      let proClassResult = JSON.parse(proClassRes.result.strResponse);
      if (!proClassResult.success) {
        cb.utils.alert("同步该物料失败,原因:" + insertResult.errMsg, "error");
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
    if (_status == "Insert") {
      //新增
      //调用新增接口
      console.log(JSON.stringify(body));
      var insertProRes = cb.rest.invokeFunction("GZTBDM.getsYnchronous.InsertPro", { body }, function (err, insertProRes) {}, viewModel, { async: false });
      let insertResult = JSON.parse(insertProRes.result.strResponse);
      if (!insertResult.success) {
        cb.utils.alert("同步该物料失败,原因:" + insertResult.errMsg, "error");
        return false;
      }
      cb.utils.alert("新增同步物料成功!", "success");
    } else {
      //修改
      //如果是null，则是修改，且没有修改分类,则则通过当前物料code获取物料id和分类id
      let proIdParam = {
        accessToken: token,
        type: 0,
        productCode: code
      };
      //则通过当前物料code获取物料id和分类id
      var proIdRes = cb.rest.invokeFunction("GZTBDM.getsYnchronous.getProIdByCode", { proIdParam }, function (err, proIdRes) {}, viewModel, { async: false });
      let proIdResult = JSON.parse(proIdRes.result.strResponse);
      if (!proIdResult.success) {
        cb.utils.alert("同步该物料失败,原因:" + proIdResult.errMsg, "error");
        return false;
      }
      let currentProDetail = null;
      for (let i = 0; i < proIdResult.data.length; i++) {
        if (proIdResult.data[i].productNo == code && proIdResult.data[i].status == 1) {
          currentProDetail = proIdResult.data[i];
          break;
        }
      }
      if (currentProDetail == null) {
        cb.utils.alert("修改物料失败,请先点击批量保存按钮将该物料同步至富通天下系统!", "error");
        return false;
      }
      let proId = currentProDetail.id; //产品id
      if (productClass_Name == null) {
        //如果分类名称没做修改，则使用之前的分类
        let productMenuId = currentProDetail.productMenuId; //产品分类id
        body.parentId = productMenuId;
      }
      body.productList[0].id = proId;
      console.log(JSON.stringify(body));
      //调用修改接口
      var updateProRes = cb.rest.invokeFunction("GZTBDM.getsYnchronous.updatePro", { body }, function (err, updateProRes) {}, viewModel, { async: false });
      let updatetResult = JSON.parse(updateProRes.result.strResponse);
      if (!updatetResult.success) {
        cb.utils.alert("同步该物料失败,原因:" + updatetResult.errMsg, "error");
        return false;
      }
      cb.utils.alert("修改同步物料成功!", "success");
    }
  }
});