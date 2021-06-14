/**
 * @abstract a practice of mongo, just to see that everything works as expected 
 */

const {
    Person,
    Song,
    Comparison
} = require('./models')

const fetch = require('node-fetch');
const mongoose = require('mongoose')
const SPT_TOKEN = "BQDcd0wvch5m8-Ix4A-iQj1ZB1tC1xdQwPMhKeMl96PglYHaY140j0Q_t5ErPF6oINF-qFD9mWohW8YHyQ2esQRrEQicRB0NjmdmwD43rXw9oXPflmfoaUppf1jIpfaINSzIappRPxN1FVd3LqaTYW-FqoByRt5lEu2miGN-PFtuWDMktxoS4JJc-BB2AKZRwm1M6PTBRGO0Fftw1XstewBZS64L0tHwaRm4zRoKuV2PAbw1qV9z0viBfCyAvZz2BdCJLALNpmrRR9AxoTgdOzluwDqYGuaT21T-efx0XMNt"
//connection start

try {
    /*await*/
    mongoose.connect('mongodb://localhost:27017/mongoInJs102', { //will this work with out an await if I don't mind just letting the internal buffering do its thing? 
        useNewUrlParser: true, //they had an old parser they didn't like, now for example, you have to specify the port. always true unless it is preventing ur connection
        useUnifiedTopology: true, // use mongo's official engine for connections. reccomended as always true unless prevents stable connections
    });
} catch (err) {
    console.error('not connected to mongoDb!\n\n\n error is: ' + err);
}

mongoose.connection.on('error', (err) => {
    console.error('the following non-initial error occured: ' + err);
});


addUserToDb().then((returned => {
    console.log('addUserToDb returned: ', returned)
}));

console.log('-------------------------------------\n\n');

/*
//make the call again to see if the date is properly updated
addUserToDb().then((returned => {
    console.log('addUserToDb returned: ', returned)
}));
*/
async function addUserToDb() {


    //lets try to do the add to db: 
    let jsUserData = {};
    try {
        //we don't use spot requester here becuse we have already checked everything is valid
        const rawUserData = await fetch('https://api.spotify.com/v1/me', { //THIS MAY NOT WORK! CHECK 
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + SPT_TOKEN,
            }
        });
        jsUserData = await rawUserData.json();

        if (jsUserData.error) {
            console.error('error getting user fromSpt API: ', jsUserData.error);
            return {
                error: jsUserData.error
            };
        }

    } catch (err) {
        console.error(err);
        return {
            error: err
        };
    }


    console.log('the data of the authenticated user is: ', jsUserData, '\n\n(we added his spotify_id as cookie)');

    let foundUsers = {};
    try {
        foundUsers = await Person.find({
            spotId: jsUserData.id
        });
    } catch (err) {
        console.error(err);
        return {
            error: err
        }
    }

    console.log('Looking for that user, we found: ', foundUsers);

    if (foundUsers.length > 1) { //if more than one user with the same id, we have a problem
        console.error('there are ' + foundUsers.length + ' with the id ' + jsUserData.id);

    } else if (foundUsers.length === 1) { //we update the record 
        console.log('the record we found is: ', foundUsers[0]);
        const dateNow = new Date();
        foundUsers[0].lastAccesed = dateNow;


        foundUsers[0].save(err => console.error(err));


        console.log('lastAcccesed updated to: ', dateNow);

    } else if (foundUsers.length === 0) {
        const authedPerson = new Person({
            name: jsUserData.display_name,

            spotId: jsUserData.id,

            imageHref: jsUserData.images[0].url,
            lastAccesed: new Date(),

        });

        authedPerson.save(err => console.error(err)); //can create a global error handling function


        console.log('User is (supposadly) saved to the DB!');
    } else {
        console.error('some strange error occured. Probably retrieval from db went bad');
        return {
            error: 'some strange error occured. Probably retrieval from db went bad'
        };
    }

    return {
        status: 200,
        messege: 'Everything is proper. No issues detected.'
    }
}