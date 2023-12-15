viewModel.on("customInit", function (data) {
  //委外订单页面初始化函数
  debugger;
  var viewModel = this;
  let invokeFunction1 = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    if (options.async == false) {
      return proxy.doProxy(data, callback);
    } else {
      proxy.doProxy(data, callback);
    }
  };
  viewModel.get("extend_gmp_saleman_clientName") &&
    viewModel.get("extend_gmp_saleman_clientName").on("beforeBrowse", function (data) {
      let promisesis = [];
      let gmpLicenceArray = [];
      let inInvoiceOrg = viewModel.get("orderSubcontract!tcOrgId").getValue(); //收票组织
      let invoiceVendor = viewModel.get("orderSubcontract!invoiceVendorId").getValue(); //开票委外商
      let proId = undefined;
      let skuId = undefined;
      promisesis.push(
        getGmpQualifyLicence(inInvoiceOrg, invoiceVendor, proId, skuId).then((res) => {
          gmpLicenceArray = res;
        })
      );
      Promise.all(promisesis).then(() => {
        let attorneyIdArr = [];
        if (gmpLicenceArray.length > 0) {
          for (let i = 0; i < gmpLicenceArray.length; i++) {
            let attorneyArr = gmpLicenceArray[i].attorney;
            for (let j = 0; j < attorneyArr.length; j++) {
              attorneyIdArr.push(attorneyArr[j].authorizerCode);
            }
          }
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "supplierName",
          op: "eq",
          value1: invoiceVendor
        });
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: attorneyIdArr
        });
        this.setFilter(condition);
      });
    });
  viewModel.on("beforeSave", function () {
    debugger;
    let errorMsg = "";
    let rows = viewModel.getGridModel("orderProduct").getRows(); //子表数据
    let clientId = viewModel.get("extend_gmp_saleman").getValue(); //gmp授权委托人
    let invoiceVendor = viewModel.get("orderSubcontract!invoiceVendorId").getValue(); //开票委外商
    let inInvoiceOrg = viewModel.get("orderSubcontract!tcOrgId").getValue(); //收票组织
    let clientMId = viewModel.get("extend_gmp_saleman").getValue(); //gmp授权委托人
    let clientMName = viewModel.get("extend_gmp_saleman_clientName").getValue();
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    let resArray = [];
    for (let j = 0; j < rows.length; j++) {
      let materialId = rows[j].productId; //物料ID
      let characteristics = rows[j].freeCharacteristics; //特征组
      let currentRows = rows[j];
      currentRows.rowno = j + 1;
      let isSub = true; //是否委外
      promises.push(orderLogic(inInvoiceOrg, invoiceVendor, characteristics, clientId, materialId, clientMId, clientMName, currentRows, isSub).then(handerMessage));
    }
    var promise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        promise.reject();
      } else {
        promise.resolve();
      }
    });
    return promise;
  });
  //订单校验
  function orderLogic(inInvoiceOrg, invoiceVendor, feature, clientId, materialId, clientMId, clientMName, currentRows, isSub) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "ISY_2.public.orderLogic",
        {
          inInvoiceOrg: inInvoiceOrg,
          invoiceVendor: invoiceVendor,
          clientId: clientId,
          materialId: materialId,
          clientMId: clientMId,
          clientMName: clientMName,
          currentRows: currentRows,
          feature: feature,
          isSub: isSub
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (typeof res !== "undefined") {
            resolve("");
          } else if (err !== null) {
            cb.utils.alert(err.message, "error");
            reject();
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  let getGmpLicence = function (inInvoiceOrg, invoiceVendor, clientId, productId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getSuppler",
        {
          orgId: inInvoiceOrg,
          supplierCode: invoiceVendor,
          salesmanId: clientId,
          productId: productId
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (typeof res !== "undefined") {
            let para = res.data;
            resolve(para);
          } else if (err !== null) {
            cb.utils.alert(err.message, "error");
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
  let getGmpParameters = function () {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "ISY_2.public.getParamInfo",
        {},
        function (err, res) {
          if (typeof res !== "undefined") {
            let para = res.paramRes;
            resolve(para);
          } else if (err !== null) {
            cb.utils.alert(err.message, "error");
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
  //校验特征组
  function validateFeature(inInvoiceOrg, materialId, characteristics) {
    return new Promise((resolve, reject) => {
      invokeFunction1(
        "ISY_2.public.validateFeature",
        { materialId: materialId, feature: characteristics, orgId: inInvoiceOrg },
        function (err, res) {
          if (typeof res != "undefined") {
            resolve(res);
          } else if (typeof err != "undefined") {
            reject(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  function getMaterialInfo(materialId) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "GT22176AT10.publicFunction.getProductDetail",
        { materialId: materialId },
        function (err, res) {
          if (typeof res !== "undefined") {
            resolve(res.merchantInfo);
          } else if (err !== null) {
            reject(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  function getGMPMaterialInfo(inInvoiceOrg, materialId) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "ISY_2.public.getGMPProduct",
        { orgId: inInvoiceOrg, materialId: materialId },
        function (err, res) {
          if (typeof res !== "undefined") {
            resolve(res.suppliesRes);
          } else if (err !== null) {
            reject(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  function getGmpQualifyLicence(inInvoiceOrg, invoiceVendor, proId, skuId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getQualifySupply",
        {
          orgId: inInvoiceOrg,
          supplierCode: invoiceVendor,
          proId: proId,
          skuId: skuId
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (typeof res !== "undefined") {
            let para = res.masterRes;
            resolve(para);
          } else if (err !== null) {
            cb.utils.alert(err.message, "error");
            reject();
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
});