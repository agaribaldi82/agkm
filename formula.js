window.onload = function() {
    document.getElementById('formulario').addEventListener('submit', function(event) {
        event.preventDefault();
        // these IDs from the previous steps
        emailjs.sendForm('service_28wp5l7', 'template_de9e0ar', this)   
            .then(() => {
                console.log('SUCCESS!')
                alert("Su consulta fue enviada con éxito...nos contactaremos a la brevedad!");
            }, (error) => {
                console.log('FAILED...', error);
                alert("Error al enviar consulta")
            });
    });
}


(function() {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init({
      publicKey: "adCZaAiAv1DBjfJhF",
    });
})();