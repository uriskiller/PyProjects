$(function() {

  //VALIDA EL XFOLIO

  $('#form').on('submit', function(e) {

    //EVITA QUE EL FORMULARIO SE ENVIE

    e.preventDefault();

    var selectedOption = $('option[value="' + $('#opcID').val() + '"]'),
      text = document.getElementById("opcID"),
      text2 = document.getElementById("subID");

    if (!selectedOption.length) {
      text.value = "";
      text2.value = "";
      text.focus();
      alert("XFolio Incorrecto");
      return false;
    } else {
      text2.value = selectedOption.attr('id');
    }

    //VALIDA CAUSA

    var selectedOption1 = $('option[value="' + $('#busqueda2').val() + '"]'),
      text4 = document.getElementById("subCausa");
    text4.value = selectedOption1.attr('id');


    //FUNCION QUE EJECUTA EL MOVIMIENTO
    $.ajax({
      type: "post",
      url: 'procedure.php',
      data: $("#form").serialize(),
      success: function(data) {
        alert('Movimiento realizado con exito!');
        // $('#form').trigger("reset");
        // $('#resp').html(""),
        // $('#resp').html("");

      },
      error: function(data) {
        alert('Error');
        console.log(data);
      }
    });




  });

});


$('#opc2').change(function() {
  var opcion = $('#opc2').val();
  var SelectEstado = '';
  var SelectExt = '';
  var SelectID = '<br/><label>XFolio</label><br/>' +
    '<input list="busqueda" class="form-control custom-select" name="busqueda" required autocomplete="off" id="opcID" placeholder="Ingresa XFolio">' +
    '<datalist id="busqueda" ></datalist>';

  if (opcion == "liquidaciones") {
    var SelectEstado = '<label>Estado:</label><br/>' +
      '<select required class="form-control custom-select" name="Opcion_Estado" id="opc3">' +
      '<option disabled selected value="">Selecciona una opción</option>' +
      '<option value="Abrir">Abrir</option>' +
      '<option value="Autorizar">Autorizar</option>' +
      '<option value="Cerrar">Cerrar</option>' +
      '<option value="Sellar">Sellar</option>' +
      '</select>';
  } else if (opcion == "solicitudescompras" || opcion == "ordencompra" || opcion == "requisicion") {
    var SelectEstado = '<label>Estado:</label><br/>' +
      '<select required class="form-control custom-select" name="Opcion_Estado" id="opc3">' +
      '<option disabled selected value="">Selecciona una opción</option>' +
      '<option value="Abrir">Abrir</option>' +
      '<option value="Autorizar">Autorizar</option>' +
      '<option value="Cerrar">Cerrar</option>' +
      '<option value="Cancelar">Cancelar</option>' +
      '</select>';

  } else {
    var SelectEstado = '<label>Estado:</label><br/>' +
      '<select required class="form-control custom-select" name="Opcion_Estado" id="opc3">' +
      '<option disabled selected value="">Selecciona una opción</option>' +
      '<option value="Abrir">Abrir</option>' +
      '<option value="Cerrar">Cerrar</option>' +
      '<option value="Cancelar">Cancelar</option>' +
      '</select>';
  }


  $('#resp').html(SelectEstado + SelectID);
  $('#opc3').change(function() {
    if ($('#opc3').val() == "Cancelar" && $('#opc2').val() == "remisiones") {
      var SelectExt = '<div id="resp2"><br/><label>Motivo Cancelacion</label><br/>' +
        '<select required class="form-control custom-select" id="busqueda2" name="busqueda2">' +
        '<option disabled selected value="">Selecciona una opción</option>' +
        '</select></div>';
      $('#resp').append(SelectExt);

      //Busqueda de causas de cancelacion.
      $.ajax({
        type: "post",
        url: 'causas.php',
        success: function(data) {
          var len = data.length;
          for (var i = 0; i < len; i++) {
            var id = data[i].ID;
            var causa = data[i].Causa;
            $("#busqueda2").append('<option id="' + id + '" value="' + causa + '">' + causa + ' </option><br>');
          }
        },
        error: function(data) {
          alert('error');

        }
      });


    } else {
      $('#resp2').remove();
    }

  });

  //Funcion que trae el XFolio de cada movimiento

  $.ajax({
    type: "post",
    url: 'val.php',
    data: $("#form").serialize(),
    success: function(data) {
      $("#busqueda").append(data);

    },
    error: function(data) {
      alert('error');
      console.log(data);
    }
  });

});
