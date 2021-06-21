$(function () {
  var form = layui.form;

  // 初始化富文本编辑器
  initEditor()
  // 加载文章分类
  initCate()

  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败!');
        }

        // 渲染下拉菜单
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render();
      }
    })
  };

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 选择封面
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  });

  // 监听 coverFile 的 change 事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  });

  var art_state = '已发布';
  // 点击存为草稿
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  });

  $('#form-pub').on('submit', function (e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])

    // fd.forEach((val, key) => {
    //   console.log(val, key);
    // });

    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state);

    // 4. 将裁剪之后的图片输出为文件
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob);

        // 发起ajax请求
        publishtArticle(fd);
      });
  });


  // 发布文章
  function publishtArticle(fd) {
    $.ajax({
      url: '/my/article/add',
      type: 'POST',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = 'art_list.html'
      }
    })
  }
})