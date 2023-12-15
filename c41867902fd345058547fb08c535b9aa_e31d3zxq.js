let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //根据开票组织和物料id查询GSP商品档案信息
    let bill = param.data[0];
    if (bill.extend_gspType || bill.extend_gspType == "1") {
      return {};
    }
    let orderDetails = bill.orderDetails;
    //来源类型
    for (let i = 0; i < orderDetails.length; i++) {
      //判断物料是否有批准文号
      let settlementOrgId = orderDetails[i].settlementOrgId;
      let productId = orderDetails[i].productId;
      let extendLicenseNumber = orderDetails[i].extendLicenseNumber;
      let skuId = orderDetails[i].skuId;
      let orderDetailCharacteristics = orderDetails[i].orderDetailCharacteristics;
      let agentid = bill.agentId;
      let salesmanid;
      if (agentid != null && agentid != undefined) {
        let yonsql = "select id from GT22176AT10.GT22176AT10.SY01_osalesmanv2 where ocustomer = '" + agentid + "'";
        let salesman = ObjectStore.queryByYonQL(yonsql, "sy01");
        if (salesman.length > 0) {
          salesmanid = salesman[0].id;
        }
      }
      let selectFields = "standardCode,storageCondition,manufacturer,approvalNumber,productLincenseNo,materialType";
      let sql = "select material,isSku from GT22176AT10.GT22176AT10.SY01_material_file where org_id  = " + settlementOrgId + " and material = " + productId;
      let prodInfos = ObjectStore.queryByYonQL(sql, "sy01");
      if (prodInfos.length > 0) {
        let sytype = prodInfos[0].isSku; //0：物料；1：物料+sku; 2:物料+特征；
        //按照物料+sku首营逻辑判断
        if (sytype == "1") {
          sql =
            "select " +
            selectFields +
            " from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" +
            settlementOrgId +
            "' and material = '" +
            productId +
            "'  and dr = 0 and enable = '1' and materialSkuCode = '" +
            skuId +
            "'";
          let materialFile = ObjectStore.queryByYonQL(sql, "sy01");
          if (materialFile.length > 0) {
            bill.set("extend_gspType", "true");
            bill.set("extendCustomSalesman", salesmanid);
            //表体设置
            if (typeof materialFile[0].standardCode != "undefined") {
              orderDetails[i].set("extend_standard_code", materialFile[0].standardCode);
            }
            if (typeof materialFile[0].storageCondition != "undefined") {
              orderDetails[i].set("extendStorageCondition", materialFile[0].storageCondition);
            }
            if (typeof materialFile[0].manufacturer != "undefined") {
              orderDetails[i].set("extendMfrs", materialFile[0].manufacturer);
            }
            if (typeof materialFile[0].approvalNumber != "undefined") {
              orderDetails[i].set("extendLicenseNumber", materialFile[0].approvalNumber);
            }
            if (typeof materialFile[0].productLincenseNo != "undefined") {
              orderDetails[i].set("extendProdLicense", materialFile[0].productLincenseNo);
            }
            if (typeof materialFile[0].materialType != "undefined") {
              orderDetails[i].set("extendGspPrdType", materialFile[0].materialType);
            }
            orderDetails[i].set("extendCustomSalesman", salesmanid);
          }
        }
        if (sytype == "2") {
          //按照物料 + 特征逻辑判断
          //查询当前商品GSP特征敏感项编码公共方法。
          let gspkeyparams = { materialId: materialId };
          let gspkeyfieldsfun = extrequire("GT22176AT10.publicFunction.getGSPKeyFields");
          let keyfields = gspkeyfieldsfun.execute(gspkeyparams);
          let nullSenceFeatureStr = "",
            featureCondition = "",
            featureTip = "";
          for (let f = 0; f < keyfields.fields.length; f++) {
            let keyfield = keyfields.fields[f];
            if (keyfield != undefined && keyfield != null && keyfield != "") {
              let keyfieldname = keyfield.featureCode + "_name";
              let mathFlag = false;
              for (let key in characteristics) {
                if (key == keyfieldname) {
                  mathFlag = true;
                  let keyvalue = characteristics[key];
                  if (keyvalue == null) {
                    nullSenceFeatureStr = nullSenceFeatureStr + keyfield.featureName + ";";
                  }
                  featureCondition = featureCondition + " and freeCTH." + keyfield.featureCode + " = '" + characteristics[keyfield.featureCode] + "'";
                  featureTip = featureTip + keyfield.featureName + ":" + keyvalue + ";";
                  currentTZMap.set(keyfieldname, keyvalue);
                  m_keyfieldArray.push(keyfieldname);
                  m_keyfieldValue.push(keyvalue);
                }
              }
              if (!mathFlag) {
                nullSenceFeatureStr = nullSenceFeatureStr + keyfield.featureName + ";";
              }
            }
          }
          if (keyfields.fields.length > 0 && nullSenceFeatureStr != "") {
            continue;
          }
          sql =
            "select " +
            selectFields +
            " from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" +
            settlementOrgId +
            "' and material = '" +
            materialId +
            "'  and dr = 0 and enable = '1' " +
            featureCondition;
          materialFile = ObjectStore.queryByYonQL(sql, "sy01");
          if (materialFile.length > 0) {
            bill.set("extend_gspType", "true");
            bill.set("extendCustomSalesman", salesmanid);
            //表体设置
            if (typeof materialFile[0].standardCode != "undefined") {
              orderDetails[i].set("extend_standard_code", materialFile[0].standardCode);
            }
            if (typeof materialFile[0].storageCondition != "undefined") {
              orderDetails[i].set("extendStorageCondition", materialFile[0].storageCondition);
            }
            if (typeof materialFile[0].manufacturer != "undefined") {
              orderDetails[i].set("extendMfrs", materialFile[0].manufacturer);
            }
            if (typeof materialFile[0].approvalNumber != "undefined") {
              orderDetails[i].set("extendLicenseNumber", materialFile[0].approvalNumber);
            }
            if (typeof materialFile[0].productLincenseNo != "undefined") {
              orderDetails[i].set("extendProdLicense", materialFile[0].productLincenseNo);
            }
            if (typeof materialFile[0].materialType != "undefined") {
              orderDetails[i].set("extendGspPrdType", materialFile[0].materialType);
            }
            orderDetails[i].set("extendCustomSalesman", salesmanid);
          }
        }
        if (sytype == "0") {
          sql = "select " + selectFields + " from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" + settlementOrgId + "' and material = '" + productId + "' and dr = 0 and enable = '1'";
          let materialFile = ObjectStore.queryByYonQL(sql, "sy01");
          if (materialFile.length > 0) {
            //表头设置
            bill.set("extend_gspType", "true");
            bill.set("extendCustomSalesman", salesmanid);
            //表体设置
            if (typeof materialFile[0].standardCode != "undefined") {
              orderDetails[i].set("extend_standard_code", materialFile[0].standardCode);
            }
            if (typeof materialFile[0].storageCondition != "undefined") {
              orderDetails[i].set("extendStorageCondition", materialFile[0].storageCondition);
            }
            if (typeof materialFile[0].manufacturer != "undefined") {
              orderDetails[i].set("extendMfrs", materialFile[0].manufacturer);
            }
            if (typeof materialFile[0].approvalNumber != "undefined") {
              orderDetails[i].set("extendLicenseNumber", materialFile[0].approvalNumber);
            }
            if (typeof materialFile[0].productLincenseNo != "undefined") {
              orderDetails[i].set("extendProdLicense", materialFile[0].productLincenseNo);
            }
            if (typeof materialFile[0].materialType != "undefined") {
              orderDetails[i].set("extendGspPrdType", materialFile[0].materialType);
            }
            if (salesmanid != "") {
              orderDetails[i].set("extendCustomSalesman", salesmanid);
            }
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });