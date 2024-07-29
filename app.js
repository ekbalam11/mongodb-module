//Import 2 methods from the mongodb package
const { MongoClient, ServerApiVersion } = require("mongodb");

//Connection string of the mongodb database
const url = "mongodb+srv://balam:balam@cluster0.z4ejn4b.mongodb.net/";

//Create a Mongo Client with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);
//----------------Many objects: almost one for each property*
//async function
async function run() {
    try{
        //Connect the client to the server
        await client.connect();

        //Select the database
        const database= client.db("sample_mflix")

        //The database object now have a reference to the database
        const movies = database.collection("movies");

        //Create an object  to filter movies according to their filmed year.
        const query = { year: { $gt: 2000 } };

        //Object with options
        const options = {
            //I need only title and year
            projection: { _id: 0, title: 1, year: 1 },
            //We want to arrange by year in decresent 
            sort: { year: -1 },
            //Limit property "limits" the number of documents we want to recover
            limit: 5
        };

        //Executing the query
        const cursor = movies.find(query, options);
        //Print a message if no documents were found
        if((await movies.countDocuments(query)) === 0) {
            console.log("No documents found!");
        }

        //Print returned documents
        //For function will iterate the cursos for all the results of the query.
        for await (const doc of cursor) {
            console.dir(doc);
        }

    // This code block executes always: no matter if the "try" method got and error or not. 
    } finally {
        //Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);