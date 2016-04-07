console.log('test 123:)')

// ajax login
$('#loginForm').on('submit', function(e) {
  e.preventDefault()
  var $data = $(this).serialize()

  $.ajax({
    url: '/login',
    type: 'post',
    data: $data,
    success: function(res, status, xhr) {
      if (res.success) {
        window.location.replace('/')
      }
      else {
        alert('bad login info.')
      }
    }
  })
})
