$(function () {
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义美化时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
  }

  // 定义查询的查询对象 请求数据时传递
  var q = {
    pagenum: 1, // 页码值 默认第一页
    pagesize: 2, // 每页显示多少条数据
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的状态
  };

  // 获取文章列表数据的方法
  initTable();

  function initTable() {
    $.ajax({
      url: '/my/article/list',
      type: 'GET',
      data: q,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        // 使用模板引擎渲染数据
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total);
      }
    })
  };

  // 初始化文章分类
  initCate();

  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      type: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败!');
        }
        // 渲染分类可选项
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render();
      }
    })
  };

  // 绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    // 给q赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新筛选条件重新渲染
    initTable();
  });

  // 渲染分页方法
  function renderPage(total) {
    laypage.render({
      elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      jump: function (obj, first) {
        // console.log(obj.curr)
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit
        // 根据最新的 q 获取对应的数据列表，并渲染表格
        // initTable()
        //首次不执行
        if (!first) {
          initTable();
        }
      }
    });
  };

  // 删除事件
  $('tbody').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length;
    console.log(len);
    var id = $(this).data('id');
    // 询问是否删除数据
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        url: '/my/article/delete/' + id,
        type: 'GET',
        success: function(res) {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg('删除文章失败!');
          }

          layer.msg('删除文章成功!');
          // 当数据删除完成之后 需要判断是不是还有剩余的数据 如果没有页码值 -1
          if (len === 1) {
            // 如果len值等于1 说明没有数据
            // 页码值最小是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
          layer.close(index);
        }
      })
    });
  })
})