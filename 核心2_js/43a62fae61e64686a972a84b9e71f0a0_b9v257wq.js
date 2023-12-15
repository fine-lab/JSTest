var crm = viewModel.getParams().crm || "ezr"; //获取父元素中传递的crm参数
var storeId = viewModel.getParams().storeId || "2500958302803712"; //获取父元素中传递的crm参数
var shopCode = viewModel.getParams().shopCode; //获取父元素中传递的crm参数
var taCode = viewModel.getParams().taCode; //获取父元素中传递的crm参数
var taName = viewModel.getParams().taName; //获取父元素中传递的crm参数
document.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    Query();
  }
});
viewModel.get("button51ha") &&
  viewModel.get("button51ha").on("click", function (data) {
    //查询--单击
    Query();
  });
function Query() {
  //根据手机号查询卡券信息
  ClearValue();
  console.log("手机号查询会员信息开始:");
  let phone = viewModel.get("phone").getValue();
  switch (crm) {
    case "ly":
      lycrm(phone);
      break;
    case "ezr":
      ezrcrm(phone);
      break;
    default:
      cb.utils.alert("crm会员系统不存在" + crm);
      return;
  }
  console.log("卡号查询优惠券结束");
}
function lycrm(phone) {
  let url = ":8101/ipmsmember/membercard/getMemberInfo";
  let body = { value: phone };
  if (phone.length == 11) {
    body.type = "2";
  } else {
    body.type = "1";
  }
  let res = cb.rest.invokeFunction("AT18623B800920000A.api.CRMAPI", { url: url, body: body, ccode: phone, cbustype: "会员查询" }, function (err, res) {}, viewModel, {
    async: false
  });
  console.log("Result:" + JSON.stringify(res));
  if (res.result.code == 200) {
    viewModel.get("name").setValue(res.result.data.name);
    viewModel.get("cardNo").setValue(res.result.data.cardNo);
    viewModel.get("cardId").setValue(res.result.data.cardId);
    viewModel.get("birth").setValue(res.result.data.birth);
    viewModel.get("cardLevel").setValue(res.result.data.cardLevel);
    viewModel.get("cardLevelDescript").setValue(res.result.data.cardLevelDescript);
    viewModel.get("accountBalance").setValue(res.result.data.accountBalance);
    viewModel.get("cardType").setValue(res.result.data.cardType);
    viewModel.get("cardTypeDescript").setValue(res.result.data.cardTypeDescript);
    viewModel.get("dateBegin").setValue(res.result.data.dateBegin);
    viewModel.get("dateEnd").setValue(res.result.data.dateEnd);
    viewModel.get("pointBalance").setValue(res.result.data.pointBalance);
    if (res.result.data.posMode != undefined && res.result.data.posMode != "") {
      viewModel.get("posMode").setValue(res.result.data.posMode.slice(0, 1) + "." + res.result.data.posMode.slice(1));
      viewModel.get("posModeDescript").setValue(res.result.data.posModeDescript);
    } else {
      viewModel.get("posMode").setValue("1.00");
      viewModel.get("posModeDescript").setValue("无折扣");
    }
  } else {
    cb.utils.alert("查询会员信息失败：" + res.result.msg);
    ClearValue();
    return;
  }
  console.log("输出日志开始:" + res.result.log);
  console.log("手机号查询会员信息结束");
  //根据卡号查询优惠券
  console.log("卡号查询优惠券开始");
  let cardNo = viewModel.get("cardNo").getValue();
  if (cardNo == undefined || cardNo == "") {
    cb.utils.alert("卡号为空！");
    return;
  }
  url = ":8102/ipmsgroup/coupon/findCouponDetailListByCardNo";
  body = { pageSize: "10000", firstResult: 0, cardNo: cardNo }; //
  res = cb.rest.invokeFunction("AT18623B800920000A.api.CRMAPI", { url: url, body: body, ccode: cardNo, cbustype: "优惠券查询" }, function (err, res) {}, viewModel, {
    async: false
  });
  console.log("Result:" + JSON.stringify(res));
  if (res.result.code == 200) {
    res.result.data.couponList.forEach((item, index) => {
      if (item.couponDetail.sta == "I") {
        //有效券
        viewModel.getGridModel().appendRow({
          card: item.couponDetail.saleCardNo,
          type: item.coupon.couponType,
          no: item.couponDetail.no,
          name: item.coupon.name,
          presentValue: item.coupon.presentValue,
          validBeginDate: item.coupon.validBeginDate,
          validEndDate: item.coupon.validEndDate
        });
      }
    });
  } else {
    cb.utils.alert("查询优惠券信息信息失败：" + res.result.msg);
    ClearValue();
    return;
  }
  console.log("输出日志开始:" + res.result.log);
}
function ezrcrm(phone) {
  let url = "/api/cvip/vipget";
  let reqdata = {};
  if (phone.length == 11) {
    reqdata.MobileNo = phone;
  } else {
    reqdata.Code = phone;
  }
  //查询主数据
  let res = cb.rest.invokeFunction(
    "AT18623B800920000A.api.EZRAPI",
    {
      url: url,
      data: reqdata,
      ccode: phone,
      cbustype: "会员查询",
      storeId: storeId
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  if (res.result.code == "200") {
    let resinfo = res.result.dataInfo;
    viewModel.get("name").setValue(resinfo.Name);
    viewModel.get("cardNo").setValue(resinfo.OldCode);
    viewModel.get("birth").setValue(resinfo.Birthday);
    viewModel.get("cardLevel").setValue(resinfo.LevelId);
    viewModel.get("cardLevelDescript").setValue(resinfo.Grade);
    viewModel.get("pointBalance").setValue(resinfo.Bonus);
    viewModel.get("dateBegin").setValue(resinfo.GradeChangeDate);
    viewModel.get("dateEnd").setValue(resinfo.GradeValiDate);
    let zkres = cb.rest.invokeFunction("AT18623B800920000A.api.getEzrCrmZk", { dj: resinfo.Grade }, function (err, res) {}, viewModel, {
      async: false
    });
    if (zkres.result.code == "200") {
      viewModel.get("posMode").setValue(zkres.result.dataInfo);
      viewModel.get("posModeDescript").setValue(zkres.result.dataInfo);
    } else {
      viewModel.get("posMode").setValue("1.00");
      viewModel.get("posModeDescript").setValue("无折扣");
    }
  } else {
    cb.utils.alert("查询会员信息失败：" + res.result.msg);
    ClearValue();
    return;
  }
  //根据卡号查询优惠券
  let cardNo = viewModel.get("cardNo").getValue();
  if (cardNo == undefined || cardNo == "") {
    cb.utils.alert("卡号为空！");
    return;
  }
  url = "/api/ccoup/coupget";
  reqdata = {
    OldCode: cardNo,
    ShopCode: shopCode //门店id
  };
  res = cb.rest.invokeFunction(
    "AT18623B800920000A.api.EZRAPI",
    {
      url: url,
      data: reqdata,
      ccode: cardNo,
      cbustype: "优惠券查询",
      storeId: storeId
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  if (res.result.code == 200) {
    res.result.dataInfo.forEach((item, index) => {
      viewModel.getGridModel().appendRow({
        card: cardNo,
        priceLimit: item.PriceLimit,
        type: item.CouponType,
        no: item.CouponNo,
        name: item.CouponName,
        presentValue: item.CouponValue,
        validBeginDate: item.BegDate,
        validEndDate: item.EndDate
      });
    });
    let gmdata = viewModel.getGridModel().getData();
    gmdata.forEach((item, index) => {
      if (item.type == "LP") {
        debugger;
        //如果是礼品券 调用券查询接口 查询适用商品范围
        url = "/api/ccoup/CoupGrpQuery";
        reqdata = {
          CouponNo: item.no
        };
        res = cb.rest.invokeFunction(
          "AT18623B800920000A.api.EZRAPI",
          {
            url: url,
            data: reqdata,
            ccode: cardNo,
            cbustype: "券信息查询",
            storeId: storeId
          },
          function (err, res) {},
          viewModel,
          {
            async: false
          }
        );
        if (res.result.code == 200) {
          viewModel.getGridModel().setCellValue(index, "pro", res.result.dataInfo.CouponPro.join(","));
        } else {
          cb.utils.alert("查询礼品券信息失败：" + res.result.msg);
        }
      }
    });
  } else {
    cb.utils.alert("查询优惠券信息信息失败：" + res.result.msg);
    ClearValue();
    return;
  }
}
viewModel.get("button39pb") &&
  viewModel.get("button39pb").on("click", function (data) {
    try {
      debugger;
      if (!viewModel.get("cardNo").getValue()) {
        cb.utils.alert("请输入会员信息！");
        return false;
      }
      //会员折扣确认
      var parentViewModel = viewModel.getCache("parentViewModel");
      let products = parentViewModel.getBillingContext("products")();
      let selectData = viewModel.getGridModel("memberInfosList").getSelectedRows();
      //卡折扣
      let kzk = viewModel.get("posMode").getValue() || 1;
      if (selectData.length > 1) {
        cb.utils.alert("只能选择一行优惠券折扣！");
        return;
      }
      //金额不等于0的商品行
      let couponProducts = [];
      //整单金额
      let sumMoney = 0;
      //整单数量
      let sumQty = 0;
      products.forEach((item, index) => {
        //金额不为零的参与优惠金额分摊
        if (item.fMoney != 0) {
          couponProducts.push({
            rowNumber: item.rowNumber,
            fMoney: item.fMoney,
            fDiscount: 0
          });
          sumMoney += item.fMoney;
        }
        sumQty += item.fQuantity;
      });
      let errMsg = "";
      let isLp = false;
      selectData.forEach((item, index) => {
        if (crm == "ly") {
          if (item.type != "CP" && item.type != "DK" && item.type != "ZK" && item.type != "DF" && item.type != "RF" && item.type != "RD" && item.type != "PP") {
            errMsg = crm + "券类型错误" + item.type;
          }
        } else if (crm == "ezr") {
          if (item.type != "DJ" && item.type != "ZK" && item.type != "LP") {
            errMsg = crm + "券类型错误" + item.type;
          }
          if (sumMoney < item.priceLimit) {
            errMsg = crm + "未达到使用门槛";
          }
          if (item.type == "LP") {
            isLp = true;
            if (products.length != 1) {
              errMsg = "使用礼品券时商品明细行必须只有一行";
            } else {
              if (item.pro.indexOf(products[0].product_cCode) == -1) {
                errMsg = "当前商品[" + products[0].product_cCode + "]不适用";
              }
            }
          }
        } else {
          errMsg = "crm会员系统不存在" + crm;
        }
      });
      if (errMsg != "") {
        cb.utils.alert(errMsg);
        return;
      }
      //整体折扣额度
      let couponMoney = 0;
      //折扣卡券
      let no;
      if (isLp) {
        no = selectData[0].no;
        couponMoney = sumMoney;
      } else {
        //会员卡优惠
        couponMoney = Number(sumMoney * (1 - Number(kzk))).toFixed(2);
        switch (
          crm //折扣力度
        ) {
          case "ly":
            selectData.forEach((item, index) => {
              if (item.type == "ZK" || item.type == "RF" || item.type == "RD") {
                //折扣券
                couponMoney = (Number(couponMoney) + (Number(sumMoney) - Number(couponMoney)) * (1 - Number(item.presentValue))).toFixed(2);
              } else {
                couponMoney = Number(couponMoney) + Number(item.presentValue);
              }
              no = item.no;
            });
            break;
          case "ezr":
            selectData.forEach((item, index) => {
              if (item.type == "ZK") {
                //折扣券
                couponMoney = (Number(couponMoney) + (Number(sumMoney) - Number(couponMoney)) * (1 - Number(item.presentValue))).toFixed(2);
              } else {
                couponMoney = Number(couponMoney) + Number(item.presentValue);
              }
              no = item.no;
            });
            break;
          default:
            cb.utils.alert("crm会员系统不存在" + crm);
            return;
        }
      }
      if (couponMoney != 0) {
        //将crm优惠金额 分摊到 couponProducts 的 fDiscount 上
        let sumDiscount = 0; //已分配金额
        couponProducts.forEach((item, index) => {
          debugger;
          let rowDiscount = 0;
          if (couponProducts.length == index + 1) {
            //最后一行金额做差额
            rowDiscount = (Number(couponMoney) - Number(sumDiscount)).toFixed(2);
          } else {
            rowDiscount = ((Number(item.fMoney) / Number(sumMoney)) * Number(couponMoney)).toFixed(2);
          }
          couponProducts[index].fDiscount = rowDiscount;
          sumDiscount = (Number(sumDiscount) + Number(rowDiscount)).toFixed(2);
        });
        //重算折扣额，金额
        products.forEach((item, index) => {
          let couponProduct = couponProducts.find((obj) => obj.rowNumber === item.rowNumber);
          if (couponProduct != undefined) {
            products[index].fDiscount = couponProduct.fDiscount;
            products[index].fSceneDiscount = couponProduct.fDiscount;
            products[index].fDiscount = couponProduct.fDiscount;
            products[index].fMoney = item.fPrice * item.fQuantity - couponProduct.fDiscount;
          }
        });
      }
      let crmCache = {
        memName: viewModel.get("name").getValue(),
        cardId: viewModel.get("cardId").getValue(),
        cardNo: viewModel.get("cardNo").getValue(),
        no: no,
        crm: crm,
        accountMoney: 0, //||, //卡消费金额
        shopCode: shopCode, //核销门店
        salesMoney: couponMoney || 0, //核销金额
        taCode: taCode,
        storeId: storeId
      };
      let requestData = {
        code: no || "",
        fQuantitySum: sumQty,
        fMoneySum: sumMoney,
        fSceneDiscountSum: couponMoney
      };
      if (couponMoney != 0) {
        parentViewModel.billingFunc.updateProducts(products);
      }
      parentViewModel.getParams().crmCache = JSON.stringify(crmCache);
      viewModel.communication({ type: "modal", payload: { data: false } });
    } catch (e) {
      cb.utils.alert(e.toString());
    }
  });
function ClearValue() {
  viewModel.get("name").setValue("");
  viewModel.get("cardNo").setValue("");
  viewModel.get("cardId").setValue("");
  viewModel.get("birth").setValue("");
  viewModel.get("cardLevel").setValue("");
  viewModel.get("cardLevelDescript").setValue("");
  viewModel.get("accountBalance").setValue("");
  viewModel.get("cardType").setValue("");
  viewModel.get("cardTypeDescript").setValue("");
  viewModel.get("dateBegin").setValue("");
  viewModel.get("dateEnd").setValue("");
  viewModel.get("pointBalance").setValue("");
  viewModel.get("posMode").setValue("");
  viewModel.get("posModeDescript").setValue("");
  viewModel.getGridModel().clear();
}
viewModel.get("button43pd") &&
  viewModel.get("button43pd").on("click", function (data) {
    //取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });