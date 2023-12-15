let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取GMP参数的组织信息
    let getGmpParameters = extrequire("ISY_2.public.getParamInfo");
    let gmpInfoArrayData = getGmpParameters.execute();
    //获取合格供应商清单
    let getGmpLicenceData = {
      orgId: request.inInvoiceOrg,
      supplierCode: request.invoiceVendor,
      salesmanId: request.clientId,
      productId: request.materialId
    };
    let getGmpLicence = extrequire("ISY_2.public.getSuppler");
    let gmpLicenceArrayData = getGmpLicence.execute(getGmpLicenceData);
    //获取物料信息
    let getMaterialInfoData = { orgId: request.inInvoiceOrg, materialId: request.materialId };
    let getMaterialInfo = extrequire("ISY_2.public.getProduct");
    let proDetail = getMaterialInfo.execute(getMaterialInfoData);
    //获取GMP物料信息
    let getGMPMaterialInfoData = { orgId: request.inInvoiceOrg, materialId: request.materialId };
    let getGMPMaterialInfo = extrequire("ISY_2.public.getGMPProduct");
    let proGMPDetail = getGMPMaterialInfo.execute(getGMPMaterialInfoData);
    if (typeof gmpInfoArrayData.paramRes !== "undefined" && gmpInfoArrayData.paramRes.length > 0) {
      let gmpInfoArray = gmpInfoArrayData.paramRes;
      for (let i = 0; i < gmpInfoArray.length; i++) {
        if (gmpInfoArray[i].org_id != request.inInvoiceOrg) {
          continue;
        } else if (gmpInfoArray[i].isPurchaseControl != 1 && gmpInfoArray[i].isPurchaseControl != "1") {
          continue;
        }
        if (typeof proDetail.merchantInfo !== "undefined" && proDetail.merchantInfo.length > 0) {
          let inspectionType = proDetail.merchantInfo[0].inspectionType;
          if (inspectionType == "1" || inspectionType == 1) {
            if (typeof gmpLicenceArrayData.data === "undefined" || gmpLicenceArrayData.data.length <= 0) {
              throw new Error("第" + request.currentRows.rowno + "行物料开启了检验属性的物料，需要进GMP供应商预审,请检查 \n ");
            }
            let clientMId = request.clientMId;
            let clientMName = request.clientMName;
            if (clientMName == null || clientMName == "" || typeof clientMName == "undefined") {
              throw new Error("表头的GMP授权委托人不能为空 \n ");
            }
            if (typeof request.isSub == "undefined") {
              var clientId = request.currentRows.extend_gmp_saleman;
              let clientName = request.currentRows.extend_gmp_saleman_clientName;
              if (clientName == null || clientName == "" || typeof clientName == "undefined") {
                throw new Error("第" + request.currentRows.rowno + "行GMP授权委托人不能为空 \n ");
              }
            }
            //人员证照授权范围和物料对比
            let isCheck = false;
            let qualified = false;
            let attorneyId = [];
            let gmpLicenceArray = gmpLicenceArrayData.data;
            for (let n = 0; n < gmpLicenceArray.length; n++) {
              let salemanInfo = gmpLicenceArray[n].baseInfo;
              let licenceRangeList = salemanInfo.license[0].range;
              let attorneyList = salemanInfo.attorney;
              for (let a = 0; a < attorneyList.length; a++) {
                attorneyId.push(attorneyList[a].authorizerCode);
              }
              if (typeof salemanInfo != "undefined" && salemanInfo != null) {
                if (qualified) {
                  break;
                }
                let detailsObj = request.currentRows;
                if (typeof salemanInfo.skuCode != "undefined" && detailsObj.productsku == salemanInfo.skuCode) {
                  isCheck = true;
                  let date;
                  let endDate = salemanInfo.endDate;
                  if (typeof endDate != "undefined" && endDate != null) {
                    date = new Date(endDate);
                    let nowDate = new Date();
                    let diffValue = Math.floor((date - nowDate) / (1000 * 60 * 60 * 24));
                    if (diffValue <= 0) {
                      throw new Error("第" + (n + 1) + "行，物料预审已过期，请检查 \n ");
                    }
                  } else {
                    throw new Error("第" + (n + 1) + "行，物料预审已过期，请检查 \n ");
                  }
                } else if (
                  (typeof salemanInfo.skuCode == "undefined" || salemanInfo.skuCode == null) &&
                  typeof salemanInfo.productCode != "undefined" &&
                  (detailsObj.product == salemanInfo.productCode || detailsObj.productId == salemanInfo.productCode)
                ) {
                  isCheck = true;
                  let date;
                  let endDate = salemanInfo.endDate;
                  if (typeof endDate != "undefined" && endDate != null) {
                    date = new Date(endDate);
                    let nowDate = new Date();
                    let diffValue = Math.floor((date - nowDate) / (1000 * 60 * 60 * 24));
                    if (diffValue <= 0) {
                      throw new Error("第" + (n + 1) + "行，物料预审已过期，请检查 \n ");
                    }
                  } else {
                    throw new Error("第" + (n + 1) + "行，物料预审已过期，请检查 \n ");
                  }
                }
                if (typeof salemanInfo.endDate != "undefined" && salemanInfo.endDate != null && salemanInfo.endDate != "") {
                  let currentTimeStamp = Number(new Date());
                  if (salemanInfo.endDate <= currentTimeStamp) {
                    throw new Error("合格供应商预审有效期已过期");
                  }
                }
                if (gmpLicenceArray[n].gmpProPerHear !== "1" && gmpLicenceArray[n].gmpProPerHear !== 1) {
                  //获取自由项特征组判断结果
                  let validateFeatureData = {
                    orgId: request.inInvoiceOrg,
                    materialId: request.materialId,
                    feature: request.feature
                  };
                  let validateFeature = extrequire("ISY_2.public.validateFeature");
                  let validate = validateFeature.execute(validateFeatureData);
                  if (validate.code !== 1001) {
                    throw new Error("第" + request.currentRows.rowno + "行的" + validate.message);
                  }
                }
              }
            }
            let attorneyMIdIndex = attorneyId.indexOf(clientMId);
            if (attorneyMIdIndex == -1) {
              throw new Error("主表的GMP授权委托人不在合格供应商范围内，请检查 \n ");
            }
            if (typeof request.isSub == "undefined") {
              let attorneyIdIndex = attorneyId.indexOf(clientId);
              if (attorneyIdIndex == -1) {
                throw new Error("子表第" + request.currentRows.rowno + "行的GMP授权委托人不在合格供应商范围内，请检查 \n ");
              }
            }
            if (!isCheck) {
              if (typeof request.currentRows.product_cCode != "undefined") {
                throw new Error("编码为[" + request.currentRows.product_cCode + "]的物料/物料SKU不在合格供应商授权的范围内 \n ");
              } else {
                throw new Error("编码为[" + request.currentRows.productCode + "]的物料/物料SKU不在合格供应商授权的范围内 \n ");
              }
            }
          }
        }
      }
    }
    return { res: true };
  }
}
exports({ entryPoint: MyAPIHandler });