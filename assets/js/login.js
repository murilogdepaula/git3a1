var $login = $('.box-login');
var $loading = $('.loading');
$("#login-form").validate({

    rules: {
        username: {
            required: true,
            minlength: 4
        },
        password: {
            required: true,
            minlength: 4
        }
    },

    messages: {
        username: {
            required: "Informe o nome de usuário",
            minlength: "O nome de usuário é maior que 4 caracteres"
        },
        password: {
            required: "Informe sua senha",
            minlength: "Sua senha deve ser maior que 6 caracteres"
        }
    },
    errorClass: "form-invalid",
    submitHandler: function(form) {

    }
});

function animate(el,params,delay,callback){
    el.animate(params,delay,function(){
        if(callback){
            callback();
        }
    });
};

$(window).load(function(){
    animate($login, {
        top: '240px'
    },800,function(){
        animate($loading,{
            'opacity' : 0
        },300,null)
    });
});
