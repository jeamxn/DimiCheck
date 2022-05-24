$(window).load(() => {
  const time = 1500; 
  let ifCheckedEnd = 0;
  let audio = new Audio('/file/sound.mp3');
  const showLoading = (onoff) => {
    if(onoff){
        $.ajax({
            url:`/css/loading.css`,
            dataType:"text",
            success:(data)=> {
                $("head").append(`<style>${data}`);
                $("head").append(`<style>@media (max-width:500px) { ${data.replace(/([0-9]+)px/g, (v) => v.replace('px', '')/5+'vw')} }</style>`);
                $('body').prepend('<div class="fullscreen"></div>');
                $('.fullscreen').prepend('<div class="loader loader-1"></div>');
            }
        });
    }
    else{
        $('.fullscreen').remove();
    }
  };
  $('.register').on('click', event => {
    location.href = "/register";
  });
  $('.now').on('click', event => {
    location.href = "/now";
  });
  $('.logo').on('click', event => {
    location.href = '/';
  });
  const put = (data) => {
    if(ifCheckedEnd) return;
    data = data.replace(/ /gi, '');
      if(data.length > 4){
        ifCheckedEnd = 1;
        showLoading(true);
        $.ajax({
          url: '//api.dimigo.xyz/jasup',
          type: 'POST',
          data: {
            serial: $('.serial').val(),
            doing: $('.jasu_select').val()
          },
          success: res => {
            showLoading(false);
            $('.serial').focus();
            $('.serial').val('');
            $('.jasu_select').val('화장실/물');
            if(res.success) Swal.fire({
                icon: 'success', 
                title: '성공!', 
                text: `${res.data}`,
                timer: time,
                timerProgressBar: true
              }).then(() => {
                ifCheckedEnd = 0
              });
            else Swal.fire({
                icon: 'error', 
                title: '오류!', 
                text: res.message,
                timer: time,
                timerProgressBar: true
              }).then(() => {
                ifCheckedEnd = 0
              });
          },
          error: res => {
            $('.serial').focus();
            $('.serial').val('');
            $('.jasu_select').val('화장실/물');
            Swal.fire({
              icon: 'error', 
              title: '오류!', 
              text: res.message,
              timer: time,
              timerProgressBar: true
            }).then(() => {
              ifCheckedEnd = 0
            });
          }
        });
      } 
  }

  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader()
  codeReader.listVideoInputDevices()
  .then((videoInputDevices) => {
    console.log(videoInputDevices);
    selectedDeviceId = videoInputDevices[0].deviceId
    const cam = () => {
      codeReader.decodeFromVideoDevice(selectedDeviceId, 'webcam', (result, err) => {
        if (result) {
          audio.play();
          $('.serial').val(result.text);
          put(result.text);
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err)
        }
      })
    };
    cam();

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