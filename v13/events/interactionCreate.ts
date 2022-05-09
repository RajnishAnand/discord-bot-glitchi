import {Event, ExtendInteraction} from '../Interfaces';

export const event : Event =  {
  name : 'interactionCreate',
  execute(client,interaction:ExtendInteraction){
    if (!(interaction.isAutocomplete()||interaction.isCommand()))return;

    const cmnd = client.slashCommands.get(interaction.commandName);
    if(!(cmnd && interaction.guildId)){
      return;
    };

    if(interaction.isAutocomplete()){
      if(!cmnd.autocompleteRun || interaction.responded)return;
      cmnd.autocompleteRun({client,interaction});
    }
    else if(!interaction.replied) 
      cmnd.run({client, interaction});
  }
}
