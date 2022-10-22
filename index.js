class Character {
  constructor(name) {
   this.name = name;
   this.skills = [];
 }

 addSkills(name, proficiency){
    this.skills.push(new Skills(name, proficiency));
 }
}

class Skills{
    constructor(skillName, proficiency){
    this.skillName = skillName;
    this.proficientcy = proficiency;
  }
}

class CharacterService {
    static url = 'https://635472aaccce2f8c0208f9a3.mockapi.io/api/v1/:endpoint'

    static getAllCharacters(){
        return $.get(this.url);
    }

    static getCharacter(id){
        return $.get(this.url + `/${id}`);
    }

    static createCharacter(Character) {
        return $.post(this.url, Character);
    }

    static updateCharacter(Character) {
        return $.ajax({
            url: this.url + `/${Character._id}`,
            dataType: 'json',
            data: JASON.stringify(Character),
            contentType: 'application/json',
            type: 'PUT'
        });
    }


    static deleteCharacter(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}


class DOMmanager {
    static Character;


    static getAllCharacters() {
     CharacterService.getAllCharacters().then(Character => this.render(Character));
    }

    static createCharacter(name){
        CharacterService.createCharacter(new Character(name))
        .then(() => {
            return CharacterService.getAllCharacters();
        })
        .then((Character) => this.render(Character));
    }

    static deleteCharacter(id){
        CharacterService.deleteCharacter(id)
            .then(() => {
                return CharacterService.getAllCharacters();
            })
            .then((Character) => this.render(Character));
    }

    static addSkills(id){
      for (let Character of this.Character){
        if (Character._id == id) {
          house.rooms.push(new Character($(`#${Character._id}-Skills-name`).val(), $(`#${Character._id}-Skills-Proficientcy`).val()));
          CharacterService.updateCharacter(Character) 
          .then(() => {
            return CharacterService.getAllCharacters();
          })
          .then((Character) => this.render(Character));
        }
      }
    }

    static deleteCharacter(Characterid, Skillsid){
      for(let Character of this.Character){
        if(Character.id == Characterid) {
          for(let Skills of Character.Skills){
            if(Skills.id == Skillsid){
              Character.Skills.splice(Character.Skills.indexOf(Skills), 1);
              CharacterService.updateCharacter(Character)
              .then(()=> {
                return CharacterService.getAllCharacters();
              })
              .then((Character) => this.render(Character));
            }
          }
        }
      }
    }

    static render(Character) {
        this.Character = Character;
        $('app').empty();
        for (let Character of Character) {
            $('app').prepend(
             `<div id="${Character._id}" class="card">
                <div class="card-header">
                  <h2>${Character.name}</h2>
                  <button class="btn btn-danger" onclick="DOMmanager.deleteCharachter('${Character._id}')">Delete</button>
                </div>  
                <div class="card-body">
                  <div class="card">
                    <div class="row"
                      <div class="col-sm">
                        <input type="text" id="${Character._id}-skill-name" class="form-control" placeholder ="Skill name">
                      </div>
                      <div class="col=sm"
                        <input type="text" id="${Character._id}-skill-proficiency" class="form-control" placeholder ="Skill Proficiency">
                      </div>
                    </div>
                    <button id="${Character._id}-new-skill" onclick=DOMmanager.addSkills('${Character._id}') class=btn btn-primary form-control">Add</button>
                  </div>
                </div>
             </div><br>`
            );
           for (let Skills of Character.Skills){
             $(`#${Character._id}`).find('.card-body').append(
                `<p>
                    <span id="name-${room._id}"><strong>Name: </strong> ${Skills.name}</span>
                    <span id="name-${room._id}"><strong>Proficentcy: </strong> ${Skills.proficiency}</span>
                    <button class="btn btn-danger" onclick="DOMmanager.deleteSkills('${Character._id}', '${Skills._id}')">Delete SKill</button>`
             );
           }
        }
    }
}

$('#create-new-Character').click(() => {
  DOMmanager.createCharacter($('new-character-name').val());
  $('#new-character-name').val('');
});

DOMmanager.getAllCharacters();