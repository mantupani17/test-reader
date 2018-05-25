'use strict'
const event = use('App/Models/Event')
class EventController {
    
    
    // get all events
    async getEvents({request, response}){
        let data = await event.all()  
        data = data.toJSON()
        //console.log(data)  
        
        for (var i = 0; i < data.length; i++)
             data[i].id = data[i]._id;
        
        response.send(data)
    }

    //add new event
    async addEvent({request, response}){
        const eventData = request.post()
        const mode = eventData['!nativeeditor_status']
        const new_event = new event()
        new_event.text = eventData.text
        new_event.start_date = eventData.start_date
        new_event.end_date = eventData.end_date
        let sid = eventData.id
        console.log(sid)
     if (mode == "inserted")
        await new_event.save();
    else if(mode == "deleted")
       {
            const delet_event = await event.find(sid)
            await delet_event.delete()
       }
    else if(mode == "updated"){
       // const delet_event = await event.find(sid)
        await event
                .query()
                    .where('_id', sid)
                        .update({ "start_date": eventData.start_date,"end_date": eventData.end_date,"text":eventData.text})
    }
    }

}

module.exports = EventController
