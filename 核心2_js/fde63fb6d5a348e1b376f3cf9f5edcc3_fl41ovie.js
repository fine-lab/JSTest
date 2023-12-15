var html_content; //声明要加载图表的容器
viewModel.on("customInit", function (data) {
  // 人员信息组装002--页面初始化
  // 加载本地js，js在应用构建-流程自动化-脚本，上传外部文件，然后在脚本设计器右侧，脚本这里可以选中
  function loadjs(url) {
    var secScript = document.createElement("script");
    secScript.setAttribute("type", "text/javascript");
    secScript.setAttribute("src", url);
    document.body.insertBefore(secScript, document.body.lastChild);
  }
  loadjs("/iuap-yonbuilder-runtime/opencomponentsystem/public/GT43930AT272/jquery.min.js?domainKey=developplatform");
  loadjs("/iuap-yonbuilder-runtime/opencomponentsystem/public/GT43930AT272/d3.min.js?domainKey=developplatform");
  //查询区点击查询事件
  this.on("beforeSearch", function (condition) {
    // 因为d3的select方法不支持 数字开头的id选择，所以动态渲染一个class到 控件上
    html_content = document.getElementById("3e1f3fa5|item80ij");
    $(html_content).addClass("chartsDiv");
    var viewModel = this;
    alert("111");
    var datas = null;
    var names = null;
    var id = "youridHere";
    // 页面展示
    rootData = {
      downward: {
        direction: "downward",
        name: "origin",
        children: [
          {
            name: "科技公司1",
            amount: 100
          },
          {
            name: "科技公司2",
            amount: 100
          },
          {
            name: "科技公司3",
            amount: 100
          },
          {
            name: "科技公司4",
            amount: 100
          }
        ]
      }
    };
    rootName = "科技公司"; //根节点名称
    drawing();
  });
  //查询区点击查询事件
  this.on("beforeSearch1", function (condition) {
    let condition_username = condition.params.condition.commonVOs[2].value1; //获取查询区username的值
    debugger;
    //搜索前，会把condition_username传递过去，可以做过滤操作
    addScript("https://www.example.com/", function (echarts) {
      let echersDom = document.getElementById("3e1f3fa5|item80ij"); //获取当前页面描述内容控件的dom对象
      echersDom.innerHTML = "";
      echersDom.style.height = "600px";
      // 获取查询区dom
      const filtervm = viewModel.getCache("FilterViewModel");
      debugger;
      //初始化echarts实例
      var myChart = echarts.init(echersDom);
      //图表需要展示的数据和配置，此处我用的假数据，具体配置查看echarts官网
      var option;
      option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          data: ["直达", "营销广告", "搜索引擎", "邮件营销", "联盟广告", "视频广告", "百度", "谷歌", "必应", "其他"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
            label: {
              position: "inner",
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 1548,
                name: "搜索引擎"
              },
              {
                value: 775,
                name: "直达"
              },
              {
                value: 679,
                name: "营销广告",
                selected: true
              }
            ]
          },
          {
            name: "访问来源",
            type: "pie",
            radius: ["45%", "60%"],
            labelLine: {
              length: 30
            },
            label: {
              formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
              backgroundColor: "#F6F8FC",
              borderColor: "#8C8D8E",
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: "#6E7079",
                  lineHeight: 22,
                  align: "center"
                },
                hr: {
                  borderColor: "#8C8D8E",
                  width: "100%",
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: "#4C5058",
                  fontSize: 14,
                  fontWeight: "bold",
                  lineHeight: 33
                },
                per: {
                  color: "#fff",
                  backgroundColor: "#4C5058",
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: [
              {
                value: 1048,
                name: "百度"
              },
              {
                value: 335,
                name: "直达"
              },
              {
                value: 310,
                name: "邮件营销"
              },
              {
                value: 251,
                name: "谷歌"
              },
              {
                value: 234,
                name: "联盟广告"
              },
              {
                value: 147,
                name: "必应"
              },
              {
                value: 135,
                name: "视频广告"
              },
              {
                value: 102,
                name: "其他"
              }
            ]
          }
        ]
      };
      option && myChart.setOption(option);
    });
  });
});
viewModel.get("button9ah") &&
  viewModel.get("button9ah").on("click", function (data) {
    // 导出图表--单击
    threeFn();
  });
//导出
function threeFn() {
  var serializer = new XMLSerializer();
  var svgHeadInfo = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"\n"https://www.example.com/">';
  var svg = $(html_content).find("svg")[0]; //获得id模型
  var serializer = new XMLSerializer(); //实转换为xml
  var svg1 = document.querySelector("svg"); //查询选择器
  var source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg); //组合图片路径
  var image = new Image(); //路径
  image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  var canvas = document.createElement("canvas");
  canvas.width = 1600; //此处设置宽
  canvas.height = 900; //此处设置高
  var context = canvas.getContext("2d");
  context.fillStyle = "#fff"; //#fff设置保存后的PNG 是白色的
  context.fillRect(0, 0, 10000, 10000);
  image.onload = function () {
    context.drawImage(image, 0, 0);
    var a = document.createElement("a");
    a.download = "产权树导出.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
}
// 绘制导图
var drawing = function () {
  var _this = this;
  var rootName = ""; //根节点的名字
  var rootRectWidth = 0; //根节点rect的宽度
  var downwardLength = 0,
    upwardLength = 0;
  var forUpward = true;
  var treeChart = function (d3Object) {
    this.d3 = d3Object;
    this.directions = ["downward"];
  };
  treeChart.prototype.drawChart = function () {
    this.treeData = {};
    var self = this;
    self.directions.forEach(function (direction) {
      self.treeData[direction] = _this.rootData[direction];
    });
    rootRectWidth = _this.rootName.length * 15;
    //获得upward第一级节点的个数
    //获得downward第一级节点的个数
    downwardLength = _this.rootData.downward.children.length;
    self.graphTree(self.getTreeConfig());
  };
  treeChart.prototype.getTreeConfig = function () {
    var treeConfig = {
      margin: {
        top: 10,
        right: 5,
        bottom: 0,
        left: 30
      }
    };
    treeConfig.chartWidth = 1500 - treeConfig.margin.right - treeConfig.margin.left;
    treeConfig.chartHeight = 700 - treeConfig.margin.top - treeConfig.margin.bottom;
    treeConfig.centralHeight = treeConfig.chartHeight / 2;
    treeConfig.centralWidth = treeConfig.chartWidth / 2;
    treeConfig.linkLength = 120;
    treeConfig.duration = 500; //动画时间
    return treeConfig;
  };
  treeChart.prototype.graphTree = function (config) {
    var self = this;
    var d3 = this.d3;
    var linkLength = config.linkLength;
    var duration = config.duration;
    var hasChildNodeArr = [];
    var id = 0;
    var diagonal = d3.svg
      .diagonal()
      .source(function (d) {
        return {
          x: d.source.x,
          y: d.source.name == "origin" ? (forUpward ? d.source.y - 20 : d.source.y + 20) : forUpward ? d.source.y - 60 : d.source.y + 60
        };
      })
      .target(function (d) {
        return {
          x: d.target.x,
          y: d.target.y
        };
      })
      .projection(function (d) {
        return [d.x, d.y];
      });
    var zoom = d3.behavior.zoom().scaleExtent([0.5, 2]).on("zoom", redraw);
    var svg = d3
      .select(html_content)
      .append("svg")
      .attr("width", config.chartWidth + config.margin.right + config.margin.left)
      .attr("height", config.chartHeight + config.margin.top + config.margin.bottom)
      .attr("xmlns", "https://www.example.com/")
      .on("mousedown", disableRightClick)
      .call(zoom)
      .on("dblclick.zoom", null);
    var treeG = svg
      .append("g")
      .attr("class", "gbox")
      .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");
    //箭头(下半部分)
    var markerDown = svg
      .append("marker")
      .attr("id", "resolvedDown")
      .attr("markerUnits", "strokeWidth") //设置为strokeWidth箭头会随着线的粗细发生变化
      .attr("markerUnits", "userSpaceOnUse")
      .attr("viewBox", "0 -5 10 10") //坐标系的区域
      .attr("refX", 0) //箭头坐标
      .attr("refY", 0)
      .attr("markerWidth", 12) //标识的大小
      .attr("markerHeight", 12)
      .attr("orient", "90") //绘制方向，可设定为：auto（自动确认方向）和 角度值
      .attr("stroke-width", 2) //箭头宽度
      .append("path")
      .attr("d", "M0,-5L10,0L0,5") //箭头的路径
      .attr("fill", "#000"); //箭头颜色
    for (var d in this.directions) {
      var direction = this.directions[d];
      var data = self.treeData[direction];
      data.x0 = config.centralWidth;
      data.y0 = config.centralHeight;
      data.children.forEach(collapse);
      update(data, data, treeG);
    }
    function update(source, originalData, g) {
      var direction = originalData["direction"];
      forUpward = direction == "upward";
      var node_class = direction + "Node";
      var link_class = direction + "Link";
      var downwardSign = forUpward ? -1 : 1;
      var nodeColor = forUpward ? "#37592b" : "#8b4513";
      var isExpand = false;
      var statusUp = true;
      var statusDown = true;
      var nodeSpace = 130;
      var tree = d3.layout.tree().sort(sortByDate).nodeSize([nodeSpace, 0]);
      var nodes = tree.nodes(originalData);
      var links = tree.links(nodes);
      var offsetX = -config.centralWidth;
      nodes.forEach(function (d) {
        d.y = downwardSign * (d.depth * linkLength) + config.centralHeight;
        d.x = d.x - offsetX;
        if (d.name == "origin") {
          d.x = config.centralWidth;
          d.y += downwardSign * 0; // 上下两树图根节点之间的距离
        }
      });
      var node = g.selectAll("g." + node_class).data(nodes, function (d) {
        return d.id || (d.id = ++id);
      });
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", node_class)
        .attr("transform", function (d) {
          return "translate(" + source.x0 + "," + source.y0 + ")";
        })
        .style("cursor", function (d) {
          return d.name == "origin" ? "" : d.children || d._children ? "pointer" : "";
        });
      nodeEnter
        .append("svg:rect")
        .attr("x", function (d) {
          return d.name == "origin" ? -(rootRectWidth / 2) : -60;
        })
        .attr("y", function (d) {
          return d.name == "origin" ? -20 : forUpward ? -52 : 12;
        })
        .attr("width", function (d) {
          return d.name == "origin" ? rootRectWidth : 120;
        })
        .attr("height", 40)
        .attr("rx", 10)
        .style("stroke", function (d) {
          return d.name == "origin" ? "#1078AF" : "#CCC";
        })
        .style("fill", function (d) {
          return d.name == "origin" ? "#0080E3" : "#FFF"; //节点背景色
        });
      nodeEnter.append("circle").attr("r", 1e-6);
      nodeEnter
        .append("text")
        .attr("class", "linkname")
        .attr("x", function (d) {
          return d.name == "origin" ? "0" : "-55";
        })
        .attr("dy", function (d) {
          return d.name == "origin" ? ".35em" : forUpward ? "-40" : "24";
        })
        .attr("text-anchor", function (d) {
          return d.name == "origin" ? "middle" : "start";
        })
        .attr("fill", "#000")
        .text(function (d) {
          if (d.name == "origin") {
            return _this.rootName;
          }
          if (d.repeated) {
            return "[Recurring] " + d.name;
          }
          return d.name.length > 10 ? d.name.substr(0, 10) : d.name;
        })
        .style({
          "fill-opacity": 1e-6,
          fill: function (d) {
            if (d.name == "origin") {
              return "#fff";
            }
          },
          "font-size": function (d) {
            return d.name == "origin" ? 14 : 11;
          },
          cursor: "pointer"
        })
        .on("click", Change_modal);
      nodeEnter
        .append("text")
        .attr("class", "linkname")
        .attr("x", "-55")
        .attr("dy", function (d) {
          return d.name == "origin" ? ".35em" : forUpward ? "-29" : "35";
        })
        .attr("text-anchor", function () {
          return d.name == "origin" ? "middle" : "start";
        })
        .text(function (d) {
          return d.name.substr(10, d.name.length);
        })
        .style({
          fill: "#000",
          "font-size": function (d) {
            return d.name == "origin" ? 14 : 11;
          },
          cursor: "pointer"
        });
      nodeEnter
        .append("text")
        .attr("x", "-55")
        .attr("dy", function (d) {
          return d.name == "origin" ? ".35em" : forUpward ? "-16" : "48";
        })
        .attr("text-anchor", "start")
        .attr("class", "linkname")
        .style("fill", "#000")
        .style("font-size", 10)
        .text(function (d) {
          var str = d.name == "origin" ? "" : "投资金额:" + d.amount + "万人民币";
          return str.length > 13 ? str.substr(0, 13) + ".." : str;
        });
      nodeEnter
        .append("text")
        .attr("x", "10")
        .attr("dy", function (d) {
          return d.name == "origin" ? ".35em" : forUpward ? "0" : "10";
        })
        .attr("text-anchor", "start")
        .attr("class", "linkname")
        .style("fill", "green")
        .style("font-size", 10)
        .text(function (d) {
          return d.name == "origin" ? "" : d.ratio;
        });
      var nodeUpdate = node
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      nodeUpdate
        .select("circle")
        .attr("r", function (d) {
          return d.name == "origin" ? 0 : hasChildNodeArr.indexOf(d) == -1 ? 0 : 6;
        })
        .attr("cy", function (d) {
          return d.name == "origin" ? -20 : forUpward ? -59 : 59;
        })
        .style("fill", function (d) {
          return hasChildNodeArr.indexOf(d) != -1 ? "#fff" : "";
        })
        .style("stroke", function (d) {
          return hasChildNodeArr.indexOf(d) != -1 ? "#8b4513" : "";
        })
        .style("fill-opacity", function (d) {
          if (d.children) {
            return 0.35;
          }
        })
        .style("stroke-width", function (d) {
          if (d.repeated) {
            return 5;
          }
        });
      //代表是否展开的+-号
      nodeEnter
        .append("svg:text")
        .attr("class", "isExpand")
        .attr("x", "0")
        .attr("dy", function (d) {
          return forUpward ? -56 : 62;
        })
        .attr("text-anchor", "middle")
        .style("fill", "#000")
        .text(function (d) {
          if (d.name == "origin") {
            return "";
          }
          return hasChildNodeArr.indexOf(d) != -1 ? "+" : "";
        })
        .on("click", click);
      nodeUpdate.select("text").style("fill-opacity", 1);
      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + source.x + "," + source.y + ")";
        })
        .remove();
      nodeExit.select("circle").attr("r", 1e-6);
      nodeExit.select("text").style("fill-opacity", 1e-6);
      var link = g.selectAll("path." + link_class).data(links, function (d) {
        return d.target.id;
      });
      link
        .enter()
        .insert("path", "g")
        .attr("class", link_class)
        .attr("stroke", function (d) {
          return "#8b4513";
        })
        .attr("fill", "none")
        .attr("stroke-width", "1px")
        .attr("opacity", 0.5)
        .attr("d", function (d) {
          var o = {
            x: source.x0,
            y: source.y0
          };
          return diagonal({
            source: o,
            target: o
          });
        })
        .attr("marker-end", function (d) {
          return forUpward ? "url(#resolvedUp)" : "url(#resolvedDown)";
        }) //根据箭头标记的id号标记箭头;
        .attr("id", function (d, i) {
          return "mypath" + i;
        });
      link.transition().duration(duration).attr("d", diagonal);
      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = {
            x: source.x,
            y: source.y
          };
          return diagonal({
            source: o,
            target: o
          });
        })
        .remove();
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
      function Change_modal() {
        _this.Modal = true;
      }
      function click(d) {
        if (forUpward) {
        } else {
          if (d._children) {
            console.log("对外投资--ok");
          } else {
            console.log("对外投资--no");
          }
        }
        isExpand = !isExpand;
        if (d.name == "origin") {
          return;
        }
        if (d.children) {
          d._children = d.children;
          d.children = null;
          d3.select(this).text("+");
        } else {
          d.children = d._children;
          d._children = null;
          if (d.name == "origin") {
            d.children.forEach(expand);
          }
          d3.select(this).text("-");
        }
        update(d, originalData, g);
      }
    }
    function expand(d) {
      if (d._children) {
        d.children = d._children;
        d.children.forEach(expand);
        d._children = null;
      }
    }
    function collapse(d) {
      if (d.children && d.children.length != 0) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
        hasChildNodeArr.push(d);
      }
    }
    function redraw() {
      treeG.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    }
    function disableRightClick() {
      if (d3.event.button == 2) {
        console.log("No right click allowed");
        d3.event.stopImmediatePropagation();
      }
    }
    function sortByDate(a, b) {
      var aNum = a.name.substr(a.name.lastIndexOf("(") + 1, 4);
      var bNum = b.name.substr(b.name.lastIndexOf("(") + 1, 4);
      return d3.ascending(aNum, bNum) || d3.ascending(a.name, b.name) || d3.ascending(a.id, b.id);
    }
  };
  var d3GenerationChart = new treeChart(d3);
  d3GenerationChart.drawChart();
};