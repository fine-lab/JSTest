run = function (event) {
  var viewModel = this;
  //通过代码发布函数updateViewMeta更新UI元数据的属性
  //例子：设置布局(容器)的隐藏
  viewModel.on("afterLoadData", function () {
    let extendSyzt = viewModel.get("extend_first_status").getValue();
    //首营状态:extendSyzt == 2  已审批
    if (extendSyzt == 2 || extendSyzt == "2") {
      let extend_tym = viewModel.get("extend_gsp_supplier_catgrory_catagoryName"); //GSP供应商分类
      extend_tym.setState("bCanModify", false);
      let extend_pzwh = viewModel.get("extend_ele_supervision_code"); //电子监管编码
      extend_pzwh.setState("bCanModify", false);
      let extend_yhlb_curingTypeName = viewModel.get("extend_qc_assurance_system"); //质量保证体系
      extend_yhlb_curingTypeName.setState("bCanModify", false);
      let extend_cctj_storageName = viewModel.get("extend_import_license"); //重要证照
      extend_cctj_storageName.setState("bCanModify", false);
      let extend_jxqlb_nearName = viewModel.get("extend_gmp_license"); //GMP认证证书
      extend_jxqlb_nearName.setState("bCanModify", false);
      let extend_bc_id = viewModel.get("extend_gsplicense"); //GSP认证证书
      extend_bc_id.setState("bCanModify", false);
      let manufacturer = viewModel.get("extend_sealandticket"); //印章及随货同行票样
      manufacturer.setState("bCanModify", false);
      let extend_jx_dosagaFormName = viewModel.get("extend_purandsaleondutycer"); //购销人员上岗证
      extend_jx_dosagaFormName.setState("bCanModify", false);
      let placeOfOrigin = viewModel.get("extend_qualityguaagreement"); //质量保证协议
      placeOfOrigin.setState("bCanModify", false);
      let extend_ssxkcyr_ip_name = viewModel.get("extend_purandsalecertificates"); //购销人员证件
      extend_ssxkcyr_ip_name.setState("bCanModify", false);
      let extend_gsp_spfl_catagoryname = viewModel.get("extend_orgcertificate"); //组织机构代码证
      extend_gsp_spfl_catagoryname.setState("bCanModify", false);
      let extend_cffl = viewModel.get("extend_license"); //营业执照
      extend_cffl.setState("bCanModify", false);
      let extend_zlbz = viewModel.get("extend_durg_create_licence"); //药品生产企业许可证
      extend_zlbz.setState("bCanModify", false);
      let extend_standard_code = viewModel.get("extend_durg_jy_license"); //药品经营企业许可证
      extend_standard_code.setState("bCanModify", false);
      let extend_imregisterlicenseNo = viewModel.get("extend_legalpersonpaper"); //法人委托书
      extend_imregisterlicenseNo.setState("bCanModify", false);
    }
  });
  viewModel.on("afterMount", function () {
    var extend_is_gspModel = viewModel.get("extend_is_gsp");
    var extend_is_transporterpModel = viewModel.get("extend_is_carrier");
    viewModel.on("afterLoadData", function () {
      if (extend_is_gspModel.getValue() == "true" || extend_is_gspModel.getValue() == true) {
        console.log(extend_is_transporterpModel.getValue());
        viewModel.execute("updateViewMeta", {
          code: "group36xb", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
        viewModel.execute("updateViewMeta", {
          code: "group53yc", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
        viewModel.execute("updateViewMeta", {
          code: "group64oh", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
        viewModel.execute("updateViewMeta", {
          code: "group75wg", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
      } else {
        viewModel.execute("updateViewMeta", {
          code: "group36xb", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
        viewModel.execute("updateViewMeta", {
          code: "group53yc", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
        viewModel.execute("updateViewMeta", {
          code: "group64oh", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
        viewModel.execute("updateViewMeta", {
          code: "group75wg", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
      }
      if (extend_is_transporterpModel.getValue() == "true" || extend_is_transporterpModel.getValue() == true) {
        viewModel.execute("updateViewMeta", {
          code: "group39mh", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
        viewModel.execute("updateViewMeta", {
          code: "group46zd", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
      } else {
        viewModel.execute("updateViewMeta", {
          code: "group39mh", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
        viewModel.execute("updateViewMeta", {
          code: "group46zd", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
      }
    });
    extend_is_gspModel.on("afterValueChange", function (data) {
      if (extend_is_gspModel.getValue() == true || extend_is_gspModel.getValue() == "true") {
        viewModel.execute("updateViewMeta", {
          code: "group36xb", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
        viewModel.execute("updateViewMeta", {
          code: "group53yc", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
        viewModel.execute("updateViewMeta", {
          code: "group64oh", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
        viewModel.execute("updateViewMeta", {
          code: "group75wg", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
      } else {
        viewModel.execute("updateViewMeta", {
          code: "group36xb", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
        viewModel.execute("updateViewMeta", {
          code: "group53yc", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
        viewModel.execute("updateViewMeta", {
          code: "group64oh", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
        viewModel.execute("updateViewMeta", {
          code: "group75wg", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
      }
    });
    extend_is_transporterpModel.on("afterValueChange", function (data) {
      if (extend_is_transporterpModel.getValue() == true || extend_is_transporterpModel.getValue() == "true") {
        viewModel.execute("updateViewMeta", {
          code: "group39mh", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
        viewModel.execute("updateViewMeta", {
          code: "group46zd", // 容器的编码（从UI设计器属性栏查看）
          visible: true
        });
      } else {
        viewModel.execute("updateViewMeta", {
          code: "group39mh", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
        viewModel.execute("updateViewMeta", {
          code: "group46zd", // 容器的编码（从UI设计器属性栏查看）
          visible: false
        });
      }
    });
    viewModel.on("afterSave", function () {
      let isCarrier = viewModel.get("extend_is_carrier").getValue();
      if (isCarrier == true || isCarrier == 1 || isCarrier == "true" || isCarrier == "1") {
        //驾驶员信息
        let gridModel = viewModel.getGridModel("carrier_driversList"); //获取表格当前页面所有的行数据
        const rowAllDatas = gridModel.getRows();
        let carriers = [];
        if (typeof rowAllDatas != "undefined") {
          for (let i = 0; i < rowAllDatas.length; i++) {
            carriers.push({
              orgId: viewModel.get("vendorApplyRange_org").getValue(), //承运商ID
              orgName: viewModel.get("vendorApplyRange_org_name").getValue(), //承运商ID
              carrierId: viewModel.get("id").getValue(), //承运商ID
              carrierCode: viewModel.get("code").getValue(), //承运商编码
              carrierName: viewModel.get("name").getValue(), //承运商名称
              driverName: rowAllDatas[i].extend_driver_name, //驾驶员名称
              dirverIdCode: rowAllDatas[i].extend_dirver_id_code, //驾驶员身份证
              drivingLicense: rowAllDatas[i].extend_driving_license, //驾驶证号码
              licenseEndDate: rowAllDatas[i].extend_license_end_date, //驾驶证有效期至
              isDefault: rowAllDatas[i].extend_is_default, //是否默认
              isDisable: rowAllDatas[i].extend_is_disable, //是否禁用
              remark: rowAllDatas[i].extend_remark //备注
            });
          }
        }
        //车辆信息
        let carGridModel = viewModel.getGridModel("carrier_carList"); //获取表格当前页面所有的行数据
        let carRowAllDatas = carGridModel.getRows();
        let carrierCars = [];
        if (typeof carRowAllDatas != "undefined") {
          for (let i = 0; i < carRowAllDatas.length; i++) {
            carrierCars.push({
              orgId: viewModel.get("vendorApplyRange_org").getValue(), //承运商ID
              orgName: viewModel.get("vendorApplyRange_org_name").getValue(), //承运商ID
              carrierId: viewModel.get("id").getValue(), //承运商ID
              carrierName: viewModel.get("name").getValue(), //承运商名称
              carName: carRowAllDatas[i].extend_car_name, //车辆名称
              carPermitEndDate: carRowAllDatas[i].extend_car_permit_end_date, //行驶证有效期至
              carLicenseNum: carRowAllDatas[i].extend_license_plate, //车牌号
              isDefault: carRowAllDatas[i].extend_is_default, //是否默认
              isDisable: carRowAllDatas[i].extend_is_disable, //是否禁用
              remark: carRowAllDatas[i].extend_remark //备注
            });
          }
        }
        cb.rest.invokeFunction1 = function (id, data, callback, viewModel, options) {
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
        var promise = new cb.promise();
        cb.rest.invokeFunction1(
          "GZTBDM.backDefaultGroup.getCrriersInfo",
          {
            carriers: carriers,
            carrierCars: carrierCars
          },
          function (err, res) {
            debugger;
            if (typeof res != "undefined") {
              let sccessInfo = res.sccessInfo;
              if (sccessInfo.length > 0) {
                cb.utils.alert(sccessInfo);
                console.log(res);
                promise.resolve();
              } else {
                promise.reject();
              }
            }
          },
          undefined,
          { domainKey: "sy01" }
        );
        return promise;
      }
    });
    let lincense_grid = viewModel.getGridModel("extend_lincenseList");
    let lincense_fw_grid = viewModel.getGridModel("extend_licenseScopeList");
    lincense_fw_grid.on("beforeSetDataSource", function (data) {
      let sqType = lincense_grid.getCellValue(lincense_grid.getFocusedRowIndex(), "extend_auth_type_v2");
      switchDisplayFields(lincense_fw_grid, sqType - 1);
    });
    let auth_grid = viewModel.getGridModel("attorney_authList");
    let auth_fw_grid = viewModel.getGridModel("scope_authorityList");
    auth_fw_grid.on("beforeSetDataSource", function (data) {
      let sqType = auth_grid.getCellValue(auth_grid.getFocusedRowIndex(), "extend_auth_scope");
      switchDisplayFields(auth_fw_grid, sqType - 1);
    });
    switchDisplayFields = function (gridModel, number) {
      let fields = ["extend_pro_auth_type_name", "extend_protype_auth_type_catagoryname", "extend_dosage_auth_type_dosagaFormName"];
      for (let i = 0; i < fields.length; i++) {
        if (i == number) {
          gridModel.setColumnState(fields[i], "visible", true);
        } else {
          gridModel.setColumnState(fields[i], "visible", false);
        }
      }
    };
  });
};