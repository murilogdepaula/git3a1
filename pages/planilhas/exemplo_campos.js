togoogle
<div class="col-lg-12 form-group">
    <div class="togglebutton">
         <label>
            O(s) prédio(s) encontra(m)-se em construção / reforma ?
            <input type="checkbox"
                    id="teste"
                    ng-model="teste"> 
        </label>
    </div>
</div>    

select
<div class=" col-lg-3">
    <div class="form-group label-static">
        <label for="risco" class="control-label">
         Texto
        </label>
        <select class="form-control" 
                ng-model="risco" 
                id="risco">
            <option value="#">Vertical</option>
            <option value="#">Horizontal</option>
        </select>
        <i class="fa fa-caret-down form-control-feedback"></i>
    </div>
</div>

input
<div class="col-lg-3">
    <div class="form-group label-static">
        <label for="teste" class="control-label">

        </label>
        <input type="text" 
                class="form-control" 
                id="teste"
                ng-model="teste"
                name="teste" >
    </div>
</div>
 raido
<div class="form-group">
    <label class="col-md-2 control-label">Condição</label>
    <div class="col-md-10">
        <div class="radio radio-primary">
            <label>
                <input type="radio" 
                        name="dados" 
                        id="dados1" 
                        value="" checked="">
                Propeietário
            </label>
        </div>
        <div class="radio radio-primary">
            <label>
                <input type="radio" 
                        name="dados" 
                        id="dados2" 
                        value="">
                   Locatário
            </label>
        </div>
     </div>
</div>

checkbox
<div class="row">
    <div class="form-group">
        <label class="col-lg-3 control-label" for="reforma">Teste</label>
        <div class="col-lg-9">
            <div class="checkbox">
                <label class="control-label">
                    <input type="checkbox" id="reforma"> Sim
                </label>
            </div>
        </div>
    </div>    
</div>

Text Area
<div class="form-group">
    <label for="risco_2_observacao" class="col-lg-12 control-label">
        
    </label>
    <div class="col-md-12">
         <textarea class="form-control" 
                     rows="3" 
                     id="risco_2_observacao"
                     ng-msodel="risco_2.observacao">
         </textarea>
    </div>
</div>  

painel 
<div class="row">
    <div class="col-lg-12">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title"> Dados </h3>
            </div>
            <div class="panel-body">
                <div class="row">
                </div>    
            </div>    
        </div>    
    </div>    
</div>    

modelo checked

<div class="col-lg-2">
    <div class="checkbox">
        <label class="control-label">
            <input type="checkbox" 
                    id="estrutura_paredes"
                    ng-model="estrutura.metalica"> Madeira
        </label>
    </div>
</div>