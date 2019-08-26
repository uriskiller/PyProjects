<?php
   include("config.php");
   session_start();
   
   if($_SERVER["REQUEST_METHOD"] == "POST") {
      // username and password sent from form 
      
      $myusername = $_POST['username'];
      $mypassword = $_POST['password']; 
      
      $sql = "SELECT id FROM login WHERE username = '".$myusername."' and password = '".$mypassword."';";
      echo $sql;
      $datos=$cnx_cfdi->query($sql) or die($cnx_cfdi->error);;
      $dato=$datos->fetch_assoc();
      $filas=$datos->num_rows;
      
      
      // If result matched $myusername and $mypassword, table row must be 1 row
		
      if($filas > 0) {
        
         header("location: welcome.php");
      }else {
         echo "Your Login Name or Password is invalid";
         header("location: index.html");
      }
   }
?>