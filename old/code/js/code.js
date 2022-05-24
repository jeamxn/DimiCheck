$(window).load(() => {
  const codeWriter = new ZXing.BrowserQRCodeSvgWriter()

  const change = () => {
    let input = $('#textInput').val() == '' ? '0000' : $('#textInput').val();
    let grade = Math.floor(input / 1000);
    let classs = Math.floor(input / 100) - grade * 10;

    deleteCookie('stuNumber');
    setCookie('stuNumber', input, 99999);

    if(grade == 1 && classs == 6) input = `S${String(input - 1094).padStart(4,'0')}`;

    $('#result').html('');
    codeWriter.writeToDom('#result', input, 300, 300);
  }

  $('#textInput').focus();
  $('#textInput').val(getCookie('stuNumber'));
  change();

  $('#textInput').on('propertychange change keyup paste input', () => {
    change();
  });
});