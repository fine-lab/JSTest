// 生成月报表按钮点击事件
viewModel.get("button18za") &&
  viewModel.get("button18za").on("click", function (data) {
    // 调用后端API生成月报表
    cb.rest.invokeFunction("AT16F3D57416B00008.backScript.quantityTable", {}, function (err, res) {
      // 刷新页面
      viewModel.execute("refresh");
    });
  });
viewModel.get("button29gi") &&
  viewModel.get("button29gi").on("click", function (data) {
    const dataSource = viewModel.getGridModel().__data.dataSource;
    const filterData =
      dataSource &&
      dataSource.filter((item) => {
        return (
          item.AMOUNT_BUY > 0 ||
          item.AMOUNT_END > 0 ||
          item.AMOUNT_INI > 0 ||
          item.AMOUNT_SALE > 0 ||
          item.AMOUNT_SALE < item.AMOUNT_BUY + item.AMOUNT_INI ||
          item.CODE ||
          item.ZTH ||
          item.AMOUNT_END === item.AMOUNT_BUY + item.AMOUNT_INI - item.AMOUNT_SALE
        );
      });
    const needArr = [];
    for (const item of filterData) {
      needArr.push({
        ZTH: item.ZTH,
        DATE_MIN: item.DATE_MIN,
        DATE_MAX: item.DATE_MAX,
        CODE: item.CODE,
        AMOUNT_INI: item.AMOUNT_INI,
        AMOUNT_BUY: item.AMOUNT_BUY,
        AMOUNT_SALE: item.AMOUNT_SALE,
        AMOUNT_END: item.AMOUNT_END
      });
    }
    let tbodyStr = "";
    for (const itemBody of needArr) {
      let tdStr = "";
      for (const key in itemBody) {
        if (Object.hasOwnProperty.call(itemBody, key)) {
          tdStr += `<td>${itemBody[key]}</td>`;
        }
      }
      tbodyStr += `<tr>${tdStr}</tr>`;
    }
    const text = `
    <div style = "
        height: 60%;
        width: 70%;
        position:fixed;
        top: calc(50% - 36%);
        left: calc(50% - 35%);
        top: 10%;
        left:15%;
        outline: 1px solid #abc;
        z-index: 100000;
    ">
    <span style = "
            height: 20px;
            padding: 2px;
            position: absolute;
            top: -21px;
            right: -23px;
            font-size: 30px;
            line-height: 10px;
            outline: 1px solid #000;
            background-color: #fff;
            color: red;
            cursor: pointer;
        "
        id = "youridHere"
        >&times;</span>
        <table style = "
            outline: 1px solid #abc;
            width:100%;
            height:100%;
            background-color: #fff;
        " border = "1">
        <thead 
            style = "height: 10%;"
        >
            <tr style = "
                text-align:center;
            ">
                <th>
                帐套号
                </th>
                <th>
                起始日期
                </th>
                <th>
                结束日期
                </th>
                <th>
                商品编码
                </th>
                <th>
                期初数量
                </th>
                <th>
                采购数量
                </th>
                <th>
                销售数量
                </th>
                <th>
                期末数量
                </th>
            </tr>
        </thead>
        <tbody 
            style = "
                height: 90%;
                text-align:center;
            "
        >
            ${tbodyStr}
        </tbody>
        </table>
    </div>
    `;
    let aDiv = document.createElement("div");
    aDiv.id = "youridHere";
    aDiv.innerHTML = text;
    document.getElementsByTagName("body")[0].appendChild(aDiv);
  });
viewModel.get("button34xj") &&
  viewModel.get("button34xj").on("click", function (data) {
    // 关闭稽查--单击
    const thisADiv = document.getElementById("thisADiv");
    thisADiv.innerHTML = "";
  });
viewModel.get("button29gi") &&
  viewModel.get("button29gi").on("click", function (data) {
    // 稽查--单击
  });
viewModel.on("customInit", function (data) {
  // 进销存数量月报表--页面初始化
});