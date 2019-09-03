<?php

require_once '..\connections\cnx_cfdi2.php';
$_POST = json_decode(file_get_contents('php://input'), true);


if ($cnx_cfdi->connect_error) {
    die("Conexion fallida" . $cnx_cfdi->connect_error);
} else {

    //TRAE XFOLIO DE CADA MOVIMIENTO

    if (!empty($_POST["movimientoX"] )){
        $movimiento = $_POST['movimientoX'];
        $querry     = "Select ID,XFolio FROM cargonet_" . $movimiento . ";";
        $datos      = $cnx_cfdi->query($querry);
        $dato       = $datos->fetch_assoc();
        do {
            $id           = $dato['ID'];
            $XF        = $dato['XFolio'];
            $return_arr[] = array("ID" => $id, "XFolio" => $XF);
        } while ($dato = $datos->fetch_assoc());

        header('Content-Type: application/json');
        echo json_encode($return_arr);

        exit;

    //EJECUTA EL CAMBIO DE ESTATUS
    } elseif (!empty($_POST["subID"])) {
        date_default_timezone_set("America/Mexico_City");
        $estado     = $_POST['Opcion_Estado'];
        $movimiento = $_POST['Opcion_Movimiento'];
        $login      = "JOW";
        $fecha      = date("Y-m-d H:i:s");
        $id         = $_POST['subID'];

        //COMPROBAR MOVIMIENTO
        if ($movimiento == 'abonos') {
        } elseif ($movimiento == 'gastosviajes') {
            switch ($estado) {

                case $estado == 'Abrir':
                    $restricciones = "Estatus='Proceso', AutorizadoPor=NULL, AutorizacionRealizada=NULL, EmitidoPor=NULL, TranferenciaRealizada=NULL,CanceladaPor=NULL,CanceladaStamp=NULL ";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "Estatus='Completado', AutorizadoPor='" . $login . "', AutorizacionRealizada='" . $fecha . "', EmitidoPor='" . $login . "',CanceladaPor=NULL,CanceladaStamp=NULL,TranferenciaRealizada='" . $fecha . "'";
                    break;

                case $estado == 'Cancelar':
                    $restricciones = "Estatus='Cancelado', CanceladaPor='" . $login . "', CanceladaStamp='" . $fecha . "',AutorizadoPor=NULL, AutorizacionRealizada=NULL, EmitidoPor=NULL, TranferenciaRealizada=NULL ";

                    break;

            }
        } elseif ($movimiento == 'remisiones') {
            switch ($estado) {

                case $estado == 'Abrir':
                    $restricciones = "cCanceladoPor=NULL,cCanceladoT=NULL,cCanceladoCausa_REN=NULL,cCanceladoCausa_RID=NULL,
                    EstatusTerminado=NULL,EstatusTerminadoT=NULL";
                    break;

                case $estado == 'Cancelar':
                    $causa         = $_POST['subCausa'];
                    $restricciones = "cCanceladoT='" . $fecha . "', cCanceladoPor='" . $login . "', cCanceladoCausa_RID='" . $causa . "', cCanceladoCausa_REN='CausasCancelacion',EstatusTerminadoT=NULL,EstatusTerminado=NULL";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "EstatusTerminadoT='" . $fecha . "', EstatusTerminado='" . $login . "',cCanceladoPor=NULL,cCanceladoT=NULL,cCanceladoCausa_REN=NULL,cCanceladoCausa_RID=NULL";
                    break;

            }
        } elseif ($movimiento == 'compras') {
            switch ($estado) {
                case $estado == 'Abrir':
                    $restricciones = "Estatus='Proceso',Cancelado=NULL,Cancelo=NULL,Completado=NULL,Completo=NULL";
                    break;

                case $estado == 'Cancelar':
                    $restricciones = "Estatus='Cancelado',Completo=NULL,Completado=NULL,Cancelado='" . $fecha . "',Cancelo='" . $login . "'";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "Estatus='Completado',Completo='" . $login . "',Completado='" . $fecha . "',Cancelo=NULL,Cancelado=NULL";
                    break;

            }
        } elseif ($movimiento == 'requisicion') {
            switch ($estado) {

                case $estado == 'Abrir':
                    $restricciones = "Estatus='Proceso',CanceladoT=NULL,Cancelado=NULL,CompletadoT=NULL,Completo=NULL,Autorizo=NULL,FechaAutorizacion=NULL";
                    break;

                case $estado == 'Autorizar':
                    $restricciones = "Estatus='Autorizado',CanceladoT=NULL,Cancelado=NULL,CompletadoT=NULL,Completo=NULL,Autorizo='" . $login . "',FechaAutorizacion='" . $fecha . "'";
                    break;

                case $estado == 'Cancelar':
                    $restricciones = "Estatus='Cancelado',CanceladoT='" . $fecha . "',Cancelado='" . $login . "'";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "Estatus='Completado',CanceladoT=NULL,Cancelado=NULL,CompletadoT='" . $fecha . "',Completo='" . $login . "'";
                    break;

            }
        } elseif ($movimiento == 'ordencompra') {
            switch ($estado) {

                case $estado == 'Abrir':
                    $restricciones = "Estatus='Proceso',Cancelado=NULL,Cancelo=NULL,Terminado=NULL,Termino=NULL,Autorizo=NULL,Autorizado=NULL";
                    break;

                case $estado == 'Autorizar':
                    $restricciones = "Estatus='Autorizado',Termino=NULL,Terminado=NULL,Cancelo=NULL,Cancelado=NULL,Autorizado='" . $fecha . "',Autorizo='" . $login . "'";
                    break;

                case $estado == 'Cancelar':
                    $restricciones = "Estatus='Cancelado',Cancelado='" . $fecha . "',Cancelo='" . $login . "'";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "Estatus='Terminado',Cancelo=NULL,Cancelado=NULL,Terminado='" . $fecha . "',Termino='" . $login . "'";
                    break;

            }
        } elseif ($movimiento == 'solicitudescompras') {
            switch ($estado) {

                case $estado == 'Abrir':
                    $restricciones = "Estatus='Proceso',Documentadoractualizacion=NULL,Fechaactualizacion=NULL,DocumentadorAutorizado=NULL,FechaAutorizado=NULL";
                    break;

                case $estado == 'Autorizar':
                    $restricciones = "Estatus='Autorizado',DocumentadorAutorizado='" . $login . "',FechaAutorizado='" . $fecha . "'";
                    break;

                case $estado == 'Cancelar':
                    $restricciones = "Estatus='Cancelado',Fechaactualizacion='" . $fecha . "',Documentadoractualizacion='" . $login . "'";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "Estatus='Terminado',Fechaactualizacion='" . $fecha . "',Documentadoractualizacion='" . $login . "'";
                    break;

            }
        } elseif ($movimiento == 'pagos') {
            switch ($estado) {
                case $estado == 'Abrir':
                    $restricciones = "Estatus='Proceso',Cancelado=NULL,Cancelo=NULL,Terminado=NULL,Termino=NULL";
                    break;

                case $estado == 'Cancelar':
                    $restricciones = "Estatus='Terminado',Termino=NULL,Completado=NULL,Cancelado='" . $fecha . "',Cancelo='" . $login . "'";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "Estatus='Completado',Terminado='" . $login . "',Termino='" . $fecha . "',Cancelo=NULL,Cancelado=NULL";
                    break;

            }
        } elseif ($movimiento == 'movimientobancario') {
            switch ($estado) {

                case $estado == 'Abrir':
                    $restricciones = "Estatus='Proceso',TerminadoPor=NULL,Terminado=NULL,Cancelado=NULL,CanceladoPor=NULL";
                    break;

                case $estado == 'Cancelar':
                    $restricciones = "Estatus='Cancelado',TerminadoPor=NULL,Terminado=NULL,Cancelado='" . $fecha . "',CanceladoPor='" . $login . "'";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "Estatus='Terminado',TerminadoPor='" . $login . "',Terminado='" . $fecha . "',Cancelado=NULL,CanceladoPor=NULL";
                    break;

            }
        } elseif ($movimiento == 'liquidaciones') {
            switch ($estado) {
                case $estado == 'Abrir':
                    $restricciones = "Estatus='Proceso', AutorizadoGerenciaT=NULL,AutorizadoGerencia=NULL,autorizadoFacturacionT=NULL,AutorizadoFacturacion=NULL,
                    AutorizadoLiquidacionT=NULL,AutorizadoLiquidacion=NULL";

                    break;

                case $estado == 'Autorizar':
                    $restricciones = "Estatus='Autorizada', AutorizadoGerenciaT='" . $fecha . "', AutorizadoGerencia='" . $login . "', autorizadoFacturacionT=NULL,AutorizadoFacturacion=NULL,
                    AutorizadoLiquidacionT=NULL,AutorizadoLiquidacion=NULL";
                    break;

                case $estado == 'Cerrar':
                    $restricciones = "Estatus='Sellada', AutorizadoGerenciaT='" . $fecha . "', AutorizadoGerencia='" . $login . "', AutorizadoLiquidacionT='" . $fecha . "', AutorizadoLiquidacion='" . $login . "',autorizadoFacturacionT=NULL,AutorizadoFacturacion=NULL";
                    break;

                case $estado == 'Sellar':
                    $restricciones = "Estatus='Sellada', AutorizadoGerenciaT='" . $fecha . "', AutorizadoGerencia='" . $login . "', AutorizadoLiquidacionT='" . $fecha . "', AutorizadoLiquidacion='" . $login . "',autorizadoFacturacionT='" . $fecha . "', AutorizadoFacturacion='" . $login . "'";

                    break;

            }
        }

        //EJECUTAR PROCEDIMIENTO
        $procedure = 'CALL pro_estatus("' . $id . '","cargonet_' . $movimiento . '","' . $restricciones . '");';
        $cnx_cfdi->query($procedure);
    }

    //TRAE LAS CAUSAS DE CANCELACION PARA REMISIONES
    elseif (!empty($_POST["causas"])) {
        $querry = "SELECT ID,Causa FROM cargonet_causascancelacion ORDER BY Causa;";

        $datos = $cnx_cfdi->query($querry);
        $dato  = $datos->fetch_assoc();
        do {
            $id           = $dato['ID'];
            $causa        = $dato['Causa'];
            $return_arr[] = array("ID" => $id, "Causa" => $causa);
        } while ($dato = $datos->fetch_assoc());
        header('Content-Type: application/json');
        echo json_encode($return_arr);

        exit;
    }
}
