viewModel.on("customInit", function (data) {
  // 合作方式变更详情--页面初始化
  viewModel.on("afterLoadData", () => {
    loadStyle();
    let dataJson = {
      "1578432968554708995": {
        hztype_name: "3万1年",
        xinhezuoleixing: "2",
        yuanlvyuebaozhengjin: 15000,
        xiancunyuebaozhengjinyingjiao: 32000
      },
      "1578184281362530307": {
        //新鲜水果店
        hztype_name: "4万2年",
        xinhezuoleixing: "1",
        yuanlvyuebaozhengjin: 43000,
        xiancunyuebaozhengjinyingjiao: 5000
      },
      "1578433252026744841": {
        //新鲜水果店-2
        hztype_name: "承包8万1年",
        xinhezuoleixing: "2",
        yuanlvyuebaozhengjin: 15000,
        xiancunyuebaozhengjinyingjiao: 15000
      }
    };
    viewModel.get("dianpu_name") &&
      viewModel.get("dianpu_name").on("afterValueChange", function (data) {
        // 店铺--值改变后
        if (data) {
          viewModel.get("yuanhezuofangshi").setValue(dataJson[data.obj.select.id].hztype_name); //原来合作方式
          viewModel.get("yuanhezuoleixing").setValue(dataJson[data.obj.select.id].xinhezuoleixing);
          viewModel.get("yuanlvyuebaozhengjin").setValue(dataJson[data.obj.select.id].xinhezuoleixing);
          viewModel.get("xiancunyuebaozhengjinyingjiao").setValue(dataJson[data.obj.select.id].xinhezuoleixing);
        } else {
          viewModel.get("yuanhezuofangshi").setValue("3万1年"); //原来合作方式
          viewModel.get("yuanhezuoleixing").setValue("1");
        }
      });
    //默认设置  合作类型位承包
    viewModel.get("xinhezuoleixing").setValue("2");
    viewModel.get("chengbaohetong").setVisible(false);
    viewModel.get("xinyouxiaoshijian").setVisible(false);
    viewModel.get("fuwujieshushijian").setVisible(true);
    const { dianpu, dianpu_name, dianpu_code } = viewModel.getParams();
    viewModel.get("dianpu_name").setValue(dianpu_name);
    viewModel.get("dianpu").setValue(dianpu);
    viewModel.get("yuanhezuofangshi").setValue(dataJson[dianpu].hztype_name || ""); //原来合作方式
    viewModel.get("yuanhezuoleixing").setValue(dataJson[dianpu].xinhezuoleixing || "2"); //原来合作方式
    viewModel.get("yuanlvyuebaozhengjin").setValue(dataJson[dianpu].yuanlvyuebaozhengjin || "10000");
    viewModel.get("xiancunyuebaozhengjinyingjiao").setValue(dataJson[dianpu].xiancunyuebaozhengjinyingjiao || "10000");
    //合作类型发生改变
    viewModel.get("xinhezuoleixing") &&
      viewModel.get("xinhezuoleixing").on("afterValueChange", function (data) {
        const value_type = viewModel.get("xinhezuoleixing").getValue();
        //承包
        if (value_type === "1" || value_type === 1) {
          viewModel.get("chengbaohetong").setVisible(true);
          viewModel.get("xinyouxiaoshijian").setVisible(true);
          viewModel.get("fuwujieshushijian").setVisible(false);
        } else {
          viewModel.get("chengbaohetong").setVisible(false);
          viewModel.get("xinyouxiaoshijian").setVisible(false);
          viewModel.get("fuwujieshushijian").setVisible(true);
        }
      });
  });
  //加载自定义样式 (无异步、css不生效问题，效果好)
  function loadStyle(params) {
    var headobj = document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerText = `.wui-modal-footer .viewContainer.width-percent-25 {width: 100%!important;}`;
    headobj.appendChild(style);
  }
  viewModel.get("btnSave") &&
    viewModel.get("btnSave").on("click", function (data) {
      // 保存--单击
      cb.rest.invokeFunction(
        "AT15E22AA808080003.backend.sysData",
        {
          url: "AT15E22AA808080003.AT15E22AA808080003.jingyingfyddmg",
          object: {
            dianzhang_name: "周志康",
            creator_userName: "王金鹏",
            dianzhang: "41190711609438976",
            feiytype: "4",
            dongzuo: "4",
            chufatype: "12",
            guanlianfwriqi_end: viewModel.get("fuwujieshushijian").getValue(),
            phone: "+86-18531638227",
            createTime: "2022-10-28 16:17:18",
            charuziduan12: 30000,
            mark: "新合作方式",
            guanlianfwriqi_start: "2022-10-01"
          },
          billNo: "6ec0db57List"
        },
        function (err, res) {
          if (res) {
            genLog();
          }
        }
      );
    });
  // 操作流水
  function genLog() {
    cb.rest.invokeFunction(
      "AT15E22AA808080003.backend.sysData",
      {
        url: "AT15E22AA808080003.AT15E22AA808080003.caozuoliusui",
        object: {
          chufatype: "12",
          ssjingyfeiyongmg_id: "youridHere",
          dongzuo: "4",
          caozuoren: "2294214498013440",
          sheji_jine: 0,
          ssjingyfeiyongmg_id_id: "youridHere",
          caozuo_content: "2",
          czdate: "2022-10-29",
          billcode: "000001",
          _status: "Insert",
          feiytype: "2",
          caozuoliusui_sheji_shopList: [
            {
              sheji_shop: "1578432968554708995",
              caozuoliusui_sheji_shopList: "新鲜水果店-1",
              id: "youridHere"
            }
          ],
          caozuoren_name: "王金鹏",
          mark: "新合作方式"
        },
        billNo: "67faa355List"
      },
      function (err, res) {
        const p = viewModel.getCache("parentViewModel");
        p.execute("refresh");
        viewModel.communication({
          type: "return"
        });
      }
    );
  }
});