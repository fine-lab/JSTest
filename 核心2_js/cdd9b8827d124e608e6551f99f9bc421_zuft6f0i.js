let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let req = {
      iBurdenAmountType: "0",
      cEPName: "",
      iType: "1",
      cTitle: "",
      cSubTitle: "",
      cRemind: "",
      cNotice: "",
      cWelcome: "",
      cBackColor: "#333",
      bMarketingSetting: "0",
      iElecCard: true,
      bEnablePassword: false,
      cCouponScene: "",
      iQuantity: 999,
      iReceiveLimit: 2,
      iStartQuantity: 0,
      fStartAmount: 2,
      iStartAmountScope: 1,
      iFirstAttentionSend: "0",
      iMemberBind: false,
      fReduceAmount: 10,
      iUnLimitCount: false,
      fDiscount: 10,
      fDiscountRate: "1",
      fReferencePrice: 5,
      iReceiveMethod: "",
      iReceiveBySelf: false,
      iReceiveByOther: false,
      iDiscountType: "1",
      iDownLinePayType: false,
      iRetailPayMethodName: 0,
      iSaleDiscountType: 0,
      bHideExpireDate: true,
      iShopOrOrg: "0",
      iScopeType: "1",
      iExchangeGoodsCount: "1",
      iScopeTypeException: 0,
      bOlineMall: "1",
      bUmallSettlement: "0",
      bLimitStore: true,
      bApplyUDHShop: false,
      cApplicableScene: "",
      iExpMode: "1",
      iDiscountMethod: null,
      dCouponEffectDate: "",
      dCouponExpDate: "",
      iintervalEffectUnit: "1",
      iintervalExpUnit: "1",
      iCanUseTime: "0",
      cWeekDays: "",
      cServicePhone: "",
      couponStore: [],
      _status: "Insert",
      iUnReceiveCount: 0,
      iReceiveCount: 0,
      cLimitMemberLevelIDs: ""
    };
    req.cEPName = request.cEPName;
    req.iType = request.iType;
    req.cTitle = request.cTitle;
    req.cSubTitle = request.cSubTitle;
    req.cRemind = request.cRemind;
    req.cNotice = request.cNotice;
    req.cWelcome = request.cWelcome;
    req.cBackColor = request.cBackColor;
    req.iQuantity = request.iQuantity;
    req.iReceiveLimit = request.iReceiveLimit;
    req.fStartAmount = request.fStartAmount;
    req.fReduceAmount = request.fReduceAmount;
    req.fDiscount = request.fDiscount;
    req.fReferencePrice = request.fReferencePrice;
    req.iDiscountType = request.iDiscountType;
    req.iScopeType = request.iScopeType;
    req.iExpMode = request.iExpMode;
    req.dCouponEffectDate = request.dCouponEffectDate;
    req.dCouponExpDate = request.dCouponExpDate;
    req.cServicePhone = request.cServicePhone;
    req.iUnReceiveCount = request.iUnReceiveCount;
    req.iReceiveCount = request.iReceiveCount;
    req.couponStore = request.couponStore;
    req.cStoreIDs = request.cStoreIDs;
    req.couponGoods = request.couponGoods;
    let body = {
      billnum: "pt_coupon",
      data: JSON.stringify(req)
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1767B4C61D580001", JSON.stringify(body));
    let data = JSON.parse(apiResponse);
    return {
      data
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});