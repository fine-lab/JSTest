let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.inOrg;
    //获取GMP参数的组织信息
    let getGmpParameters = extrequire("ISY_2.public.getParamInfo");
    let gmpInfoArrayData = getGmpParameters.execute({ orgId });
    let gmpInfoArray = [];
    if (typeof gmpInfoArrayData.paramRes !== "undefined" && gmpInfoArrayData.paramRes.length > 0) {
      gmpInfoArray = gmpInfoArrayData.paramRes;
      if (gmpInfoArray.length > 0) {
        if (gmpInfoArray[0].isarrival == "1") {
          return { res: true };
        }
      }
    }
    //查询GMP受控交易类型
    let gmpTransTypeSql = "select * from ISY_2.ISY_2.SY01_control_transa_type";
    let gmpTransTypeResArr = ObjectStore.queryByYonQL(gmpTransTypeSql, "sy01");
    let gmpTransTypeRes = [];
    if (typeof gmpTransTypeResArr != "undefined" && gmpTransTypeResArr != null) {
      if (gmpTransTypeResArr.length > 0) {
        for (let i = 0; i < gmpTransTypeResArr.length; i++) {
          //查询采购订单GMP受控交易类型
          let gmpTransTypePurchaseSql = "select * from ISY_2.ISY_2.SY01_control_transa_type_purchase where fkid = " + gmpTransTypeResArr[i].id;
          gmpTransTypeRes = ObjectStore.queryByYonQL(gmpTransTypePurchaseSql, "sy01");
          //查询委外订单GMP受控交易类型
          let gmpTransTypeSubcontractingSql = "select * from ISY_2.ISY_2.SY01_control_transa_type_subcontracting where fkid = " + gmpTransTypeResArr[i].id;
          let gmpTransTypeSubcontractingRes = ObjectStore.queryByYonQL(gmpTransTypeSubcontractingSql, "sy01");
          gmpTransTypeRes.push.apply(gmpTransTypeRes, gmpTransTypeSubcontractingRes);
        }
      } else {
        return { res: true };
      }
    } else {
      return { res: true };
    }
    let isGmp = false;
    if (gmpTransTypeRes.length > 0) {
      for (let j = 0; j < gmpTransTypeRes.length; j++) {
        let purchase = gmpTransTypeRes[j].purchase; //采购受控交易类型ID
        let subcontracting = gmpTransTypeRes[j].subcontracting; //委外受控交易类型ID
        if (request.transType == purchase) {
          isGmp = true;
        } else if (request.transType == subcontracting) {
          isGmp = true;
        }
      }
    }
    if (isGmp) {
      let supPreqLicenManage = {};
      if (gmpInfoArray.length == 0) {
        throw new Error("交易类型为GMP受控交易类型，【收货组织/会计主体】需要开启GMP组织参数 \n ");
      } else if (gmpInfoArray.length > 0) {
        if (gmpInfoArray[0].isarrival == "1") {
          return { res: true };
        }
        if (gmpInfoArray[0].isPurchaseControl != 1 && gmpInfoArray[0].isPurchaseControl != "1" && request.type == "采购订单") {
          throw new Error("交易类型为GMP受控交易类型，【收货组织/会计主体】需要开启GMP组织参数 \n ");
        } else if (gmpInfoArray[0].isQualificationsControl != 1 && gmpInfoArray[0].isQualificationsControl != "1" && request.type == "委外订单") {
          throw new Error("交易类型为GMP受控交易类型，【收货组织/会计主体】需要开启GMP组织参数 \n ");
        } else {
          supPreqLicenManage[request.inOrg] = gmpInfoArray[0];
        }
      }
      //获取使用范围组织下的物料详情ID
      let orgSql = "select productDetailId from pc.product.ProductApplyRange where orgId = " + request.inOrg + " and productId = " + request.materialId;
      let orgRes = ObjectStore.queryByYonQL(orgSql, "productcenter");
      //获取物料详情信息
      let materialSql = "";
      if (orgRes.length > 0) {
        materialSql = "select * from pc.product.ProductDetail where productId = " + request.materialId + " and id = " + orgRes[0].productDetailId;
      } else {
        throw new Error("收货组织【" + request.inOrgName + "】没有此物料的使用权限，请检查 \n ");
      }
      let merchantInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
      //获取GMP物料信息
      //获取合格供应商清单
      let getGmpLicenceData = {
        orgId: request.inOrg,
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
      if (typeof proDetail.merchantInfo !== "undefined" && proDetail.merchantInfo.length > 0) {
        //人员证照授权范围和物料对比
        let isCheck = false;
        let qualified = false;
        let attorneyId = [];
        let gmpLicenceArray = gmpLicenceArrayData.data;
        for (let n = 0; n < gmpLicenceArray.length; n++) {
          let salemanInfo = gmpLicenceArray[n].baseInfo;
          if (typeof salemanInfo.attorney != "undefined") {
            let attorneyList = salemanInfo.attorney;
            for (let a = 0; a < attorneyList.length; a++) {
              attorneyId.push(attorneyList[a].authorizerCode);
            }
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
                  if (typeof request.currentRows.rowno != "undefined") {
                    lineNo = request.currentRows.rowno;
                    throw new Error("第" + lineNo + "行，物料预审已过期，请检查 \n ");
                  } else {
                    lineNo = request.currentRows.lineNo;
                    throw new Error("第" + lineNo + "行，物料预审已过期，请检查 \n ");
                  }
                }
              } else {
                throw new Error("第" + detailsObj.rowno + "行，物料预审已过期，请检查 \n ");
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
                let lineNo = 0;
                if (typeof request.currentRows.rowno != "undefined") {
                  lineNo = request.currentRows.rowno;
                  throw new Error("第" + lineNo + "行的" + validate.message);
                } else {
                  lineNo = request.currentRows.lineNo;
                  throw new Error("行号为" + lineNo + "的" + validate.message);
                }
              }
            }
          }
        }
        if (typeof gmpLicenceArrayData.data === "undefined" || gmpLicenceArrayData.data.length <= 0) {
          let lineNo = 0;
          if (typeof request.currentRows.rowno != "undefined") {
            lineNo = request.currentRows.rowno;
            throw new Error("第" + lineNo + "行的物料，需要进GMP供应商预审,请检查 \n ");
          } else {
            lineNo = request.currentRows.lineNo;
            throw new Error("行号为" + lineNo + "的物料，需要进GMP供应商预审,请检查 \n "); //开启了GMP医药属性
          }
        }
        if (supPreqLicenManage[request.inOrg].isSupPreqLicenManage == "0") {
          return { res: true };
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
            let lineNo = 0;
            if (typeof request.currentRows.rowno != "undefined") {
              lineNo = request.currentRows.rowno;
              throw new Error("子表第" + lineNo + "行GMP授权委托人不能为空，请检查 \n ");
            } else {
              lineNo = request.currentRows.lineNo;
              throw new Error("子表行号为" + lineNo + "GMP授权委托人不能为空，请检查 \n ");
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
            let lineNo = 0;
            if (typeof request.currentRows.rowno != "undefined") {
              lineNo = request.currentRows.rowno;
              throw new Error("子表第" + lineNo + "行的GMP授权委托人不在合格供应商范围内，请检查 \n ");
            } else {
              lineNo = request.currentRows.lineNo;
              throw new Error("子表行号为" + lineNo + "的GMP授权委托人不在合格供应商范围内，请检查 \n ");
            }
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
    return { res: true };
  }
}
exports({ entryPoint: MyAPIHandler });