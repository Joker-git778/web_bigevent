$(function () {
  var form = layui.form;
  // 获取文章分类列表
  initArtCateList();

  function initArtCateList() {
    $.ajax({
      url: '/my/article/cates',
      type: 'GET',
      success: function (res) {
        // console.log(res);
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    })
  };

  // 添加类别按钮
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  });

  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/addcates',
      type: 'POST',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！');
        }

        initArtCateList();
        layer.msg('新增分类成功！');
        // 根据索引关闭弹出层
        layer.close(indexAdd);
      }
    })
  });

  // 编辑
  var indexEdit = null;
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类的信息层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    });

    var id = $(this).data('id');
    // console.log(id);
    // 获取分类数据
    $.ajax({
      url: '/my/article/cates/' + id,
      type: 'GET',
      success: function(res) {
        console.log(res);
        form.val('form-edit', res.data);
      }
    })
  });

  // 提交修改表单
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/updatecate',
      type: 'POST',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败!');
        }
        layer.msg('更新分类数据成功!');
        layer.close(indexEdit);
        initArtCateList();
      }
    })
  });

  // 删除事件
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).data('id');
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        url: '/my/article/deletecate/' + id,
        type: 'GET',
        success: function(res) {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg('删除分类失败！');
          }
          layer.msg('删除分类成功！');
          layer.close(index);
          initArtCateList();
        }
      });
    });
  })
})