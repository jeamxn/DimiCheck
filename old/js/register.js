$(window).load(() => {
  const time = 1500;
  let audio = new Audio('/file/sound.mp3');
  $('.btn').on('click', event => {
    $.ajax({
      url: '//api.dimigo.xyz/register',
      type: 'POST',
      data: {
        serial: $('.serial').val(),
        number: $('.number').val(),
        name: $('.name').val(),
        userType: $('.userType').val()
      },
      success: res => {
        $('.serial').focus();
        $('.serial').val('');
        $('.number').val('');
        $('.name').val('');
        $('.userType').val('1');
        if(res.success) Swal.fire({
          icon: 'success', 
          title: '성공!', 
          text: `${res.data}`,
          timer: time,
          timerProgressBar: true
        }).then(() =>{
          location.href = 'https://dimigo.xyz';
        })
        else Swal.fire({
          icon: 'error', 
          title: '오류!', 
          text: res.message,
          timer: time,
          timerProgressBar: true
        }).then(() =>{
          location.href = 'https://dimigo.xyz';
        })
      },
      error: res => {
        $('.serial').focus();
        $('.jasu_select').val('화장실/물 (기본값)');
        Swal.fire({
          icon: 'error',
          title: '오류!', 
          text: `[${res.status}] ${res.statusText}`,
          timer: time,
          timerProgressBar: true
        }).then(() =>{
          location.href = 'https://dimigo.xyz';
        });
      }
    });
  });
  $('.logo').on('click', event => {
    location.href = 'https://dimigo.xyz';
  });
  $('.serial').keyup(() => {
    let data = $('.serial').val();
    data.length > 4 && $('.number').focus();
  });
  $('.number').keyup(() => {
    let data = $('.number').val();
    data.length == 4 && $('.name').focus();
  });

  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader()
  codeReader.listVideoInputDevices()
  .then((videoInputDevices) => {
    selectedDeviceId = videoInputDevices[0].deviceId
    const cam = () => {
      codeReader.decodeFromVideoDevice(selectedDeviceId, 'webcam', (result, err) => {
        if (result) {
          audio.play();
          $('.serial').val(result.text)
          $('.card').css('display', 'none')
          $('.number').focus()
          codeReader.reset()
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err)
        }
      })
    }
    cam();
    $('.serial').on('click', () => {
      $('.serial').val('')
      $('.card').css('display', 'flex')
      cam();
    });

    const sourceSelect = document.getElementById('sourceSelect')
    if (videoInputDevices.length >= 1) {
      videoInputDevices.forEach((element) => {
        const sourceOption = document.createElement('option')
        sourceOption.text = element.label
        sourceOption.value = element.deviceId
        sourceSelect.appendChild(sourceOption)
      })

      sourceSelect.onchange = () => {
        codeReader.reset();
        selectedDeviceId = sourceSelect.value;
        cam();
      };
    }
    let trsg = 180;
    $('.leftright').on('click', () => {
      trsg += 180;
      $('.webcam').css('transform', `rotateY(${trsg}deg)`);
    });
  })
  .catch((err) => {
    console.error(err)
  })
});