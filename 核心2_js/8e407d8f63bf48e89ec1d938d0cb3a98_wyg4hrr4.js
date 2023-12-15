viewModel.on("customInit", function (data) {
  // 业务流转单详情--页面初始化
});
viewModel.get("button36hf") &&
  viewModel.get("button36hf").on("click", function (data) {
    // 按钮--单击
    var mydata = viewModel.getAllData();
    //获取应收应付、收付款单
    var YSYF = cb.rest.invokeFunction("GT2054AT4.backDesignerFunction.GETYSYF01", { yewuhaoxiangmu: mydata.yewuhaoxiangmu }, function (err, res) {}, viewModel, { async: false }).result.res;
    var SFKD = cb.rest.invokeFunction("GT2054AT4.backDesignerFunction.GETSFKD001", { yewuhaoxiangmu: mydata.yewuhaoxiangmu }, function (err, res) {}, viewModel, { async: false }).result.res;
    if (!mydata.yewuchengbenjiamubiao || !mydata.yewuchengbenjiamubiao_code) {
      cb.utils.alert("请先选择业务成本价目表");
      return;
    }
    var YWCB = cb.rest.invokeFunction("GT2054AT4.backDesignerFunction.GETYWCB01", { id: mydata.yewuchengbenjiamubiao }, function (err, res) {}, viewModel, { async: false }).result.res;
    console.log(mydata);
    console.log(YSYF);
    console.log(SFKD);
    console.log(YWCB);
    //初始化信息
    var updata = {};
    updata.jiqi = 0;
    updata.yuanqi = 0;
    updata.tiexi = 0;
    updata.piaoxi = 0;
    updata.qmefeiyongjiajiakejifeiyong = 0;
    updata.shichangweihufeiyong = 0;
    updata.tongdaofei = 0;
    updata.zijinliangxiugai = 0;
    updata.qudaoshuidianchengben = 0;
    //获取应收应付、收付款单
    if (mydata.yewudalei_name == "贸金") {
    }
    for (var i = 0; i < SFKD.length; i++) {
      //业务用款_即期&业务用款_即期_手续费&业务用款-即期-收票
      if (
        SFKD[i].Documenttype == "1" &&
        SFKD[i].Whetherbusiness == "1" &&
        (SFKD[i].Expenseitems == "1529184124780150796" || SFKD[i].Expenseitems == "1529184124780150798" || SFKD[i].Expenseitems == "1533686642075762692")
      ) {
        updata.jiqi += Number(SFKD[i].money);
      }
      if (
        SFKD[i].Documenttype == "2" &&
        SFKD[i].Whetherbusiness == "1" &&
        (SFKD[i].Expenseitems == "1529184124780150796" || SFKD[i].Expenseitems == "1529184124780150798" || SFKD[i].Expenseitems == "1533686642075762692")
      ) {
        updata.jiqi -= Number(SFKD[i].money);
      }
      if (SFKD[i].Documenttype == "2" && SFKD[i].Whetherbusiness == "1" && SFKD[i].Expenseitems == "1687385817723437059") {
        updata.tongdaofei += Number(SFKD[i].money);
      }
      if (SFKD[i].Documenttype == "1" && SFKD[i].Whetherbusiness == "1" && SFKD[i].Expenseitems == "1687385817723437059") {
        updata.tongdaofei -= Number(SFKD[i].money);
      }
      if (SFKD[i].Documenttype == "2" && SFKD[i].Whetherbusiness == "1" && SFKD[i].Expenseitems == "1757252737943732230") {
        updata.qudaoshuidianchengben += Number(SFKD[i].money);
      }
      if (SFKD[i].Documenttype == "1" && SFKD[i].Whetherbusiness == "1" && SFKD[i].Expenseitems == "1757252737943732230") {
        updata.qudaoshuidianchengben -= Number(SFKD[i].money);
      }
    }
    debugger;
    for (var i = 0; i < YSYF.length; i++) {
      //应收 1547049608180400137    即期   1529184124780150796
      if (
        YSYF[i].jiaoyileixing == "1547049608180400137" &&
        (YSYF[i].feiyongxiangmu == "1529184124780150796" || YSYF[i].feiyongxiangmu == "1529184124780150798" || YSYF[i].feiyongxiangmu == "1533686642075762692")
      ) {
        updata.jiqi += Number(YSYF[i].jine);
      }
      //应付    即期   1529184124780150796
      if (
        YSYF[i].jiaoyileixing == "1547049668298407943" &&
        (YSYF[i].feiyongxiangmu == "1529184124780150796" || YSYF[i].feiyongxiangmu == "1529184124780150798" || YSYF[i].feiyongxiangmu == "1533686642075762692")
      ) {
        updata.jiqi -= Number(YSYF[i].jine);
      }
    }
    debugger;
    for (var i = 0; i < YSYF.length; i++) {
      if (YSYF[i].shifuyewu == "1") {
        switch (YSYF[i].feiyongxiangmu) {
          //应收 1547049608180400137
          case "1529184124780150800": {
            if (YSYF[i].jiaoyileixing == "1547049608180400137") {
              updata.yuanqi += YSYF[i].jine;
            } else {
              updata.yuanqi -= YSYF[i].jine;
            }
            break;
          } //业务用款_远期
          case "1529184133370085376": {
            if (YSYF[i].jiaoyileixing == "1547049608180400137") {
              updata.tiexi += YSYF[i].jine;
            } else {
              updata.tiexi -= YSYF[i].jine;
            }
            break;
          } //业务用款_贴息
          case "1529184133370085378": {
            if (YSYF[i].jiaoyileixing == "1547049608180400137") {
              updata.piaoxi += YSYF[i].jine;
            } else {
              updata.piaoxi -= YSYF[i].jine;
            }
            break;
          } //业务用款_票息
          case "1529184184909692941": {
            updata.cangchuchengben += YSYF[i].jine;
            break;
          } //供应链科技仓储成本
          case "1529184184909692943": {
            updata.qmefeiyongjiajiakejifeiyong += YSYF[i].jine;
            break;
          } //QME费用
          case "1529184184909692945": {
            updata.qmefeiyongjiajiakejifeiyong += YSYF[i].jine;
            break;
          } //加佳科技费用
          case "1529184193499627529": {
            updata.shichangweihufeiyong += YSYF[i].jine;
            break;
          } //市场维护费
          case "1687385817723437059": {
            if (YSYF[i].jiaoyileixing == "1547049608180400137") {
              updata.tongdaofei -= YSYF[i].jine;
            } else {
              updata.tongdaofei += YSYF[i].jine;
            }
            break;
          } //中介费
          case "1757252737943732230": {
            if (YSYF[i].jiaoyileixing == "1547049608180400137") {
              updata.qudaoshuidianchengben -= YSYF[i].jine;
            } else {
              updata.qudaoshuidianchengben += YSYF[i].jine;
            }
            break;
          } //贸易利润返还
        }
      }
    }
    //处理贸易成本,暂时跳过,由页面规则实现
    for (var i = 0; i < mydata.XMLZ03List.length; i++) {}
    //处理团队分摊
    updata.mainnum = 0;
    updata.othnum = 0;
    updata.othtotal = 0;
    for (var i = 0; i < mydata.XMLZ04List.length; i++) {
      if (mydata.XMLZ04List[i].shifuzhutuandui == "2") {
        updata.mainfentanfangshi = mydata.XMLZ04List[i].fentanfangshi;
        updata.mainnum = i;
      }
    }
    if (!updata.mainfentanfangshi) {
      updata.mainfentanfangshi = mydata.XMLZ04List[0].fentanfangshi;
    }
    for (var i = 0; i < mydata.XMLZ04List.length; i++) {
      if (updata.mainfentanfangshi != mydata.XMLZ04List[i].fentanfangshi) {
        cb.utils.alert("请保证全部团队分摊方式类型相同！");
        return;
      } else {
        if (mydata.XMLZ04List[i].fentanfangshi == "2") {
          if (mydata.XMLZ04List[i].shifuzhutuandui != "2") mydata.XMLZ04List[i].fentanbili = (mydata.XMLZ04List[i].fentanjine / mydata.shouruheji).toFixed(2);
          updata.othnum += Number(mydata.XMLZ04List[i].fentanbili);
        } else {
          updata.othtotal += mydata.XMLZ04List[i].fentanjine;
        }
      }
    }
    if (updata.mainfentanfangshi == "2") {
      if (updata.mainnum == 0) mydata.XMLZ04List[updata.mainnum].fentanbili = 1 - Number(updata.othnum) + Number(mydata.XMLZ04List[updata.mainnum].fentanbili);
      else mydata.XMLZ04List[updata.mainnum].fentanbili = 1 - Number(updata.othnum);
    } else {
      if (updata.mainnum != 0) {
        mydata.XMLZ04List[updata.mainnum].fentanjine = Number(mydata.shouruheji) - Number(updata.othtotal);
      }
    }
    console.log(updata);
    viewModel.get("jiqi").setValue(updata.jiqi);
    viewModel.get("jiqi").execute("valueChange");
    viewModel.get("yuanqi").setValue(updata.yuanqi);
    viewModel.get("yuanqi").execute("valueChange");
    viewModel.get("tiexi").setValue(updata.tiexi);
    viewModel.get("tiexi").execute("valueChange");
    viewModel.get("piaoxi").setValue(updata.piaoxi);
    viewModel.get("piaoxi").execute("valueChange");
    debugger;
    viewModel.get("qmefeiyongjiajiakejifeiyong").setValue(updata.qmefeiyongjiajiakejifeiyong);
    viewModel.get("qmefeiyongjiajiakejifeiyong").execute("valueChange");
    viewModel.get("shichangweihufeiyong").setValue(updata.shichangweihufeiyong);
    viewModel.get("shichangweihufeiyong").execute("valueChange");
    viewModel.get("tongdaofei").setValue(updata.tongdaofei);
    viewModel.get("tongdaofei").execute("valueChange");
    viewModel.get("qudaoshuidianchengben").setValue(updata.qudaoshuidianchengben);
    viewModel.get("qudaoshuidianchengben").execute("valueChange");
    if (updata.jiqi + updata.tiexi < 0) {
      viewModel.get("zijinliang").setValue(-(updata.jiqi + updata.tiexi));
    } else {
      viewModel.get("zijinliang").setValue(0);
    }
    updata.zijinliangxiugai = viewModel.get("zijinliangxiugai").getValue();
    //元数据
    if (updata.zijinliangxiugai == 0 || updata.zijinliangxiugai == null || updata.zijinliangxiugai == undefined) {
      viewModel
        .get("houzhizijinchengben")
        .setValue(
          (viewModel.get("yuanqi").getValue() *
            (!!viewModel.get("houzhizijinchengbenlv").getValue() ? viewModel.get("houzhizijinchengbenlv").getValue() : 0) *
            (!!viewModel.get("tianshu").getValue() ? viewModel.get("tianshu").getValue() : 0)) /
            365
        );
    } else {
      viewModel
        .get("houzhizijinchengben")
        .setValue(
          (viewModel.get("zijinliangxiugai").getValue() *
            (!!viewModel.get("houzhizijinchengbenlv").getValue() ? viewModel.get("houzhizijinchengbenlv").getValue() : 0) *
            (!!viewModel.get("tianshu").getValue() ? viewModel.get("tianshu").getValue() : 0)) /
            365
        );
    }
    var piaojuqudaochengben =
      (!!viewModel.get("piaojuqudaochengbenlv").getValue() ? viewModel.get("piaojuqudaochengbenlv").getValue() : 0) * (!!viewModel.get("tiexi").getValue() ? viewModel.get("tiexi").getValue() : 0);
    if (piaojuqudaochengben > 0) {
      viewModel.get("piaojuqudaochengben").setValue(piaojuqudaochengben);
    } else {
      viewModel.get("piaojuqudaochengben").setValue(0);
    }
    viewModel
      .get("shouruheji")
      .setValue(
        updata.jiqi +
          updata.tiexi +
          updata.yuanqi +
          updata.piaoxi -
          (!!viewModel.get("qudaoshuidianchengben").getValue() ? Number(viewModel.get("qudaoshuidianchengben").getValue()) : 0) -
          (!!viewModel.get("tongdaofei").getValue() ? viewModel.get("tongdaofei").getValue() : 0)
      );
    viewModel
      .get("chengbenheji")
      .setValue(
        (!!viewModel.get("houzhizijinchengben").getValue() ? viewModel.get("houzhizijinchengben").getValue() : 0) +
          (!!viewModel.get("piaojuqudaochengben").getValue() ? viewModel.get("piaojuqudaochengben").getValue() : 0) +
          (!!viewModel.get("zijinchengben").getValue() ? viewModel.get("zijinchengben").getValue() : 0) +
          (!!viewModel.get("cangchuchengben").getValue() ? viewModel.get("cangchuchengben").getValue() : 0) +
          (!!viewModel.get("qmefeiyongjiajiakejifeiyong").getValue() ? viewModel.get("qmefeiyongjiajiakejifeiyong").getValue() : 0) +
          (!!viewModel.get("shichangweihufeiyong").getValue() ? viewModel.get("shichangweihufeiyong").getValue() : 0) +
          (!!viewModel.get("maoyichengben").getValue() ? viewModel.get("maoyichengben").getValue() : 0)
      ); //+    (!!viewModel.get("qudaoshuidianchengben").getValue() ? viewModel.get("qudaoshuidianchengben").getValue() : 0)
    viewModel
      .get("zuizhongshouyi")
      .setValue(
        ((!!viewModel.get("shouruheji").getValue() ? viewModel.get("shouruheji").getValue() : 0) - (!!viewModel.get("chengbenheji").getValue() ? viewModel.get("chengbenheji").getValue() : 0)).toFixed(
          2
        )
      );
    var girdModel = viewModel.get("XMLZ04List");
    for (var i = 0; i < mydata.XMLZ04List.length; i++) {
      console.log(girdModel.getCellValue(i, "fentanbili"));
      if (mydata.XMLZ04List[i].fentanfangshi == "2") {
        girdModel.setCellValue(i, "fentanbili", mydata.XMLZ04List[i].fentanbili, true, true);
      } else {
        if (i == updata.mainnum) {
          girdModel.setCellValue(i, "fentanjine", mydata.XMLZ04List[i].fentanjine, true, true);
        }
      }
    }
  });