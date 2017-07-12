'use strict';

const Enums = {

    /**
     * Enums.UserStatus
     * Tipo de usuario
     */
    USER_STATUS : {
        ACTIVE  : {_id : 0, description : 'ACTIVE', code : 'A'},
        DELETED : {_id : 1, description : 'DELETED', code : 'D'},
        BLOCKED : {_id : 2, description : 'BLOCKED', code : 'B'}
    },

    /**
     * Enums.UserStatus
     * Tipo de usuario
     */
    USER_TYPE : {
        ADMIN : {_id : 0, description : 'admin', code : 'A'},
        USER : {_id : 1, description : 'user', code : 'B'}
    },


    /**
     * Enums.UserStatus
     * Tipo de usuario
     */
    PEDIDO_STATUS : {
        NOVO : {_id : 0, description : 'Novo'},
        AGUARDANDO_DESLOCAMENTO : {_id : 1, description : 'Aguardando Deslocamento'},
        LIBERADO : {_id : 2, description : 'Liberado'},
        RECUSADO : {_id : 3, description : 'Recusado'},
        AGENDADO : {_id : 4, description : 'Agendado'},
        ENVIADO_PRESTADOR : {_id : 5, description : 'Vistoria em Execução'},
        VISTORIA_RECEBIDA : {_id : 6, description : 'Aguardando Transmissão'},
        FRUSTADO : {_id : 7, description : 'Frustado'},
        FINALIZADO : {_id : 8, description : 'Transmitido'},
        PENDENTE : {_id : 9, description : 'Pendente'},
        CANCELADO : {_id : 10, description : 'Cancelado'}
    }

};


