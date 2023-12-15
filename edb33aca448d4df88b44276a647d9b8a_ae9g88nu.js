let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let dataResponse = {};
    let vendorId = request.vendorId; //供应商ID
    let contact = request.contact;
    let productId = request.productId; //商品ID
    let orgId = request.org; //组织ID
    let vendorCode = request.vendorCode; //
    let vendorList = { vendorId, vendorCode };
    let error_info = [];
    let errInfo = [];
    let remind = [];
    let remindInfo = [];
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //获取GSP管理参数
    let gspUrl = apiPreAndAppCode.apiPrefix + "/x5f9yw7w/001/00001/get_storage_condy"; //+storageId;//查询商品存储条件详情
    let gspBody = { id: 2500759324872960 };
    let apiResponseGSP = openLinker("POST", gspUrl, "GT22176AT10", JSON.stringify(gspBody));
    let gsp_obj = apiResponseGSP.data;
    //获取供应商档案详情
    let apiResponseSupplier = extrequire("GT22176AT10.publicFunction.getVenderDetail").execute(vendorList);
    dataResponse.vendorData = apiResponseSupplier.merchantInfo;
    //获取证照ID
    let licenseDateArr = [];
    if (typeof apiResponseSupplier.merchantInfo.extend_lincenseList !== "undefined") {
      if (apiResponseSupplier.merchantInfo.extend_lincenseList.length > 0) {
        let license_list = apiResponseSupplier.merchantInfo.extend_lincenseList;
        for (let ven = 0; ven < license_list.length; ven++) {
          let licenseId = license_list[ven].extend_license_name;
          //获取证照详情
          let licenseUrl = apiPreAndAppCode.apiPrefix + "/x5f9yw7w/001/00001/getlicense"; //查询证照详情
          let licenseBody = { id: licenseId };
          let apiResponseLicense = openLinker("POST", licenseUrl, "GT22176AT10", JSON.stringify(licenseBody));
          let license_obj = JSON.parse(apiResponseLicense);
          licenseDateArr[ven] = license_obj.licenseDetail;
        }
      }
    } else {
      error_info.push("该供应商没有证照");
    }
    let licenseDateJson = JSON.stringify(licenseDateArr);
    let licenseDateObj = JSON.parse(licenseDateJson);
    dataResponse.licenseDate = licenseDateObj;
    let productIdArr = [];
    let storageId = []; //存储条件ID
    if (typeof productId !== "undefined") {
      if (productId.length > 0) {
        for (let product = 0; product < productId.length; product++) {
          let materialId = productId[product];
          let productDetail = { materialId, orgId };
          //获取商品档案详情
          let apiResponseSupplier = extrequire("GT22176AT10.publicFunction.getProductDetail").execute(productDetail);
          productIdArr[product] = apiResponseSupplier.merchantInfo;
          //获取商品存储条件ID
          if (apiResponseSupplier.merchantInfo.extend_cctj !== undefined) {
            storageId[product] = apiResponseSupplier.merchantInfo.extend_cctj;
          }
        }
      }
    } else {
      error_info.push("请选择商品");
    }
    let productDataJson = JSON.stringify(productIdArr);
    let productDataObj = JSON.parse(productDataJson);
    dataResponse.productDataInfo = productDataObj;
    //获取商品存储条件详情
    let storageArr = [];
    if (typeof productId !== "undefined") {
      if (storageId.length > 0) {
        for (let stoC = 0; stoC < storageId.length; stoC++) {
          let storageUrl = apiPreAndAppCode.apiPrefix + "/x5f9yw7w/001/00001/get_storage_condy"; //+storageId;//查询商品存储条件详情
          let storageBody = { id: storageId[stoC] };
          let apiResponseStorage = openLinker("POST", storageUrl, "GT22176AT10", JSON.stringify(storageBody));
          let storage_obj = JSON.parse(apiResponseStorage);
          storageArr[stoC] = storage_obj.data.storageDetail;
        }
      }
    }
    let storageJson = JSON.stringify(storageArr);
    let storageObj = JSON.parse(storageJson);
    dataResponse.storageData = storageObj;
    let proStartTime = request.proStartTime;
    let proEndTime = request.proEndTime;
    let arrivalTemperat = request.arrivalTemperat;
    let productCode = request.productCode;
    let authProduct = {};
    let authProType = {};
    let authDosage = {};
    let Tips = [];
    let vendorData = dataResponse.vendorData; //供应商信息
    let productData = dataResponse.productDataInfo; //商品信息
    let licenseDate = dataResponse.licenseDate; //证照信息
    let storageData = dataResponse.storageData; //存储条件信息
    let supperFirstStatus = vendorData.extend_first_status;
    let attorneyProduct = {};
    let attorneyProType = {};
    let attorneyDosage = {};
    if (supperFirstStatus != 2) {
      error_info.push("供货供应商未首营通过审批");
    } else {
      if (contact === null || contact === "") {
        error_info.push("供方联系人不能为空");
      }
    }
    if (vendorData.attorney_authList) {
      for (let i = 0; i < vendorData.attorney_authList.length; i++) {
        let name = [];
        for (let n = 0; n < vendorData.attorney_authList.length; n++) {
          if (contact == vendorData.attorney_authList[n].extend_salesman_name) {
            name += vendorData.attorney_authList[n].extend_salesman_name;
          }
        }
        if (name.length < 0) {
          error_info.push("供方联系人不是供货供应商的联系人");
        } else {
          //授权委托书孙表
          let attorneyId = [];
          if (vendorData.attorney_authList[i].scope_authorityList.length > 0) {
            for (var j = 0; j < vendorData.attorney_authList[i].scope_authorityList.length; j++) {
              let attorrmeyScopeId = vendorData.attorney_authList[i].scope_authorityList[j].extend_attorrmey_scope_id;
              if (productId == attorrmeyScopeId) {
                attorneyId[j] += productId;
              }
            }
          }
          if (attorneyId.length <= 0) {
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.poacontrol == "1") {
                error_info.push("该供应商联系人未被授予该商品的采购权");
              } else {
                remind.push("该供应商联系人未被授予该商品的采购权");
              }
            }
          }
        }
        let date = new Date();
        var supAttorneyValidTime = new Date(vendorData.attorney_authList[i].extend_end_date); //授权委托书到期日期
        let timeAuthorDiff = parseInt((date.getTime() - supAttorneyValidTime.getTime()) / 1000 / 60 / 60 / 24);
        if (timeAuthorDiff > 0 && typeof gsp_obj !== "undefined") {
          if (gsp_obj.poacontrol == "1") {
            error_info.push("该供应商第" + i + "个授权委托书已过期");
          } else if (timeAuthorDiff > 0) {
            remind.push("该供应商第" + i + "个授权委托书已过期");
          } else {
            if (vendorData.attorney_authList[i].extend_auth_scope == "1") {
              //委托书授权类型
              attorneyProduct = vendorData.attorney_authList[i].scope_authorityList;
            } else if (vendorData.attorney_authList[i].extend_auth_scope == "2") {
              attorneyProType = vendorData.attorney_authList[i].scope_authorityList;
            } else if (vendorData.attorney_authList[i].extend_auth_scope == "3") {
              attorneyDosage = vendorData.attorney_authList[i].scope_authorityList;
            }
          }
        } else {
          if (vendorData.attorney_authList[i].extend_auth_scope == "1") {
            //委托书授权类型
            attorneyProduct = vendorData.attorney_authList[i].scope_authorityList;
          } else if (vendorData.attorney_authList[i].extend_auth_scope == "2") {
            attorneyProType = vendorData.attorney_authList[i].scope_authorityList;
          } else if (vendorData.attorney_authList[i].extend_auth_scope == "3") {
            attorneyDosage = vendorData.attorney_authList[i].scope_authorityList;
          }
        }
      }
    } else {
      if (typeof gsp_obj !== "undefined") {
        if (gsp_obj.poacontrol == "1") {
          error_info.push("该供应商无授权委托书");
        } else {
          remind.push("该供应商第" + i + "个授权委托书已过期");
        }
      }
    }
    if (typeof vendorData.extend_lincenseList !== "undefined") {
      for (let i = 0; i < vendorData.extend_lincenseList.length; i++) {
        var date = new Date();
        let objectName = [];
        let isStrictControl = [];
        var supLicenceValidTime = new Date(vendorData.extend_lincenseList[i].extend_end_validity_date); //证照到期日期
        let timeLicenceDiff = parseInt((date.getTime() - supLicenceValidTime.getTime()) / 1000 / 60 / 60 / 24);
        if (timeLicenceDiff >= 0) {
          //需要改为  >=0
          error_info.push("该供应商第" + (i + 1) + "个证照已过期");
        } else {
          for (let ld = 0; ld < licenseDate.length; ld++) {
            for (let t = 0; t < licenseDate[ld][0].licenseSonRes.length; t++) {
              objectName.push(licenseDate[ld][0].licenseSonRes[t].objectName);
              isStrictControl.push(licenseDate[ld][0].licenseSonRes[t].isStrictControl);
            }
          }
          let index = objectName.indexOf(vendorData.vendorclass_name);
          if (index != -1) {
            //应该为  index==-1
            error_info.push("该供应商的所属分类不在第" + (i + 1) + "个证照的包含范围内");
          } else {
            for (let isSC = 0; isSC < isStrictControl.length; isSC++) {
              if (isStrictControl[isSC] == "1") {
                Tips.push("该供应商的第" + (isSC + 1) + "个证照已开启严格管控");
              }
            }
            for (var ld = 0; ld < licenseDate.length; ld++) {
              for (var t = 0; t < licenseDate[ld][0].licenseSonRes.length; t++) {
                objectName.push(licenseDate[ld][0].licenseSonRes[t].objectName);
              }
            }
            if (vendorData.extend_lincenseList[i].extend_auth_type == "1") {
              //证照授权类型
              authProduct = vendorData.extend_lincenseList[i].extend_licenseScopeList;
            } else if (vendorData.extend_lincenseList[i].extend_auth_type == "2") {
              authProType = vendorData.extend_lincenseList[i].extend_licenseScopeList;
            } else if (vendorData.extend_lincenseList[i].extend_auth_type == "3") {
              authDosage = vendorData.extend_lincenseList[i].extend_licenseScopeList;
            }
          }
        }
      }
    }
    let speCount = 0; //特殊药品数量
    let ephCount = 0; //含麻黄碱药品数量
    let coldCount = 0; //冷链药品数量
    let sum = 0; //药品总数量
    for (let pro = 0; pro < productData.length; pro++) {
      sum += 1;
      let proCount = 0; //药品种类数量
      for (let w = 0; w < productCode.length; w++) {
        if ((productId[w] == productCode[w + 1]) == "false") {
          proCount += 1;
        }
      }
      if (authProduct.length > 0) {
        for (let sp = 0; sp < authProduct.length; sp++) {
          if (productData[pro].extend_tsyp == "true") {
            speCount += 1;
            let startTime = new Date(proStartTime); //起运时间
            let endTime = new Date(proEndTime); //到货时间
            let timeLicenceDiff = parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24);
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.transporttimecontrol == "1") {
                if (timeLicenceDiff > 2) {
                  error_info.push("第" + speCount + "个药品运输时间过长");
                }
              } else {
                if (timeLicenceDiff > 2) {
                  remind.push("第" + speCount + "个药品运输时间过长");
                }
              }
            }
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.stoconditioncontrol == "1") {
                //到货温度:arrivalTemperat storageData.storageRes
                for (let storageT = 0; storageT < storageData.length; storageT++) {
                  if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                    error_info.push("到货温度不符合第" + speCount + "个药品的存储条件");
                  }
                }
              } else {
                //到货温度:arrivalTemperat storageData.storageRes
                for (let storageT = 0; storageT < storageData.length; storageT++) {
                  if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                    remind.push("到货温度不符合第" + speCount + "个药品的存储条件");
                  }
                }
              }
            }
          }
          if (productData[pro].extend_hmhj == "true") {
            ephCount += 1;
            let startTime = new Date(proStartTime); //起运时间
            let endTime = new Date(proEndTime); //到货时间
            let timeLicenceDiff = parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24);
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.transporttimecontrol == "1") {
                if (timeLicenceDiff > 2) {
                  error_info.push("第" + ephCount + "个药品运输时间过长");
                }
              } else {
                if (timeLicenceDiff > 2) {
                  remind.push("第" + ephCount + "个药品运输时间过长");
                }
              }
            }
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.stoconditioncontrol == "1") {
                //到货温度:arrivalTemperat storageData.storageRes
                for (let storageT = 0; storageT < storageData.length; storageT++) {
                  if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                    error_info.push("到货温度不符合第" + ephCount + "个药品的存储条件");
                  }
                }
              } else {
                //到货温度:arrivalTemperat storageData.storageRes
                for (let storageT = 0; storageT < storageData.length; storageT++) {
                  if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                    remind.push("到货温度不符合第" + ephCount + "个药品的存储条件");
                  }
                }
              }
            }
          }
          if (productData[pro].extend_llyp == "true") {
            coldCount += 1;
            let startTime = new Date(proStartTime); //起运时间
            let endTime = new Date(proEndTime); //到货时间
            let timeLicenceDiff = parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24);
            if (timeLicenceDiff > 2) {
              error_info.push("冷链药品运输时间过长");
            }
            //到货温度:arrivalTemperat storageData.storageRes
            for (let storageT = 0; storageT < storageData.length; storageT++) {
              if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                error_info.push("到货温度不符合该冷链药品的存储条件");
              }
            }
          }
        }
      } else if (authDosage.length > 0) {
        for (let jx = 0; jx < authDosage.length; jx++) {
          let startTime = new Date(proStartTime); //起运时间
          let endTime = new Date(proEndTime); //到货时间
          let timeLicenceDiff = parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24);
          if (productData[pro].extend_tsyp == "true") {
            speCount += 1;
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.transporttimecontrol == "1") {
                if (timeLicenceDiff > 2) {
                  error_info.push("第" + speCount + "个药品运输时间过长");
                }
              } else {
                if (timeLicenceDiff > 2) {
                  remind.push("第" + speCount + "个药品运输时间过长");
                }
              }
            }
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.stoconditioncontrol == "1") {
                //到货温度:arrivalTemperat storageData.storageRes
                for (let storageT = 0; storageT < storageData.length; storageT++) {
                  if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                    error_info.push("到货温度不符合第" + speCount + "个药品的存储条件");
                  }
                }
              } else {
                //到货温度:arrivalTemperat storageData.storageRes
                for (let storageT = 0; storageT < storageData.length; storageT++) {
                  if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                    remind.push("到货温度不符合第" + speCount + "个药品的存储条件");
                  }
                }
              }
            }
          }
          if (productData[pro].extend_hmhj == "true") {
            ephCount += 1;
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.transporttimecontrol == "1") {
                if (timeLicenceDiff > 2) {
                  error_info.push("第" + ephCount + "个药品运输时间过长");
                }
              } else {
                if (timeLicenceDiff > 2) {
                  remind.push("第" + ephCount + "个药品运输时间过长");
                }
              }
            }
            if (typeof gsp_obj !== "undefined") {
              if (gsp_obj.stoconditioncontrol == "1") {
                //到货温度:arrivalTemperat storageData.storageRes
                for (let storageT = 0; storageT < storageData.length; storageT++) {
                  if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                    error_info.push("到货温度不符合第" + ephCount + "个药品的存储条件");
                  }
                }
              } else {
                //到货温度:arrivalTemperat storageData.storageRes
                for (let storageT = 0; storageT < storageData.length; storageT++) {
                  if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                    remind.push("到货温度不符合第" + ephCount + "个药品的存储条件");
                  }
                }
              }
            }
          }
          if (productData[pro].extend_llyp == "true") {
            coldCount += 1;
            if (timeLicenceDiff > 2) {
              error_info.push("冷链药品运输时间过长");
            }
            //到货温度:arrivalTemperat storageData.storageRes
            for (let storageT = 0; storageT < storageData.length; storageT++) {
              if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData[storageT].storageRes[0].minTemperature) {
                error_info.push("到货温度不符合该冷链药品的存储条件");
              }
            }
          }
        }
      } else if (authProType.length > 0) {
        for (var splx = 0; splx < authDosage.length; splx++) {
          if (productData[pro].extend_tsyp == "true") {
            speCount += 1;
          }
          if (productData[pro].extend_hmhj == "true") {
            ephCount += 1;
          }
          if (productData[pro].extend_llyp == "true") {
            coldCount += 1;
            var startTime = new Date(proStartTime); //起运时间
            var endTime = new Date(proEndTime); //到货时间
            let timeLicenceDiff = parseInt((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24);
            if (timeLicenceDiff > 2) {
              error_info.push("冷链药品运输时间过长");
            }
            //到货温度:arrivalTemperat storageData.storageRes
            for (var storageT = 0; storageT < storageData.length; storageT++) {
              if (arrivalTemperat > storageData[storageT].storageRes[0].maxTemperature || arrivalTemperat < storageData.storageRes[0].minTemperature) {
                error_info.push("到货温度不符合该冷链药品的存储条件");
              }
            }
          }
        }
      }
      if (productData[pro].extend_is_gsp != "1" && productData[pro].extend_is_gsp != "true") {
        error_info.push("第" + sum + "个商品不是GSP商品");
      }
      if (productData[pro].extend_syzt != "1" && productData[pro].extend_syzt != "true") {
        error_info.push("第" + sum + "个商品未通过首营审批");
      }
      if (productData[pro].extend_tsyp == "true" || productData[pro].extend_srfh == "true") {
        error_info.push("第" + sum + "个商品需要双人复核");
      }
      if (proCount > 0 && speCount > 0) {
        error_info.push("特殊药品不能够和其他药品一起采购,且每单只能采购一种特殊药品");
      }
      if (proCount > 0 && ephCount > 0) {
        error_info.push("含麻黄碱药品不能够和其他药品一起采购,且每单只能采购一种含麻黄碱药品");
      }
      if (proCount > 0 && coldCount > 0) {
        error_info.push("冷链药品不能够和其他药品一起采购,且每单只能采购一种冷链药品");
      }
    }
    let count = 0;
    for (let err = 0; err < error_info.length; err++) {
      count += 1;
      errInfo[err] = error_info[err] + " \n ";
    }
    for (let re = 0; re < remind.length; re++) {
      count += 1;
      remindInfo[re] = remind[re] + " \n ";
    }
    //查询采购订单档案详情
    return { errInfo: errInfo, remindInfo: remindInfo };
  }
}
exports({ entryPoint: MyAPIHandler });